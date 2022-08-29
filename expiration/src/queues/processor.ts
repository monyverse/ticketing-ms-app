import { Job } from 'bullmq'
import { ExpirationPayload } from './expiration.interface'
import { 
  ExpirationCompletePublisher 
} from '../events/publishers/expiration-complete-publisher'
import { natsWrapper } from '../nats-wrapper'

export default async (job: Job<ExpirationPayload>) => {
  // Publish Event
  if (job.name === 'expiration:job') {
    new ExpirationCompletePublisher(natsWrapper.client)
      .publish({ orderId: job.data.orderId })
      
    console.log("Published Event w/ an orderId: ", job.data.orderId)
  }
  
  // return just to notify worker listeners
  return job.data.orderId
}