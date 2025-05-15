import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { databaseValidationSchema } from './config/database.validation';
import jwtConfig from './config/jwt.config';
import { jwtValidationSchema } from './config/jwt.validation';
import { DestinationsModule } from './destinations/destinations.module';
import { UsersModule } from './users/users.module';
import { BookingsModule } from './bookings/bookings.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig],
      validationSchema: databaseValidationSchema.concat(jwtValidationSchema),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('dbHost'),
        port: configService.get('dbPort'),
        username: configService.get('dbUsername'),
        password: configService.get('dbPassword'),
        database: configService.get('dbName'),
        autoLoadEntities: true,
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    DestinationsModule,
    BookingsModule,
  ],
})
export class AppModule {}
