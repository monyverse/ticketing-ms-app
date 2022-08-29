import { Publisher, Subjects, TicketCreatedEvent } from '@retr0tickets/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated
}