import { Controller, Get } from '@nestjs/common';
import { DNSHealthIndicator, HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { version } from '../../../package.json';

@Controller('health-check')
export class HealthController {
  constructor(private health: HealthCheckService, private dns: DNSHealthIndicator) {}

  @Get()
  @HealthCheck()
  healthCheck() {
    return this.health.check([
      async () => this.dns.pingCheck('google', 'https://google.com'),
      async () => {
        return {
          apiVersion: {
            version,
            status: 'up',
          },
        };
      },
    ]);
  }
}
