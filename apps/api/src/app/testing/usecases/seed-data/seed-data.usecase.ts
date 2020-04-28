import { Injectable } from '@nestjs/common';
import { SeedDataCommand } from './seed-data.command';
import { UserSession } from '@nest-starter/core';

@Injectable()
export class SeedData {
  async execute(command: SeedDataCommand) {
    const userSession = new UserSession();
    userSession.testServer = null;
    await userSession.initialize();

    return {
      token: userSession.token,
      user: userSession.user
    };
  }
}
