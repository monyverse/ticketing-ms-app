import { Message, Stan } from "node-nats-streaming";

import { Subjects } from './subjects'

interface Event {
  subject: Subjects
  data: any
}

export abstract class Listener<T extends Event> {
  abstract subject: T['subject']
  abstract queueGroupName: string
  abstract onMessage(data: T['data'], msg: Message): void
  private client: Stan
  protected ackWait = 5 * 1000 // 5s

  constructor(client: Stan) {
    this.client = client
  }

  subscriptionOptions() {
    // `setManualAckMode` 
    // manually acknowledge the incoming events, default waiting time for
    // nats server 30 seconds after that if no answer, nats will automatically
    // decide to handle that event
    // `setDeliverAllAvailable`
    // send all available events from the past once service starts
    // `setDurableName`
    // keep track of all the different events that have gone 
    // to the queue group even if it goes offline for a little bit
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName)
  }

  listen() {
    // subscribe to subject and
    // queue group (where subject should belong to if listener/service have
    // multiple instances, so event won't get send to all services and will be
    // queued) and to make sure that we don't accidentally dumped the durable
    // name (durable subscription) even if all the services restated for a 
    // very brief period of time and all these emitted events only go off to 
    // one instance of our service even if are running multiple instance
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    )

    subscription.on("message", (msg: Message) => {
      console.log(`Message Received: ${this.subject} / ${this.queueGroupName}`)

      const parseData = this.parseMessage(msg);
      this.onMessage(parseData, msg);
    })
  }

  parseMessage(msg: Message) {
    const data = msg.getData();

    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf-8"));
  }
}

