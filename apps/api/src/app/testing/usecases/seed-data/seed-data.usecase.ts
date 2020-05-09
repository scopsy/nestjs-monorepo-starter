import { Injectable } from '@nestjs/common';
import { UserSession } from '@nest-starter/core';
import { SeedDataCommand } from './seed-data.command';

@Injectable()
export class SeedData {
  async execute(command: SeedDataCommand) {
    const userSession = new UserSession();
    userSession.testServer = null;
    await userSession.initialize();

    return {
      token: userSession.token,
      user: userSession.user,
    };
  }
}
