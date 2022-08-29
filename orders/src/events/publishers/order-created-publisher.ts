import { Publisher, OrderCreatedEvent, Subjects } from '@retr0tickets/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
}