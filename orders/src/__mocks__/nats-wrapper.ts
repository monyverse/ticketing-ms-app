// Faking nats wrapper implementation
export const natsWrapper = {
  client: { 
    publish: jest.fn().mockImplementation(
      // Mock Function
      (subject: string, data: string, callback: () => void) => {
        callback()
      }
    )
  }
}