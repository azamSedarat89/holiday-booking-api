import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Destination } from '../../destinations/entities/destination.entity';
import { BookingStatus } from '../enum/bookking-status.enum';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.bookings, { eager: true })
  user: User;

  @ManyToOne(() => Destination, (destination) => destination.bookings, {
    eager: true,
  })
  destination: Destination;

  @Column({ type: 'date' })
  start_date: string;

  @Column({ type: 'date' })
  end_date: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_price: number;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({ nullable: true })
  transaction_id?: string;

  @CreateDateColumn()
  created_at: Date;
}
