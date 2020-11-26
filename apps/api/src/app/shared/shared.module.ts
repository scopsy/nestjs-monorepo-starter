import { Module } from '@nestjs/common';
import {
  DalService,
  QueueService,
  UserRepository,
  StorageService,
  AnalyticsService,
  MailService,
  OrganizationRepository,
} from '@nest-starter/core';

const DAL_MODELS = [UserRepository, OrganizationRepository];

const dalService = new DalService();
export const ANALYTICS_SERVICE = 'AnalyticsService';

const PROVIDERS = [
  {
    provide: QueueService,
    useFactory: () => {
      return new QueueService();
    },
  },
  {
    provide: DalService,
    useFactory: async () => {
      await dalService.connect(process.env.MONGO_URL);
      return dalService;
    },
  },
  ...DAL_MODELS,
  StorageService,
  {
    provide: ANALYTICS_SERVICE,
    useFactory: async () => {
      const analyticsService = new AnalyticsService();
      await analyticsService.initialize();

      return analyticsService;
    },
  },
  MailService,
];

@Module({
  imports: [],
  providers: [...PROVIDERS],
  exports: [...PROVIDERS],
})
export class SharedModule {}
