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
import { BookingStatus } from './enum/bookking-status.enum';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private destinationsService: DestinationsService,
    private usersService: UsersService,
  ) {}

  async create(userId: number, createDto: CreateBookingDto): Promise<Booking> {
    const { destinationId, startDate, endDate } = createDto;

    if (new Date(startDate) > new Date(endDate)) {
      throw new BadRequestException('startDate cannot be after endDate');
    }

    const destination = await this.destinationsService.findOne(destinationId);
    if (!destination) {
      throw new NotFoundException('Destination not found');
    }

    // بررسی وجود رزرو تداخل کننده
    const overlappingBookings = await this.bookingRepository.findOne({
      where: {
        destination: { id: destinationId },
        startDate: Between(startDate, endDate),
      },
    });

    if (overlappingBookings) {
      throw new BadRequestException(
        'The destination is already booked for the selected dates',
      );
    }

    // کاربر را پیدا می‌کنیم
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // محاسبه تعداد روز و قیمت کل
    const daysCount =
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 3600 * 24) +
      1;
    const totalPrice = daysCount * destination.price;

    const booking = this.bookingRepository.create({
      user,
      destination,
      startDate,
      endDate,
      totalPrice,
      status: BookingStatus.PENDING,
    });

    return this.bookingRepository.save(booking);
  }

  async findAll(userId: number): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { user: { id: userId } },
      relations: ['destination', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['destination', 'user'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async update(
    id: number,
    userId: number,
    updateDto: UpdateBookingDto,
  ): Promise<Booking> {
    const booking = await this.findOne(id, userId);

    Object.assign(booking, updateDto);
    return this.bookingRepository.save(booking);
  }

  async remove(id: number, userId: number): Promise<{ deleted: boolean }> {
    const booking = await this.findOne(id, userId);
    await this.bookingRepository.remove(booking);
    return { deleted: true };
  }
}
