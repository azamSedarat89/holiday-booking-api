import { Controller, Get, ParseIntPipe, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from './enum/user-role.enum';
import { AllUserDto } from './dto/all-user.dto';
import {
  SwaggerFindAll,
  SwaggerFindOne,
} from 'src/common/decorators/swagger-crud.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @SwaggerFindAll('Get all users', AllUserDto)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @SwaggerFindOne('Get a user by ID', UserDto)
  @Roles(UserRole.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }
}
