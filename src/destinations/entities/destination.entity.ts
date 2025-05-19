import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity()
export class Destination {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  location: string;

  @Column('decimal')
  price: number;

  @Column('decimal', { precision: 2, scale: 1, default: 0 })
  rating: number;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Booking, (booking) => booking.destination)
  bookings: Booking[];
}
