import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ example: 1, description: 'ID of the destination' })
  @IsInt()
  destinationId: number;

  @ApiProperty({ example: '2025-06-01', description: 'Start date of booking' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2025-06-05', description: 'End date of booking' })
  @IsDateString()
  endDate: string;
}
