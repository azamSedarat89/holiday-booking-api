import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class UpdateBookingDto {
  @ApiProperty({
    example: '2025-06-02',
    description: 'Start date',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  start_date?: string;

  @ApiProperty({
    example: '2025-06-06',
    description: 'End date',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  end_date?: string;
}
