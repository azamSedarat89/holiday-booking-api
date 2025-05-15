import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity()
export class Destination {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column('decimal')
  price: number;

  @Column({ default: 0 })
  rating: number;

  @OneToMany(() => Booking, (booking) => booking.destination)
  bookings: Booking[];
}
