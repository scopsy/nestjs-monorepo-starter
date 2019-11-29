import { AuthProviderEnum } from '@nest-starter/shared';
import { BaseRepository } from '../base-repository';
import { UserEntity } from './user.entity';
import { User } from './user.schema';
import * as moment from 'moment';

export class UserRepository extends BaseRepository<UserEntity> {
  constructor() {
    super(User, UserEntity);
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this.findOne({
      email
    });
  }

  async findByLoginProvider(profileId: string, provider: AuthProviderEnum): Promise<UserEntity> {
    return this.findOne({
      'tokens.providerId': profileId,
      'tokens.provider': provider
    });
  }

  async userExists(userId: string) {
    return !!await this.findOne({
      _id: userId
    }, '_id');
  }

  async findLeastUsedToken() {
    const users = await this.find({
      'tokens.provider': AuthProviderEnum.GITHUB,
      'tokens.valid': true
    }, 'tokens', {
      sort: {'tokens.lastUsed': 1}
    });
    return users[0];
  }

  async updateUsedToken(_id: string, accessToken: string) {
      const users = await this.update({
        _id: _id,
        'tokens.accessToken': accessToken
      }, {
        $set: {
          'tokens.$.lastUsed': moment().toDate()
        }
      });

      return;
  }

  async updateValidToken(_id: string, accessToken: string, valid: boolean) {
      const users = await this.update({
        _id: _id,
        'tokens.accessToken': accessToken
      }, {
        $set: {
          'tokens.$.valid': valid
        }
      });

      return;
  }
}
