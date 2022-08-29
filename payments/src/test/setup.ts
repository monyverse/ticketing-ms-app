// mongodb-memory-server allows us to run multiple different test suites
// at the same time across different project without them altering and
// trying to reach out to the same copy of MongoDB
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose, { ConnectOptions } from 'mongoose'
import jwt from 'jsonwebtoken'

jest.setTimeout(120000)

// add global signin method to use for test files
declare global {
  var signin: (id?: string) => string[];
}

// Here we import nats-wrapper but jest will do redirect to __mocks__ folder
// and import the fake nats-wrapper rather than importing the real nats-wrapper
jest.mock('../nats-wrapper.ts')

// this is going to be used instantly by stripe instance whenever we launch test
process.env.STRIPE_KEY = 'sk_test_51K12LxHIvFtLgnAwyYlXIJCkMcTZpzaim9acdOUxcKPRh8unxX0JZOc04KZhs41NEODqJX11wBsV2WB1AwrtazFO00y4jDhojD'

let mongo: any

// runs before all tests
beforeAll(async () => {
  process.env.JWT_KEY = 'asdafwef' // temporary
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  
  mongo = await MongoMemoryServer.create({ binary: { version: '4.2.8' } })
  const mongoUri = await mongo.getUri()
  
  await mongoose.connect(mongoUri)
})

// reset data before each of test
beforeEach(async () => {
  jest.clearAllMocks() // clear all mock calls
  const collections = await mongoose.connection.db.collections()
  
  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

// after all test, disconnect from server
afterAll(async () => {
  await mongoose.connection.close() 
  await mongo.stop()
})

// Faking Global SignIn Helper for tickets test files for auth simulation
global.signin = (id?: string) => {
  // Build a JWT payload. { id, email }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  }

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!)

  // Build session Object. { jwt: MY_JWT }
  const session = { jwt: token }

  // Turn that session into JSON
  const sessionJSON  = JSON.stringify(session)

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64')

  // return a string that's the cookie with the encoded data
  return [`session=${base64}`]
}