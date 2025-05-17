import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString, Min, Max } from 'class-validator';

export class DestinationFilterDto {
  @ApiPropertyOptional({ type: Number, description: 'Minimum price filter' })
  @IsOptional()
  @IsNumber()
  minPrice?: number;

  @ApiPropertyOptional({ type: Number, description: 'Maximum price filter' })
  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  @ApiPropertyOptional({ type: String, description: 'Location filter' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ type: Number, description: 'Minimum rating filter' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  minRating?: number;
}
