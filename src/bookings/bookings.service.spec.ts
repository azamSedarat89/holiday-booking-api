import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { DestinationsService } from '../destinations/destinations.service';
import { UsersService } from '../users/users.service';
import { PaymentService } from '../payments/payment.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BookingStatus } from './enum/bookking-status.enum';
import { Destination } from 'src/destinations/entities/destination.entity';
import { User } from 'src/users/entities/user.entity';

const mockRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
});

const mockDestinationsService = () => ({ findOne: jest.fn() });
const mockUsersService = () => ({ findOne: jest.fn() });
const mockPaymentService = () => ({ processPayment: jest.fn() });

describe('BookingsService', () => {
  let service: BookingsService;
  let bookingRepo: jest.Mocked<Repository<Booking>>;
  let destinationsSvc: ReturnType<typeof mockDestinationsService>;
  let usersSvc: ReturnType<typeof mockUsersService>;
  let paymentSvc: ReturnType<typeof mockPaymentService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: getRepositoryToken(Booking), useFactory: mockRepo },
        { provide: DestinationsService, useFactory: mockDestinationsService },
        { provide: UsersService, useFactory: mockUsersService },
        { provide: PaymentService, useFactory: mockPaymentService },
      ],
    }).compile();

    service = module.get(BookingsService);

    bookingRepo = module.get<jest.Mocked<Repository<Booking>>>(
      getRepositoryToken(Booking),
    );

    destinationsSvc = module.get(DestinationsService);
    usersSvc = module.get(UsersService);
    paymentSvc = module.get(PaymentService);
  });

  describe('create()', () => {
    const userId = 1;
    const dto = {
      destinationId: 10,
      start_date: '2025-05-20',
      end_date: '2025-05-22',
    };

    it('throws if start_date is after end_date', async () => {
      await expect(
        service.create(userId, {
          ...dto,
          start_date: '2025-05-23',
          end_date: '2025-05-22',
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('throws if destination not found', async () => {
      destinationsSvc.findOne.mockResolvedValue(null);
      usersSvc.findOne.mockResolvedValue({ id: userId });

      await expect(service.create(userId, dto)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('throws if user not found', async () => {
      destinationsSvc.findOne.mockResolvedValue({
        id: dto.destinationId,
        price: 20,
      });
      usersSvc.findOne.mockResolvedValue(null);

      await expect(service.create(userId, dto)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('throws on overlapping booking', async () => {
      destinationsSvc.findOne.mockResolvedValue({
        id: dto.destinationId,
        price: 100,
      });
      usersSvc.findOne.mockResolvedValue({ id: userId });
      // bookings.service.spec.ts
      bookingRepo.findOne.mockResolvedValue({ id: 777 } as unknown as Booking);

      await expect(service.create(userId, dto)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('throws on payment failure', async () => {
      destinationsSvc.findOne.mockResolvedValue({
        id: dto.destinationId,
        price: 50,
      });
      usersSvc.findOne.mockResolvedValue({ id: userId });
      bookingRepo.findOne.mockResolvedValue(null);
      paymentSvc.processPayment.mockResolvedValue({
        status: 'failed',
        errorMessage: 'declined',
      });

      await expect(service.create(userId, dto)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('persists and returns booking on success', async () => {
      const destination = {
        id: dto.destinationId,
        price: 50,
      } as Destination;

      const user = {
        id: userId,
      } as User;

      const saved = {
        id: 99,
        status: BookingStatus.CONFIRMED,
      } as unknown as Booking;

      destinationsSvc.findOne.mockResolvedValue(destination);
      usersSvc.findOne.mockResolvedValue(user);
      bookingRepo.findOne.mockResolvedValue(null);
      paymentSvc.processPayment.mockResolvedValue({
        status: 'success',
        transaction_id: 'tx123',
      });

      bookingRepo.create.mockReturnValue({
        id: 0,
        user,
        destination,
        start_date: dto.start_date,
        end_date: dto.end_date,
        total_price: 150,
        status: BookingStatus.CONFIRMED,
        transaction_id: 'tx123',
        created_at: new Date(),
      });

      bookingRepo.save.mockResolvedValue(saved);

      const result = await service.create(userId, dto);

      expect(bookingRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          user,
          destination,
          total_price: 150,
          status: BookingStatus.CONFIRMED,
          transaction_id: 'tx123',
        }),
      );
      expect(result).toBe(saved);
    });
  });
});
