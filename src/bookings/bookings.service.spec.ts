import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Repository } from 'typeorm';
import { DestinationsService } from '../destinations/destinations.service';
import { UsersService } from '../users/users.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingStatus } from './enum/bookking-status.enum';

describe('BookingsService', () => {
  let service: BookingsService;
  let bookingRepo: Repository<Booking>;
  let destinationsService: Partial<DestinationsService>;
  let usersService: Partial<UsersService>;

  beforeEach(async () => {
    destinationsService = {
      findOne: jest.fn(),
    };
    usersService = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getRepositoryToken(Booking),
          useClass: Repository,
        },
        {
          provide: DestinationsService,
          useValue: destinationsService,
        },
        {
          provide: UsersService,
          useValue: usersService,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    bookingRepo = module.get<Repository<Booking>>(getRepositoryToken(Booking));
  });

  describe('create', () => {
    it('should throw NotFoundException if destination not found', async () => {
      (destinationsService.findOne as jest.Mock).mockResolvedValue(null);

      const dto: CreateBookingDto = {
        destinationId: 99,
        startDate: '2025-01-01',
        endDate: '2025-01-10',
      };

      await expect(service.create(1, dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if startDate > endDate', async () => {
      (destinationsService.findOne as jest.Mock).mockResolvedValue({ id: 1 });
      (usersService.findOne as jest.Mock).mockResolvedValue({ id: 1 });

      const dto: CreateBookingDto = {
        destinationId: 1,
        startDate: '2025-01-10',
        endDate: '2025-01-01',
      };

      await expect(service.create(1, dto)).rejects.toThrow(BadRequestException);
    });

    it('should create and save booking successfully', async () => {
      const destination = { id: 1, price: 100 };
      const user = { id: 1 };

      const dto: CreateBookingDto = {
        destinationId: 1,
        startDate: '2025-01-01',
        endDate: '2025-01-05',
      };

      const mockBooking: Partial<Booking> = {
        id: 1,
        user: user as unknown as Booking['user'],
        destination: destination as unknown as Booking['destination'],
        startDate: dto.startDate,
        endDate: dto.endDate,
        totalPrice: 500,
        status: BookingStatus.PENDING,
      };

      (destinationsService.findOne as jest.Mock).mockResolvedValue(destination);
      (usersService.findOne as jest.Mock).mockResolvedValue(user);
      jest.spyOn(bookingRepo, 'findOne').mockResolvedValue(null); // no overlapping booking
      jest.spyOn(bookingRepo, 'create').mockReturnValue(mockBooking as Booking);
      jest.spyOn(bookingRepo, 'save').mockResolvedValue(mockBooking as Booking);

      const result = await service.create(1, dto);

      expect(result).toEqual(mockBooking);
    });
  });
});
