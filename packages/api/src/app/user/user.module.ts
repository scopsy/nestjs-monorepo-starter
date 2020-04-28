import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { USE_CASES } from './usecases';
import { UserController } from './user.controller';
import { UserResolver } from './user.resolver';

@Module({
  imports: [
    SharedModule
  ],
  controllers: [
    UserController
  ],
  providers: [
    ...USE_CASES,
    UserResolver
  ],
  exports: [
    ...USE_CASES,
    UserResolver
  ]
})
export class UserModule {

}
