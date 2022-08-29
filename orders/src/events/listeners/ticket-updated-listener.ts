import { Message } from 'node-nats-streaming'
import { Subjects, Listener, TicketUpdatedEvent } from '@retr0tickets/common'

import { Ticket } from '../../models/ticket'
import { queueGroupName } from './queue-group-name'

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated
  queueGroupName = queueGroupName

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findByEvent(data)

    console.log('Version: ', data.version)
    
    if (!ticket) {
      throw new Error('Ticket not found')
    }
    
    // When Updating:
    // include version provided by ticket service
    // let ticket service handle its optimistic concurrency
    // versioning and pass it here in order's ticket
    const { title, price, version } = data    
    ticket.set({ title, price, version })
    
    await ticket.save()

    msg.ack()
  }
}
