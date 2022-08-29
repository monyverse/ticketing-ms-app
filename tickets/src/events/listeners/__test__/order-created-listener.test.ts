import mongoose from "mongoose"
import { OrderCreatedEvent, OrderStatus } from "@retr0tickets/common"
import { Message } from "node-nats-streaming"

import { OrderCreatedListener } from "../order-created-listener"
import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from "../../../models/ticket"

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client) 

  // Create and save a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userId: new mongoose.Types.ObjectId().toHexString()
  })

  await ticket.save()

  // Simulate or Create the fake data event 
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: 'adkjld',
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, msg, ticket, data }
}

it('sets the userId of the ticket', async () => {
  const { listener, ticket, data, msg } = await setup()

  // pass data & msg and invoke onMessage to simulate
  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket!.orderId).toEqual(data.id)
})

it('acknowledges the message', async () => {
  const { listener, ticket, data, msg } = await setup()
  
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})

it('publishes a ticket updated event', async () => {
  const { listener, ticket, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
  
  // console.log((natsWrapper.client.publish as jest.Mock).mock.calls)

  const ticketUpdatedData = JSON.parse(
    // let TS know that we're using the mock version
    // mock.calls is the an array of all the different times the 
    // mock function was invoked
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  )

  expect(data.id).toEqual(ticketUpdatedData.orderId)
}) 