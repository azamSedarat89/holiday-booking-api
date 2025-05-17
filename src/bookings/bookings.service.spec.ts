import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Repository } from 'typeorm';
import { DestinationsService } from '../destinations/destinations.service';
import { UsersService } from '../users/users.service';
import { PaymentService } from 'src/payments/payment.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Destination } from 'src/destinations/entities/destination.entity';
import { User } from 'src/users/entities/user.entity';
import { UserRole } from 'src/users/enum/user-role.enum';

describe('BookingsService', () => {
  let service: BookingsService;
  let bookingRepo: Repository<Booking>;
  let destinationsService: Partial<DestinationsService>;
  let usersService: Partial<UsersService>;
  let paymentService: Partial<PaymentService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getRepositoryToken(Booking),
          useClass: Repository,
        },
        {
          provide: DestinationsService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: PaymentService,
          useValue: {
            processPayment: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    bookingRepo = module.get<Repository<Booking>>(getRepositoryToken(Booking));
    destinationsService = module.get<DestinationsService>(DestinationsService);
    usersService = module.get<UsersService>(UsersService);
    paymentService = module.get<PaymentService>(PaymentService);
  });

  describe('create', () => {
    const mockCreateDto = {
      destinationId: 1,
      startDate: '2025-06-01',
      endDate: '2025-06-05',
    };

    const mockUser = {
      id: 1,
      name: 'Amin',
      email: 'amin@example.com',
      role: UserRole.USER,
    };
    const mockDestination = {
      id: 1,
      name: 'Paris',
      price: 100,
      description: 'A beautiful city',
      location: 'France',
      rating: 4.5,
      bookings: [],
    };

    it('should create booking successfully if payment succeeds', async () => {
      jest
        .spyOn(destinationsService, 'findOne')
        .mockResolvedValue(mockDestination);
      jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(bookingRepo, 'findOne').mockResolvedValue(null); // no overlap
      jest.spyOn(paymentService, 'processPayment').mockResolvedValue({
        status: 'success',
        transactionId: 'tx123',
      });
      jest
        .spyOn(bookingRepo, 'create')
        .mockImplementation((data) => data as Booking);
      jest
        .spyOn(bookingRepo, 'save')
        .mockImplementation(async (booking) => booking as Booking);

      const result = await service.create(1, mockCreateDto);

      expect(result.totalPrice).toBe(500); // 5 days * 100
      expect(result.status).toBe('confirmed');
      expect(result.transactionId).toBe('tx123');
    });

    it('should throw error if payment fails', async () => {
      jest
        .spyOn(destinationsService, 'findOne')
        .mockResolvedValue(mockDestination as Destination);
      jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUser as User);

      jest.spyOn(bookingRepo, 'findOne').mockResolvedValue(null);
      jest.spyOn(paymentService, 'processPayment').mockResolvedValue({
        status: 'failed',
        errorMessage: 'Insufficient funds',
      });

      await expect(service.create(1, mockCreateDto)).rejects.toThrow(
        new BadRequestException('Payment failed: Insufficient funds'),
      );
    });

    it('should throw error if startDate is after endDate', async () => {
      const invalidDto = {
        ...mockCreateDto,
        startDate: '2025-06-10',
        endDate: '2025-06-05',
      };

      await expect(service.create(1, invalidDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw if destination not found', async () => {
      jest
        .spyOn(destinationsService, 'findOne')
        .mockResolvedValue(null as unknown as Destination);

      await expect(service.create(1, mockCreateDto)).rejects.toThrow(
        new NotFoundException('Destination not found'),
      );
    });

    it('should throw if booking overlaps', async () => {
      jest
        .spyOn(destinationsService, 'findOne')
        .mockResolvedValue(mockDestination);
      jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUser);
      jest
        .spyOn(bookingRepo, 'findOne')
        .mockResolvedValue({ id: 99 } as Booking); // overlap

      await expect(service.create(1, mockCreateDto)).rejects.toThrow(
        new BadRequestException(
          'The destination is already booked for the selected dates',
        ),
      );
    });
  });
});
