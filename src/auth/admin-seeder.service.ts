import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AdminSeederService implements OnApplicationBootstrap {
  constructor(private readonly usersService: UsersService) {}

  async onApplicationBootstrap() {
    await this.usersService.createDefaultAdmin();
  }
}
