import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  Max,
  IsOptional,
} from 'class-validator';

export class CreateDestinationDto {
  @ApiProperty({ example: 'Shiraz' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'City of Hafiz' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 'Iran' })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({ example: 1200 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 4.5, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;
}
