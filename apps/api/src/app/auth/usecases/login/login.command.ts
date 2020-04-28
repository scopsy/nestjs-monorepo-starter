import { CommandHelper } from '../../../shared/commands/command.helper';
import { IsDefined, IsEmail, IsNotEmpty } from 'class-validator';

export class LoginCommand {
  static create(data: LoginCommand) {
    return CommandHelper.create(LoginCommand, data);
  }

  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsDefined()
  password: string;
}
