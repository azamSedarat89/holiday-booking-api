import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
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
      created_at: new Date(),
    },
    {
      id: 2,
      email: 'test2@mail.com',
      password: 'hashed',
      name: 'Test Two',
      role: UserRole.USER,
      bookings: [],
      created_at: new Date(),
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
    findAndCount: jest.fn().mockResolvedValue([mockUsers, mockUsers.length]),
    findOne: jest.fn(({ where }: any) => {
      if (where?.email) {
        const found = mockUsers.find((u) => u.email === where.email);
        return Promise.resolve(found ?? null);
      }
      if (where?.id) {
        const found = mockUsers.find((u) => u.id === where.id);
        return Promise.resolve(found ?? null);
      }
      return Promise.resolve(null);
    }),
    update: jest.fn(),
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
        password: '12345678', // at least 8 chars now
        name: 'Test User',
      };

      // No existing user with this email:
      mockRepository.findOne.mockResolvedValueOnce(null);

      const hashSpy = jest
        .spyOn(bcrypt, 'hash')
        .mockResolvedValue('hashed_password' as never);

      const result = await service.create(createUserDto);

      expect(hashSpy).toHaveBeenCalledWith('12345678', 10);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashed_password',
      });
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result.email).toBe(createUserDto.email);
    });

    it('should throw ConflictException if email already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test1@mail.com', // exists in mockUsers
        password: '12345678',
        name: 'Test User',
      };

      mockRepository.findOne.mockResolvedValueOnce(mockUsers[0]);

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw BadRequestException if password is too short', async () => {
      const createUserDto: CreateUserDto = {
        email: 'new@mail.com',
        password: 'short', // less than 8
        name: 'Test User',
      };

      mockRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.create(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const result = await service.findAll();
      expect(result.users).toHaveLength(2);
      expect(result.count).toBe(2);
      expect(mockRepository.findAndCount).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = await service.findOne(1);
      expect(user.id).toBe(1);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateRole', () => {
    it('should update the user role and return the updated user', async () => {
      const userId = 1;
      const newRole = UserRole.ADMIN;

      // Mock the update method to resolve successfully
      mockRepository.update = jest.fn().mockResolvedValue({ affected: 1 });

      // Mock findOne to return user with updated role
      mockRepository.findOne = jest.fn().mockResolvedValue({
        ...mockUsers[0],
        role: newRole,
      });

      const result = await service.updateRole(userId, newRole);

      expect(mockRepository.update).toHaveBeenCalledWith(
        { id: userId },
        { role: newRole },
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result.role).toBe(newRole);
    });

    it('should throw NotFoundException if user to update does not exist', async () => {
      const userId = 99;
      const newRole = UserRole.ADMIN;

      mockRepository.update = jest.fn().mockResolvedValue({ affected: 0 });

      mockRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.updateRole(userId, newRole)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockRepository.update).toHaveBeenCalledWith(
        { id: userId },
        { role: newRole },
      );
    });
  });
});
