import { TicketCreatedEvent } from '@retr0tickets/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'

import { natsWrapper } from '../../../__mocks__/nats-wrapper'
import { TicketCreatedListener } from '../ticket-created-listener'
import { Ticket } from '../../../models/ticket'

const setup = async () => {
  // create an instance of the listener
  // @ts-ignore
  const listener = new TicketCreatedListener(natsWrapper.client)

  // create a fake data event
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString()
  }

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg }
}

it('creates and saves a ticket', async () => {
  // call setup
  const { listener, data, msg } = await setup()

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg)

  // write assertions to make sure a ticket was created!
  const ticket = await Ticket.findById(data.id)

  expect(ticket).toBeDefined()
  expect(ticket!.title).toEqual(data.title)
  expect(ticket!.price).toEqual(data.price)
})

it('acknowledges(ack) the message', async () => {
  // call setup
  const { listener, data, msg } = await setup()

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg)

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled()
})