import { AuthProviderEnum } from '@nest-starter/shared';
import { BaseRepository } from '../base-repository';
import { UserEntity } from './user.entity';
import { User } from './user.schema';

export class UserRepository extends BaseRepository<UserEntity> {
  constructor() {
    super(User, UserEntity);
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this.findOne({
      email,
    });
  }

  async findByLoginProvider(profileId: string, provider: AuthProviderEnum): Promise<UserEntity> {
    return this.findOne({
      'tokens.providerId': profileId,
      'tokens.provider': provider,
    });
  }

  async userExists(userId: string) {
    return !!(await this.findOne(
      {
        _id: userId,
      },
      '_id'
    ));
  }
}
