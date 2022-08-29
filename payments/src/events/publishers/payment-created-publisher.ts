import { Subjects, Publisher, PaymentCreatedEvent } from '@retr0tickets/common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated
}