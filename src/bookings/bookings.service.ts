import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { DestinationsService } from '../destinations/destinations.service';
import { UsersService } from '../users/users.service';
import { PaymentService } from '../payments/payment.service';
import { BookingStatus } from './enum/bookking-status.enum';

/**
 * Manages the booking lifecycle: validation, payment, persistence.
 */
@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly destinationsService: DestinationsService,
    private readonly usersService: UsersService,
    private readonly paymentService: PaymentService,
  ) {}

  /**
   * Create a booking for the given user.
   *
   * @throws BadRequestException  invalid dates, overlap, or payment failure.
   * @throws NotFoundException    destination or user not found.
   */
  async create(
    userId: number,
    { destinationId, start_date, end_date }: CreateBookingDto,
  ): Promise<Booking> {
    // Validate date order
    if (new Date(start_date) > new Date(end_date)) {
      throw new BadRequestException('start_date cannot be after end_date');
    }

    // Fetch destination & user in parallel
    const [destination, user] = await Promise.all([
      this.destinationsService.findOne(destinationId),
      this.usersService.findOne(userId),
    ]);
    if (!destination) throw new NotFoundException('Destination not found');
    if (!user) throw new NotFoundException('User not found');

    // Detect overlapping bookings
    const overlap = await this.bookingRepository.findOne({
      where: {
        destination: { id: destinationId },
        start_date: Between(start_date, end_date),
      },
      select: ['id'], // fetch the bare minimum
    });
    if (overlap) {
      throw new BadRequestException(
        'The destination is already booked for the selected dates',
      );
    }

    // Calculate price & process payment
    const msPerDay = 86_400_000; // 1000*60*60*24
    const nights =
      Math.floor(
        (new Date(end_date).getTime() - new Date(start_date).getTime()) /
          msPerDay,
      ) + 1;

    const total_price = nights * destination.price;

    const payment = await this.paymentService.processPayment(total_price);
    if (payment.status === 'failed') {
      throw new BadRequestException(`Payment failed: ${payment.errorMessage}`);
    }

    // Persist booking
    const booking = this.bookingRepository.create({
      user,
      destination,
      start_date,
      end_date,
      total_price,
      status: BookingStatus.CONFIRMED,
      transaction_id: payment.transaction_id,
    });

    return this.bookingRepository.save(booking);
  }

  /** List all bookings belonging to a user, newest first. */
  findAll(userId: number): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { user: { id: userId } },
      relations: ['destination', 'user'],
      order: { created_at: 'DESC' },
    });
  }

  /** Fetch a single booking that belongs to the user. */
  async findOne(id: number, userId: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['destination', 'user'],
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  /** Patch update – restricted to owner. */
  async update(
    id: number,
    userId: number,
    updateDto: UpdateBookingDto,
  ): Promise<Booking> {
    const booking = await this.findOne(id, userId);
    Object.assign(booking, updateDto);
    return this.bookingRepository.save(booking);
  }

  /** Delete – restricted to owner. */
  async remove(id: number, userId: number): Promise<{ deleted: true }> {
    const booking = await this.findOne(id, userId);
    await this.bookingRepository.remove(booking);
    return { deleted: true };
  }
}
