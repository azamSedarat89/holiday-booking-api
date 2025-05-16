import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../enum/user-role.enum';
import { User } from '../entities/user.entity';

export class UserDto {
  @ApiProperty({ example: 1, description: 'Unique identifier of the user' })
  id: number;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address of the user',
  })
  email: string;

  @ApiProperty({
    example: 'Azam Sedarat',
    description: 'Full name of the user',
  })
  name: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.USER,
    description: 'Role of the user in the system',
  })
  role: UserRole;

  constructor(data: User) {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.role = data.role;
  }
}
