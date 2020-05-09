import { Injectable } from '@nestjs/common';
import { UserRepository } from '@nest-starter/core';
import { GetMyProfileCommand } from './get-my-profile.dto';

@Injectable()
export class GetMyProfileUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: GetMyProfileCommand) {
    return await this.userRepository.findById(command.userId);
  }
}
