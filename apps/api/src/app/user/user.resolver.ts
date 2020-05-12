import { Query, Resolver } from '@nestjs/graphql';
import { IJwtPayload } from '@nest-starter/shared';
import { UseGuards } from '@nestjs/common';
import { User } from './user.graph';
import { GqlAuthGuard } from '../auth/framework/gql-auth.guard';
import { GetMyProfileUsecase } from './usecases/get-my-profile/get-my-profile.usecase';
import { GetMyProfileCommand } from './usecases/get-my-profile/get-my-profile.dto';
import { UserSession } from '../shared/framework/user.decorator';

@Resolver((of) => User)
@UseGuards(GqlAuthGuard)
export class UserResolver {
  constructor(private getMyProfileUsecase: GetMyProfileUsecase) {}

  @Query((returns) => User)
  async me(@UserSession() user: IJwtPayload) {
    const command = GetMyProfileCommand.create({
      userId: user._id,
    });

    return await this.getMyProfileUsecase.execute(command);
  }
}
