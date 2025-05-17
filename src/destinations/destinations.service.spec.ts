import { Test, TestingModule } from '@nestjs/testing';
import { DestinationsService } from './destinations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Destination } from './entities/destination.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
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
    },
    {
      id: 2,
      name: 'B',
      description: 'Desc B',
      location: 'Loc B',
      price: 200,
      rating: 3.8,
      bookings: [],
    },
  ];

  beforeEach(async () => {
    repo = {
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockImplementation(async (dest) => ({ id: 1, ...dest })),
      findOneBy: jest
        .fn()
        .mockImplementation(({ id }) =>
          Promise.resolve(mockDestinations.find((d) => d.id === id) || null),
        ),
      createQueryBuilder: jest.fn().mockReturnValue({
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockDestinations),
      }),
      remove: jest.fn().mockResolvedValue(null),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DestinationsService,
        { provide: getRepositoryToken(Destination), useValue: repo },
      ],
    }).compile();

    service = module.get(DestinationsService);
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
      await service.findAll({ minPrice: 100, location: 'Loc A' });
      const qb = (repo.createQueryBuilder as jest.Mock).mock.results[0].value;
      expect(qb.andWhere).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a destination by id', async () => {
      const dest = await service.findOne(1);
      expect(dest.id).toBe(1);
    });
    it('should throw NotFoundException if not found', async () => {
      (repo.findOneBy as jest.Mock).mockResolvedValue(null);
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
      (repo.findOneBy as jest.Mock).mockResolvedValue(null);
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
      (repo.findOneBy as jest.Mock).mockResolvedValue(null);
      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });
  });
});
