import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { AllUserDto } from './dto/all-user.dto';
import { UserRole } from './enum/user-role.enum';

const SALT_ROUNDS = 10;

/** CRUD + helper methods for User entity */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /** Register a new user */
  async create(createDto: CreateUserDto): Promise<UserDto> {
    // Check uniqueness of email
    const existing = await this.usersRepository.findOne({
      where: { email: createDto.email },
      select: ['id'],
    });
    if (existing) throw new ConflictException('Email already in use');

    if (createDto.password.length < 8)
      throw new BadRequestException('Password must be at least 8 characters');

    const hashedPassword = await bcrypt.hash(createDto.password, SALT_ROUNDS);

    const user = this.usersRepository.create({
      ...createDto,
      password: hashedPassword,
    });

    const saved = await this.usersRepository.save(user);
    return new UserDto(saved);
  }

  /** Return paginated list (all for now) */
  async findAll(): Promise<AllUserDto> {
    const [users, count] = await this.usersRepository.findAndCount();
    return new AllUserDto(users, count);
  }

  /** Find user by primary key */
  async findOne(id: number): Promise<UserDto> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return new UserDto(user);
  }

  /** Raw user lookup for auth */
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  /** change user role by admin */
  async updateRole(id: number, role: UserRole) {
    await this.usersRepository.update({ id }, { role });
    return this.findOne(id);
  }

  /** Register default admin user */
  async createDefaultAdmin(): Promise<void> {
    const adminExists = await this.usersRepository.findOne({
      where: { email: 'admin@example.com' },
    });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('adminPassword123', 10);

      const adminUser = this.usersRepository.create({
        name: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: UserRole.ADMIN,
      });

      await this.usersRepository.save(adminUser);
      return;
    }
  }
}
