import { Publisher, OrderCancelledEvent, Subjects } from '@retr0tickets/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}