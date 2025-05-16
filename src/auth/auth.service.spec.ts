import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { UserRole } from 'src/users/enum/user-role.enum';
import { UserDto } from 'src/users/dto/user.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    password: 'hashed_password',
    name: 'Test User',
    role: UserRole.USER,
    bookings: [],
  };

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('validateUser', () => {
    it('should return UserDto if email and password are valid', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await authService.validateUser(
        'test@example.com',
        'password',
      );

      expect(usersService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(result).toEqual(new UserDto(mockUser));
    });

    it('should return null if user not found', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);

      const result = await authService.validateUser(
        'test@example.com',
        'password',
      );

      expect(result).toBeNull();
    });

    it('should return null if password does not match', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      const result = await authService.validateUser(
        'test@example.com',
        'wrongpassword',
      );

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token on successful login', async () => {
      (jwtService.sign as jest.Mock).mockReturnValue('jwt_token');

      const result = await authService.login(new UserDto(mockUser));

      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
        role: mockUser.role,
      });
      expect(result).toEqual({ access_token: 'jwt_token' });
    });
  });

  describe('register', () => {
    it('should throw ConflictException if user already exists', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        authService.register({
          email: mockUser.email,
          password: '123456',
          name: 'Test User',
        }),
      ).rejects.toThrow('User with this email already exists');
    });

    it('should create and return new user', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
      (usersService.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.register({
        email: mockUser.email,
        password: '123456',
        name: 'Test User',
      });

      expect(usersService.findByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(usersService.create).toHaveBeenCalledWith({
        email: mockUser.email,
        password: '123456',
        name: 'Test User',
      });
      expect(result).toEqual(mockUser);
    });
  });
});
