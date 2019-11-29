import { Module } from '@nestjs/common';
import {
  DalService,
  QueueService,
  UserRepository,
  StorageService,
  AnalyticsService,
  MailService
} from '@nest-starter/core';
import {
  DNSHealthIndicator,
  MongooseHealthIndicator,
  TerminusModule,
  TerminusModuleOptions
} from '@nestjs/terminus';
import { version } from '../../../package.json';

const DAL_MODELS = [
  UserRepository
];

const dalService = new DalService();
export const ANALYTICS_SERVICE = 'AnalyticsService';

const PROVIDERS = [{
    provide: QueueService,
    useFactory: () => {
        return new QueueService();
    }
  }, {
    provide: DalService,
    useFactory: async () => {
        await dalService.connect(process.env.MONGO_URL);
        return dalService;
    }
  },
  ...DAL_MODELS,
  StorageService, {
    provide: ANALYTICS_SERVICE,
    useFactory: async () => {
      const analyticsService = new AnalyticsService();
      await analyticsService.initialize();

      return analyticsService;
    }
  },
  MailService
];

const getTerminusOptions = (
  db: MongooseHealthIndicator,
  dns: DNSHealthIndicator
): TerminusModuleOptions => ({
  endpoints: [
    {
      url: '/health-check',
      healthIndicators: [
        () => dns.pingCheck('google', 'https://google.com'),
        async () => {
          return {
            version
          } as any;
        }
      ]
    }
  ]
});

@Module({
  imports: [
    TerminusModule.forRootAsync({
      inject: [MongooseHealthIndicator, DNSHealthIndicator],
      useFactory: (db: MongooseHealthIndicator, dns: DNSHealthIndicator) => getTerminusOptions(db, dns),
    })
  ],
  providers: [...PROVIDERS],
  exports: [...PROVIDERS]
})
export class SharedModule {

}
