import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Destination } from '../../destinations/entities/destination.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.bookings)
  user: User;

  @ManyToOne(() => Destination, (destination) => destination.bookings)
  destination: Destination;

  @Column({ type: 'date' })
  bookingDate: string;

  @CreateDateColumn()
  createdAt: Date;
}
