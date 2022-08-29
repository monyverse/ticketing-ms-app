import { Message } from "node-nats-streaming";

import { Subjects } from './subjects'
import { Listener } from "./base-listener";
import { TicketCreatedEvent } from './ticket-created-event'

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated 
  queueGroupName = "payments-service"

  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log("Event Data: ", data)

    // acknowledge the event so nats server won't send it back again
    // and will proceed to next event or if there's error don't acknowledge it
    // yet else event will be dismissed and you won't have time to process
    // it again
    msg.ack()
  }
}