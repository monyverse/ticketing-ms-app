import { Publisher, Subjects, TicketUpdatedEvent } from '@retr0tickets/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}