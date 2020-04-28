import { Injectable } from '@nestjs/common';
import { AuthService } from '../../services/auth.service';
import { UserRegisterCommand } from './user-register.command';
import { UserRepository } from '@nest-starter/core';
import { normalizeEmail } from '../../../shared/helpers/email-normalization.service';
import { ApiException } from '../../../shared/exceptions/api.exception';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRegister {
  constructor(
    private authService: AuthService,
    private userRepository: UserRepository
  ) {

  }

  async execute(command: UserRegisterCommand) {
    const email = normalizeEmail(command.email);
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) throw new ApiException('User already exists');

    const passwordHash = await bcrypt.hash(command.password, 10);
    const user = await this.userRepository.create({
      email,
      firstName: command.firstName.toLowerCase(),
      lastName: command.lastName.toLowerCase(),
      password: passwordHash
    });

    return await this.authService.getSignedToken(user);
  }
}
