import { TicketCreatedPublisher } from './events/ticket-created-publisher'
import nats from 'node-nats-streaming'

// stan or client

console.clear()

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222'
})

stan.on('connect', async () => {
  console.log('Publisher connected to NATS')
  
  const publisher = new TicketCreatedPublisher(stan)

  try {
    await publisher.publish({
      id: '123',
      title: 'concert',
      price: 20
    })    
  } catch (error) {
    console.error(error)
  }


  // data should only be send/ be accepted as a string
  // const data = JSON.stringify({
  //   id: '123',
  //   title: 'concert',
  //   price: 20
  // })

  // publish with subject ticket:created which listener would subscribe to
  // stan.publish('ticket:created', data, () => {
  //   console.log('Event published')
  // })
})

