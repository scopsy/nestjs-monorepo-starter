import { Module, OnModuleInit } from '@nestjs/common';
import { DNSHealthIndicator, MongooseHealthIndicator, TerminusModule, TerminusModuleOptions } from '@nestjs/terminus';
import { version } from '../../../package.json';
import { SharedModule } from '../shared/shared.module';

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
    SharedModule,
    TerminusModule.forRootAsync({
      inject: [MongooseHealthIndicator, DNSHealthIndicator],
      useFactory: (db: MongooseHealthIndicator, dns: DNSHealthIndicator) => getTerminusOptions(db, dns),
    })
  ],
  controllers: [],
  providers: []
})
export class HealthModule implements OnModuleInit {
  constructor(
  ) {

  }

  async onModuleInit() {

  }
}
