const config = {
  queueName: 'order:expiration',
  connection: {
    host: process.env.REDIS_HOST,
    port: 6379
  }
}

export { config }