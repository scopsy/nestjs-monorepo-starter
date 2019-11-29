import { IsDefined, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class UserRegistrationBodyDto {
  @IsDefined()
  @IsEmail()
  email: string;

  @IsDefined()
  @MinLength(8)
  password: string;

  @IsDefined()
  firstName: string;

  @IsDefined()
  lastName: string;
}
