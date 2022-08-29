import nats from 'node-nats-streaming'
import { randomBytes } from 'crypto'

import { TicketCreatedListener } from './events/ticket-created-listener'

console.clear()

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  // we use localhost here cause this is only a test program not part of the cluster
  // we port-forward nats pod for mean time so it can be accessible outside cluster
  url: 'http://localhost:4222'
})

stan.on('connect', () => {
  console.log('Listener connected to NATS')

  // -- GRACEFUL CLIENT SHUTDOWN LISTENER--
  stan.on('close', () => {
    console.log('NATS connection closed!')
    process.exit()
  })

  new TicketCreatedListener(stan)
    .listen()
})

// -- GRACEFUL CLIENT SHUTDOWN LISTENERS --
process.on('SIGINT', () => stan.close()) // SIGINT = SIGNAL INTERRUPT
process.on('SIGTERM', () => stan.close()) // SIGTERM = SIGNAL TERMINATE

