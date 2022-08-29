import nats, { Stan } from 'node-nats-streaming'

// Create a wrapper singleton like mongoose to prevent circular dependency
class NatsWrapper {
  private _client?: Stan

  get client() {
    if (!this._client) {
      throw new Error('Cannot access NATS client before connecting')
    }

    return this._client
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url })

    // return as a promise so we can use await on index
    return new Promise<void>((resolve, reject) => {
      // use client getter rather than private prop so typescript won't cause soundness error
      this.client.on('connect', () => {
        console.log('Connected to NATS')
        resolve()
      })

      this.client.on('error', (err) => {
        reject(err)
      })
    })
  }
}

export const natsWrapper = new NatsWrapper()
