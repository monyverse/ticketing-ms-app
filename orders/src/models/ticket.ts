import mongoose from 'mongoose'
import { Order, OrderStatus } from './order'

// Ticket model under order service have different function from ticket service
// Order service may grow to encapsulate things i.e Parking tickets
// that need some set of attributes in this ticket model under order service
// We don't want to share definition of what a ticket is between these services

interface TicketAttrs {
  id: string
  title: string
  price: number
}

export interface TicketDoc extends mongoose.Document {
  title: string
  price: number
  version: number
  isReserved(): Promise<boolean>
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc
  findByEvent(event: { id: string, version: number }): Promise<TicketDoc | null>
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  // optimisticConcurrency: true, // ticket service handle OCC, not order service
  versionKey: 'version',
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
    }
  }
})


ticketSchema.statics.findByEvent = (event: { id: string, version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1
  })
}

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    // id to _id from ticket service must match
    _id: attrs.id, // little bit of technical debt
    title: attrs.title,
    price: attrs.price
  })
}

ticketSchema.methods.isReserved = async function() {
  // this === the ticket document that we just called 'isReserved' on

  // Run query to look at all orders. Find an order where the ticket
  // is the ticket we just found *and* the Order Status is *not* cancelled.
  // If we find an order from that means the ticket *is* reserved
  const existingOrder = await Order.findOne({
      ticket: <TicketDoc>this,
      status: {
        $in: [
          OrderStatus.Created,
          OrderStatus.AwaitingPayment,
          OrderStatus.Complete
        ]
      }
    })

  return !!existingOrder
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export { Ticket }
