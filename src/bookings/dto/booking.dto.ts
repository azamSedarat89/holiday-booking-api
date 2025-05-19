import { ApiProperty } from '@nestjs/swagger';
import { Booking } from '../entities/booking.entity';
import { BookingStatus } from '../enum/bookking-status.enum';
import { UserDto } from 'src/users/dto/user.dto';
import { DestinationDto } from 'src/destinations/dto/destination.dto';

export class BookingDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  user: UserDto;

  @ApiProperty()
  destination: DestinationDto;

  @ApiProperty()
  start_date: string;

  @ApiProperty()
  end_date: string;

  @ApiProperty()
  total_price: number;

  @ApiProperty()
  status: BookingStatus;

  @ApiProperty()
  createdAt: Date;

  constructor(data: Booking) {
    this.id = data.id;
    this.user = new UserDto(data.user);
    this.destination = new DestinationDto(data.destination);
    this.start_date = data.start_date;
    this.end_date = data.end_date;
    this.total_price = data.total_price;
    this.status = data.status;
    this.createdAt = data.created_at;
  }
}
