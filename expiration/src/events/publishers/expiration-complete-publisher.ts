import { 
  Subjects, 
  Publisher, 
  ExpirationCompleteEvent 
} from "@retr0tickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
}