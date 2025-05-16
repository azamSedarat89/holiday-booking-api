import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../enum/user-role.enum';

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
}
