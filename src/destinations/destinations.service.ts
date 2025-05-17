import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Destination } from './entities/destination.entity';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { DestinationFilterDto } from './dto/destination-filter.dto';

@Injectable()
export class DestinationsService {
  constructor(
    @InjectRepository(Destination)
    private destRepo: Repository<Destination>,
  ) {}

  create(dto: CreateDestinationDto) {
    const dest = this.destRepo.create(dto);
    return this.destRepo.save(dest);
  }

  findAll(filters: DestinationFilterDto) {
    const { minPrice, maxPrice, location, minRating } = filters;

    const qb = this.destRepo.createQueryBuilder('d');

    if (minPrice != null)
      qb.andWhere('d.price >= :minPrice', { minPrice: minPrice });
    if (maxPrice != null)
      qb.andWhere('d.price <= :maxPrice', { maxPrice: maxPrice });
    if (location) {
      qb.andWhere('d.location ILIKE :location', { location });
    }
    if (minRating != null)
      qb.andWhere('d.rating >= :minRating', { minRating: minRating });

    return qb.getMany();
  }

  async findOne(id: number) {
    const dest = await this.destRepo.findOneBy({ id });
    if (!dest) throw new NotFoundException(`Destination ${id} not found`);
    return dest;
  }

  async update(id: number, dto: UpdateDestinationDto) {
    const dest = await this.findOne(id);
    Object.assign(dest, dto);
    return this.destRepo.save(dest);
  }

  async remove(id: number) {
    const dest = await this.findOne(id);
    await this.destRepo.remove(dest);
    return { deleted: true };
  }
}
