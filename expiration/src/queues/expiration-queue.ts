import { Queue, QueueEvents, QueueScheduler } from 'bullmq';

import { ExpirationPayload } from './expiration.interface';
import { config } from './config';
import { worker } from './worker';

const expirationQueue = new Queue<ExpirationPayload>(config.queueName, {
  connection: config.connection
})

const queueEvents = new QueueEvents(config.queueName, {
  connection: config.connection
})

// You need at least one QueueScheduler running somewhere for a given queue 
// if you require functionality such as delayed jobs, retries with backoff 
// and rate limiting.
new QueueScheduler(config.queueName, { 
  connection: config.connection
})

worker.on("error", err => {
  console.error(err)
})

// Listen jobs for completion
queueEvents.on("completed", () => {
  console.log("Order Expired!")
})

queueEvents.on("failed", ({ failedReason }) => {
  console.error("Expiration Error", failedReason)
})

// worker.on("completed", (job: Job) => {
//   console.log(
//     "I want to publish an expiration:complete event for orderId",
//     job.returnvalue
//   )
// })

export { expirationQueue }