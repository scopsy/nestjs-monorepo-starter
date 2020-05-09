import * as Bull from 'bull';
import { Queue } from 'bull';
import { IDemoQueuePayload } from './queue.interface';

export const DEMO_QUEUE = 'demo_queue';

export class QueueService {
  private bullConfig: Bull.QueueOptions = {
    settings: {
      lockDuration: 90000,
    },
    redis: {
      db: Number(process.env.REDIS_DB_INDEX),
      port: Number(process.env.REDIS_PORT),
      host: process.env.REDIS_HOST,
      connectTimeout: 50000,
      keepAlive: 30000,
      family: 4,
    },
  };

  public demoQueue: Queue<IDemoQueuePayload> = new Bull(DEMO_QUEUE, this.bullConfig) as Queue;

  async getJobStats(type: 'demo_queue'): Promise<{ waiting: number; active: number }> {
    if (type === 'demo_queue') {
      return {
        waiting: await this.demoQueue.getWaitingCount(),
        active: await this.demoQueue.getActiveCount(),
      };
    }
    throw new Error(`Unexpected type ${type}`);
  }

  async cleanAllQueues() {
    await this.demoQueue.empty();
  }
}
