import { Worker } from 'bullmq';

import Processor from './processor';
import { ExpirationPayload } from './expiration.interface';
import { config } from './config';

// You can have multiple workers if you want to distribute workload
// also by specifying job names added to queue
export const worker = new Worker<ExpirationPayload>(
  config.queueName, 
  Processor, 
  {
    connection: config.connection,
    concurrency: 1
  }
);