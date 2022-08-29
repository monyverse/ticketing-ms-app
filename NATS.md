# NATS and NATS Streaming Server

- NATS is a very simple basic implementation of event sharing
- NATS Streaming Server is built on top of NATS
  - More advanced and full of feature implementation

## DURABLE SUBSCRIPTION

```typescript
  // OPTIONS
  `setManualAckMode` 
  // manually acknowledge the incoming events, default waiting time for
  // nats server 30 seconds after that if no answer, nats will automatically
  // decide to handle that event
  `setDeliverAllAvailable`
  // send all available events from the past once service starts
  `setDurableName`
  // keep track of all the different events that have gone
  // to the queue group even if it goes offline for a little bit
  
  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName('accounting-service') // Durable subscription

  // subscribe to subject and
  // queue group (where subject should belong to if listener/service have
  // multiple instances, so event won't get send to all services and will be
  //  queued) and to make sure that we don't accidentally dumped the durable
  // name (durable subscription) even if all the services restated for a very
  //  brief period of time and all these emitted events only go off to one
  //  instance of our service even if are running multiple instances

  const subscription = stan.subscribe(
    'ticket:created',
    'orders-service-queue-group', // persist durable name subscription
    options
  )

  subscription.on('message', (msg: Message) => {
    const data = msg.getData()
    if (typeof data === 'string') {
      console.log(
        `Received event #${msg.getSequence()}, with data: ${data}`
      )
    }

  // acknowledge the event so nats server won't send it back again
  // and will proceed to next event or if there's error don't acknowledge it
  // yet else event will be dismissed and you won't have time to process
  // it again
  
  msg.ack()

```
