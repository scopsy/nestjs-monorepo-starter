import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OrganizationRepository, UserRepository } from '@nest-starter/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { IJwtPayload } from '@nest-starter/shared';
import { AuthService } from './services/auth.service';
import { UserRegistrationBodyDto } from './dtos/user-registration.dto';
import { UserRegister } from './usecases/register/user-register.usecase';
import { UserRegisterCommand } from './usecases/register/user-register.command';
import { Login } from './usecases/login/login.usecase';
import { LoginBodyDto } from './dtos/login.dto';
import { LoginCommand } from './usecases/login/login.command';
import { UserSession } from '../shared/framework/user.decorator';

@Controller('/auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private authService: AuthService,
    private userRegisterUsecase: UserRegister,
    private loginUsecase: Login,
    private organizationRepository: OrganizationRepository
  ) {}

  @Get('/github')
  githubTestAuth() {
    return {
      success: true,
    };
  }

  @Get('/github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() request, @Res() response) {
    if (!request.user || !request.user.token) {
      return response.redirect(`${process.env.CLIENT_SUCCESS_AUTH_REDIRECT}?error=AuthenticationError`);
    }

    let url = `${process.env.CLIENT_SUCCESS_AUTH_REDIRECT}?token=${request.user.token}`;
    if (request.user.newUser) {
      url += '&newUser=true';
    }

    return response.redirect(url);
  }

  @Get('/refresh')
  @UseGuards(AuthGuard('jwt'))
  refreshToken(@UserSession() user: IJwtPayload) {
    if (!user || !user._id) throw new BadRequestException();

    return this.authService.refreshToken(user._id);
  }

  @Post('/register')
  async userRegistration(@Body() body: UserRegistrationBodyDto) {
    return await this.userRegisterUsecase.execute(
      UserRegisterCommand.create({
        email: body.email,
        password: body.password,
        firstName: body.firstName,
        lastName: body.lastName,
      })
    );
  }

  @Post('/login')
  async userLogin(@Body() body: LoginBodyDto) {
    return await this.loginUsecase.execute(
      LoginCommand.create({
        email: body.email,
        password: body.password,
      })
    );
  }

  @Get('/test/token/:userId')
  async authenticateTest(@Param('userId') userId: string, @Query('organizationId') organizationId: string) {
    if (process.env.NODE_ENV !== 'test') throw new NotFoundException();

    const user = await this.userRepository.findById(userId);
    if (!user) throw new BadRequestException('No user found');

    const member = organizationId
      ? await this.organizationRepository.findMemberByUserId(organizationId, user._id)
      : null;

    return await this.authService.getSignedToken(user, organizationId, member);
  }
}
