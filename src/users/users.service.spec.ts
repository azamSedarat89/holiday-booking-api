import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { NotFoundException } from '@nestjs/common';
import { UserRole } from './enum/user-role.enum';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUsers: User[] = [
    {
      id: 1,
      email: 'test1@mail.com',
      password: 'hashed',
      name: 'Test One',
      role: UserRole.USER,
      bookings: [],
    },
    {
      id: 2,
      email: 'test2@mail.com',
      password: 'hashed',
      name: 'Test Two',
      role: UserRole.USER,
      bookings: [],
    },
  ];

  const mockRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation(async (user) => ({
      id: 1,
      ...user,
      role: UserRole.USER,
      bookings: [],
    })),
    find: jest.fn().mockResolvedValue(mockUsers),
    findOneBy: jest.fn((criteria) => {
      const found = mockUsers.find((u) => u.id === criteria.id);
      return Promise.resolve(found ?? null);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should hash password and save user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@mail.com',
        password: '123456',
        name: 'Test User',
      };

      const hashSpy = jest
        .spyOn(bcrypt, 'hash' as never)
        .mockResolvedValue('hashed_password' as never);

      const result = await service.create(createUserDto);

      expect(hashSpy).toHaveBeenCalledWith('123456', 10);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashed_password',
      });
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result.email).toBe(createUserDto.email);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const result = await service.findAll();
      expect(result).toHaveLength(2);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = await service.findOne(1);
      expect(user.id).toBe(1);
    });

    it('should throw NotFoundException if user not found', async () => {
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });
});
