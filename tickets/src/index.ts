import mongoose from 'mongoose'

import { natsWrapper } from './nats-wrapper'
import { app } from './app'

import { 
  OrderCreatedListener,
  OrderCancelledListener
} from './events/listeners/'

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined')
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined')
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined')
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined')
  }

  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined')
  }
  
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    )

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!')
      process.exit()
    })

    // -- GRACEFUL CLIENT SHUTDOWN LISTENERS --
    // SIGINT = SIGNAL INTERRUPT
    process.on('SIGINT', () => natsWrapper.client.close())
    // SIGTERM = SIGNAL TERMINATE
    process.on('SIGTERM', () => natsWrapper.client.close())

    // LISTENERS
    new OrderCreatedListener(natsWrapper.client).listen()
    new OrderCancelledListener(natsWrapper.client).listen()

    // access mongodb using its k8s service
    await mongoose.connect(process.env.MONGO_URI)

    process.env.NODE_ENV !== 'production' && mongoose.set('debug', true)  
    
    console.log('Connected to MongoDB')
  } catch (err) {
    console.log(err)
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000')
  })
}

start()
