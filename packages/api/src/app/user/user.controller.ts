import { ClassSerializerInterceptor, Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserSession } from '../shared/framework/user.decorator';
import { GetMyProfileCommand } from './usecases/get-my-profile/get-my-profile.dto';
import { GetMyProfileUsecase } from './usecases/get-my-profile/get-my-profile.usecase';
import { IJwtPayload } from '@nest-starter/shared';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('/users')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(
    private getMyProfileUsecase: GetMyProfileUsecase
  ) {

  }

  @Get('/me')
  async getMyUserProfile(@UserSession() user: IJwtPayload) {
    const command = GetMyProfileCommand.create({
      userId: user._id
    });

    return await this.getMyProfileUsecase.execute(command);
  }
}
