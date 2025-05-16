import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { UserDto } from 'src/users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserDto | null> {
    const user = await this.usersService.findByEmail(email);
    if (
      user &&
      user.password &&
      (await bcrypt.compare(password, user.password))
    ) {
      return new UserDto(user);
    }
    return null;
  }

  async login(user: UserDto): Promise<{ access_token: string }> {
    const payload = { email: user.email, sub: user.id, role: user.role };

    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }

  async register(registerDto: RegisterDto): Promise<UserDto> {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    return await this.usersService.create(registerDto);
  }
}
