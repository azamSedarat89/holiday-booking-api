import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { UsersModule } from 'src/users/users.module';
import { DestinationsModule } from 'src/destinations/destinations.module';
import { PaymentModule } from 'src/payments/payment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    UsersModule,
    DestinationsModule,
    PaymentModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
