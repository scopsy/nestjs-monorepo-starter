import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { OrganizationController } from './organization.controller';
import { USE_CASES } from './usecases';
import { OrganizationResolver } from './organization.resolver';
import { MemberResolver } from './member.resolver';

@Module({
  imports: [SharedModule, UserModule],
  controllers: [OrganizationController],
  providers: [...USE_CASES, OrganizationResolver, MemberResolver],
  exports: [...USE_CASES, OrganizationResolver, MemberResolver],
})
export class OrganizationModule implements NestModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer.apply(AuthGuard).exclude({
      method: RequestMethod.GET,
      path: '/organizations/invite/:inviteToken',
    });
  }
}
