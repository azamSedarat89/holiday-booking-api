import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { UserDto } from './user.dto';

export class AllUserDto {
  @ApiProperty({ example: 1, description: 'Count of users' })
  count: number;

  @ApiProperty({
    example: {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      role: 'user',
    },
    description: 'List of users',
  })
  users: UserDto[];

  constructor(data: User[], count: number) {
    this.count = count;
    this.users = data.map((user) => new UserDto(user));
  }
}
