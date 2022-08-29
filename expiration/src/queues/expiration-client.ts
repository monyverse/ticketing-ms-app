import { Queue, QueueOptions, JobsOptions} from 'bullmq';
import { config } from './config';
import { ExpirationPayload } from './expiration.interface';

export class ExpirationClient {
  private queue: Queue
  
  constructor(opts: QueueOptions) {
    this.queue = new Queue<ExpirationPayload>(config.queueName, {
      defaultJobOptions: {
        attempts: 5,
        backoff: { type: "exponential", delay: 3000 }
      },
      ...opts,
    })
  }

  async enqueue(jobName: string, data: ExpirationPayload, retry?: JobsOptions) {
    await this.queue.add(jobName, data, retry)

    console.log(`orderId: ${data.orderId}`)
  }

  close() {
    return this.queue.close()
  }
}