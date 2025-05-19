import { Test, TestingModule } from '@nestjs/testing';
import { DestinationsService } from './destinations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Destination } from './entities/destination.entity';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';

describe('DestinationsService', () => {
  let service: DestinationsService;
  let repo: Partial<Repository<Destination>>;

  const mockDestinations: Destination[] = [
    {
      id: 1,
      name: 'A',
      description: 'Desc A',
      location: 'Loc A',
      price: 100,
      rating: 4.5,
      bookings: [],
      created_at: new Date(),
    },
    {
      id: 2,
      name: 'B',
      description: 'Desc B',
      location: 'Loc B',
      price: 200,
      rating: 3.8,
      bookings: [],
      created_at: new Date(),
    },
  ];

  beforeEach(async () => {
    const createQueryBuilderMock = {
      where: jest.fn(function (this: any, arg: any) {
        if (
          arg &&
          typeof arg === 'object' &&
          typeof arg.whereFactory === 'function'
        ) {
          arg.whereFactory(this);
        }
        return this;
      }),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(mockDestinations),
    };

    repo = {
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockImplementation(async (dest) => ({ id: 1, ...dest })),
      findOne: jest
        .fn()
        .mockImplementation(({ where: { id } }) =>
          Promise.resolve(mockDestinations.find((d) => d.id === id) || null),
        ),
      createQueryBuilder: jest.fn().mockReturnValue(createQueryBuilderMock),
      remove: jest.fn().mockResolvedValue(null),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DestinationsService,
        { provide: getRepositoryToken(Destination), useValue: repo },
      ],
    }).compile();

    service = module.get<DestinationsService>(DestinationsService);
  });

  describe('create', () => {
    it('should create and return a destination', async () => {
      const dto: CreateDestinationDto = {
        name: 'New',
        description: 'New desc',
        location: 'New loc',
        price: 150,
        rating: 4.0,
      };
      const result = await service.create(dto);
      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalled();
      expect(result).toEqual({ id: 1, ...dto });
    });
  });

  describe('findAll', () => {
    it('should return all destinations without filters', async () => {
      const result = await service.findAll({});
      expect(repo.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual(mockDestinations);
    });

    it('should apply filters', async () => {
      const filters = { minPrice: 100, location: 'Loc A' };
      const result = await service.findAll(filters);

      const qb = (repo.createQueryBuilder as jest.Mock).mock.results[0].value;

      expect(qb.where).toHaveBeenCalled();
      expect(qb.andWhere).toHaveBeenCalledWith('d.price >= :minPrice', {
        minPrice: 100,
      });
      expect(qb.andWhere).toHaveBeenCalledWith('d.location ILIKE :loc', {
        loc: `%Loc A%`,
      });
      expect(qb.orderBy).toHaveBeenCalled();
      expect(result).toEqual(mockDestinations);
    });

    it('should throw BadRequestException if minPrice > maxPrice', async () => {
      await expect(
        service.findAll({ minPrice: 200, maxPrice: 100 }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should return a destination by id', async () => {
      const dest = await service.findOne(1);
      expect(dest.id).toBe(1);
    });
    it('should throw NotFoundException if not found', async () => {
      (repo.findOne as jest.Mock).mockResolvedValueOnce(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return destination', async () => {
      const dto: UpdateDestinationDto = { price: 180 };
      const result = await service.update(1, dto);
      expect(repo.save).toHaveBeenCalled();
      expect(result.price).toBe(180);
    });
    it('should throw NotFoundException if not found', async () => {
      (repo.findOne as jest.Mock).mockResolvedValueOnce(null);
      await expect(service.update(99, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove destination', async () => {
      const res = await service.remove(1);
      expect(repo.remove).toHaveBeenCalled();
      expect(res).toEqual({ deleted: true });
    });
    it('should throw NotFoundException if not found', async () => {
      (repo.findOne as jest.Mock).mockResolvedValueOnce(null);
      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });
  });
});
