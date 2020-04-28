import { Module, OnModuleInit } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [
    SharedModule,
    TerminusModule
  ],
  controllers: [HealthController],
  providers: []
})
export class HealthModule implements OnModuleInit {
  constructor(
  ) {

  }

  async onModuleInit() {

  }
}
