import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserAuth } from 'src/common/decorators/user-auth.decorator';
import {
  SwaggerCreate,
  SwaggerDelete,
  SwaggerFindAll,
  SwaggerFindOne,
  SwaggerUpdate,
} from 'src/common/decorators/swagger-crud.decorator';
import { BookingDto } from './dto/booking.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/enum/user-role.enum';

@ApiTags('bookings')
@ApiBearerAuth()
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @SwaggerCreate('booking', BookingDto)
  async create(
    @UserAuth('sub') userId: number,
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<BookingDto> {
    const booking = await this.bookingsService.create(
      +userId,
      createBookingDto,
    );
    return new BookingDto(booking);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  @SwaggerFindAll('booking', BookingDto, ' list of booking (admin-only)')
  async findAll(@UserAuth('sub') userId: number): Promise<BookingDto[]> {
    const bookings = await this.bookingsService.findAll(+userId);
    return bookings.map((booking) => new BookingDto(booking));
  }

  @Get(':id')
  @SwaggerFindOne('booking', BookingDto)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @UserAuth('sub') userId: number,
  ): Promise<BookingDto> {
    const booking = await this.bookingsService.findOne(id, userId);
    return new BookingDto(booking);
  }

  @Patch(':id')
  @SwaggerUpdate('booking', BookingDto)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UserAuth('sub') userId: number,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    const booking = await this.bookingsService.update(
      id,
      userId,
      updateBookingDto,
    );
    return new BookingDto(booking);
  }

  @Delete(':id')
  @SwaggerDelete('booking')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @UserAuth('sub') userId: number,
  ): Promise<{ deleted: boolean }> {
    return this.bookingsService.remove(id, userId);
  }
}
