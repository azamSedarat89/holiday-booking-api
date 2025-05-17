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
  startDate: string;

  @ApiProperty()
  endDate: string;

  @ApiProperty()
  totalPrice: number;

  @ApiProperty()
  status: BookingStatus;

  @ApiProperty()
  createdAt: Date;

  constructor(data: Booking) {
    this.id = data.id;
    this.user = new UserDto(data.user);
    this.destination = new DestinationDto(data.destination);
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.totalPrice = data.totalPrice;
    this.status = data.status;
    this.createdAt = data.createdAt;
  }
}
