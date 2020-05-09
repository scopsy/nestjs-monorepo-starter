import { Module } from '@nestjs/common';
import { USE_CASES } from './usecases';
import { TestingController } from './testing.controller';

@Module({
  providers: [...USE_CASES],
  controllers: [TestingController],
})
export class TestingModule {}
