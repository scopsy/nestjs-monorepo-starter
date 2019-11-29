import {
  TerminusEndpoint,
  TerminusOptionsFactory,
  DNSHealthIndicator,
  TerminusModuleOptions, MongooseHealthIndicator, HealthIndicator, HealthIndicatorResult
} from '@nestjs/terminus';
import { Injectable } from '@nestjs/common';
import { DalService } from '@nest-starter/core';
import { version } from '../../../package.json';
import { HealthCheckError } from '@godaddy/terminus';

export class DogHealthIndicator extends HealthIndicator {
  constructor() {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const isHealthy = true;

    const result = this.getStatus(key, isHealthy, {
      version
    });

    if (isHealthy) {
      return result;
    }

    throw new HealthCheckError('Failed fetching version', result);
  }
}

@Injectable()
export class TerminusOptionsService implements TerminusOptionsFactory {
  versionChecker = new DogHealthIndicator();
  constructor(
    private readonly dns: DNSHealthIndicator,
    private readonly db: MongooseHealthIndicator,
    private readonly dalService: DalService
  ) {}

  createTerminusOptions(): TerminusModuleOptions {
    const healthEndpoint: TerminusEndpoint = {
      url: '/health-check',
      healthIndicators: [
        () => this.dns.pingCheck('google', 'https://google.com'),
        () => this.db.pingCheck('mongo', {
          connection: this.dalService.connection
        })
      ]
    };

    return {
      endpoints: [healthEndpoint],
    };
  }
}
