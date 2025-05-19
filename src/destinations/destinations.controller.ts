import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DestinationsService } from './destinations.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { DestinationDto } from './dto/destination.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/enum/user-role.enum';
import {
  SwaggerCreate,
  SwaggerDelete,
  SwaggerFindAll,
  SwaggerFindOne,
  SwaggerUpdate,
} from 'src/common/decorators/swagger-crud.decorator';
import { DestinationFilterDto } from './dto/destination-filter.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('destinations')
@Controller('destinations')
export class DestinationsController {
  constructor(private readonly service: DestinationsService) {}

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  @SwaggerCreate(
    'destination',
    DestinationDto,
    'create a destination (admin-only)',
  )
  async create(@Body() dto: CreateDestinationDto): Promise<DestinationDto> {
    const destination = await this.service.create(dto);
    return new DestinationDto(destination);
  }

  @Get()
  @SwaggerFindAll(
    'destinations',
    DestinationDto,
    'List destinations with filters',
  )
  async findAll(
    @Query() filters: DestinationFilterDto,
  ): Promise<DestinationDto[]> {
    const destinations = await this.service.findAll(filters);
    return destinations.map((dest) => new DestinationDto(dest));
  }

  @Get(':id')
  @SwaggerFindOne('destination', DestinationDto)
  async findOne(@Param('id') id: number): Promise<DestinationDto> {
    const destination = await this.service.findOne(id);
    return new DestinationDto(destination);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  @SwaggerUpdate(
    'destination',
    DestinationDto,
    'update a destination (admin-only)',
  )
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateDestinationDto,
  ): Promise<DestinationDto> {
    const destination = await this.service.update(id, dto);
    return new DestinationDto(destination);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @SwaggerDelete('destination', 'remove a destination (admin-only)')
  remove(@Param('id') id: number): Promise<{ deleted: boolean }> {
    return this.service.remove(id);
  }
}
