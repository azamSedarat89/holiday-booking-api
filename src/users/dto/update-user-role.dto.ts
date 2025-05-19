import { IsEnum } from 'class-validator';
import { UserRole } from '../enum/user-role.enum';

export class UpdateUserRoleDto {
  @IsEnum(UserRole)
  role!: UserRole;
}
