import { Job } from 'agenda';
import * as Agenda from 'agenda';

export class CronService {
  private agenda = new Agenda({
    db: {
      address: this.config.mongoUrl
    }
  });

  constructor(
    private config: { mongoUrl: string }
  ) {

  }

  async initialize() {
    await this.agenda.start();
  }

  define(name: string, callback: (job: Job<any>, done: (err?: Error) => void) => void): void {
    this.agenda.define(name, callback);
  }

  async processEvery(name: string, interval: string) {
    await this.agenda.every(interval, name);
  }

  async processNow(name: string) {
    await this.agenda.now(name);
  }
}
