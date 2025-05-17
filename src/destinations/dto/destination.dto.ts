import { ApiProperty } from '@nestjs/swagger';
import { Destination } from '../entities/destination.entity';

export class DestinationDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  rating: number;

  constructor(data: Destination) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.location = data.location;
    this.price = data.price;
    this.rating = data.rating;
  }
}
