import { AuthProviderEnum } from '@nest-starter/shared';
import { Exclude } from 'class-transformer';

export interface IUserToken {
  providerId: string;
  provider: AuthProviderEnum;
  accessToken: string;
  refreshToken: string;
  valid: boolean;
  lastUsed: Date;
}

export class UserEntity {
  _id: string;

  firstName: string;

  lastName: string;

  email: string;

  profilePicture: string;

  @Exclude({ toPlainOnly: true })
  tokens: IUserToken[];

  @Exclude({ toPlainOnly: true })
  password?: string;

  createdAt: string;
}
