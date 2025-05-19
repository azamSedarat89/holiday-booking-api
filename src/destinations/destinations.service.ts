import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Destination } from './entities/destination.entity';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { DestinationFilterDto } from './dto/destination-filter.dto';

/**
 * Service responsible for CRUD & query operations on Destination entity.
 */
@Injectable()
export class DestinationsService {
  constructor(
    @InjectRepository(Destination)
    private readonly destRepo: Repository<Destination>,
  ) {}

  /** Create a new destination */
  async create(dto: CreateDestinationDto): Promise<Destination> {
    const dest = this.destRepo.create(dto);
    return this.destRepo.save(dest);
  }

  /**
   * Retrieve destinations using optional filters.
   * All numeric filters validate that min <= max when both provided.
   */
  async findAll(filters: DestinationFilterDto = {}): Promise<Destination[]> {
    const { minPrice, maxPrice, location, minRating } = filters;

    if (minPrice != null && maxPrice != null && minPrice > maxPrice) {
      throw new BadRequestException('minPrice cannot exceed maxPrice');
    }

    const qb = this.destRepo.createQueryBuilder('d');

    qb.where(
      new Brackets((qb) => {
        if (minPrice != null) qb.andWhere('d.price >= :minPrice', { minPrice });
        if (maxPrice != null) qb.andWhere('d.price <= :maxPrice', { maxPrice });
        if (location)
          qb.andWhere('d.location ILIKE :loc', { loc: `%${location}%` });
        if (minRating != null)
          qb.andWhere('d.rating >= :minRating', { minRating });
      }),
    );

    return qb.orderBy('d.created_at', 'DESC').getMany();
  }

  /** Fetch single destination or 404 */
  async findOne(id: number): Promise<Destination> {
    const dest = await this.destRepo.findOne({ where: { id } });
    if (!dest) throw new NotFoundException(`Destination ${id} not found`);
    return dest;
  }

  /** Update mutable fields of a destination */
  async update(id: number, dto: UpdateDestinationDto): Promise<Destination> {
    const dest = await this.findOne(id);
    Object.assign(dest, dto);
    return this.destRepo.save(dest);
  }

  /** Hard‑delete destination (consider soft‑delete for prod) */
  async remove(id: number): Promise<{ deleted: boolean }> {
    const dest = await this.findOne(id);
    await this.destRepo.remove(dest);
    return { deleted: true };
  }
}
