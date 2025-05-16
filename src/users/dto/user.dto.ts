import { UserRole } from '../enum/user-role.enum';

export class UserDto {
  id: number;
  email: string;
  name: string;
  role: UserRole;
}
