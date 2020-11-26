import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  UserEntity,
  UserRepository,
  AnalyticsService,
  QueueService,
  MemberEntity,
  OrganizationRepository,
} from '@nest-starter/core';
import { AuthProviderEnum, IJwtPayload } from '@nest-starter/shared';

import { CreateUserCommand } from '../../user/usecases/create-user/create-user.dto';
import { CreateUser } from '../../user/usecases/create-user/create-user.usecase';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private createUserUsecase: CreateUser,
    private jwtService: JwtService,
    private queueService: QueueService,
    private analyticsService: AnalyticsService,
    private organizationRepository: OrganizationRepository
  ) {}

  async authenticate(
    authProvider: AuthProviderEnum,
    accessToken: string,
    refreshToken: string,
    profile: { name: string; login: string; email: string; avatar_url: string; id: string },
    distinctId: string
  ) {
    let user = await this.userRepository.findByLoginProvider(profile.id, authProvider);
    let newUser = false;

    if (!user) {
      user = await this.createUserUsecase.execute(
        CreateUserCommand.create({
          picture: profile.avatar_url,
          email: profile.email,
          lastName: profile.name ? profile.name.split(' ').slice(-1).join(' ') : null,
          firstName: profile.name ? profile.name.split(' ').slice(0, -1).join(' ') : profile.login,
          auth: {
            profileId: profile.id,
            provider: authProvider,
            accessToken,
            refreshToken,
          },
        })
      );
      newUser = true;

      this.analyticsService.upsertUser(user, distinctId || user._id);

      if (distinctId) {
        this.analyticsService.alias(distinctId, user._id);
      }
    } else {
      this.analyticsService.track('[Authentication] - Login', user._id, {
        loginType: authProvider,
      });
    }

    return {
      newUser,
      token: await this.getSignedToken(user),
    };
  }

  async refreshToken(userId: string) {
    const user = await this.userRepository.findById(userId);

    return this.getSignedToken(user);
  }

  async isAuthenticatedForOrganization(userId: string, organizationId: string): Promise<boolean> {
    return !!(await this.organizationRepository.isMemberOfOrganization(organizationId, userId));
  }

  async getSignedToken(user: UserEntity, organizationId?: string, member?: MemberEntity): Promise<string> {
    return this.jwtService.sign(
      {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePicture: user.profilePicture,
        organizationId: organizationId || null,
        roles: member && member.roles,
      },
      {
        expiresIn: '30 days',
        issuer: 'starter_api',
      }
    );
  }

  async validateUser(payload: IJwtPayload): Promise<UserEntity> {
    const user = await this.userRepository.findById(payload._id);
    return user;
  }
}
