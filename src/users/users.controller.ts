import {
  Controller,
  Get,
  ParseIntPipe,
  Param,
  UseGuards,
  Patch,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from './enum/user-role.enum';
import { AllUserDto } from './dto/all-user.dto';
import {
  SwaggerFindAll,
  SwaggerFindOne,
  SwaggerPatch,
} from 'src/common/decorators/swagger-crud.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@ApiTags('users')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @SwaggerFindAll('user', AllUserDto, 'find all users (admin-only)')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @SwaggerFindOne('user', UserDto, 'find a user by ID (admin-only)')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id/role')
  @SwaggerPatch('user', UserDto, 'Change a user’s role (admin-only)')
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserRoleDto,
  ) {
    return this.usersService.updateRole(id, body.role);
  }
}
