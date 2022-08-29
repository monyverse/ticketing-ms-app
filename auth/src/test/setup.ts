import request from 'supertest'
// mongodb-memory-server allows us to run multiple different test suites
// at the same time across different project without them altering and
// trying to reach out to the same copy of MongoDB
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

import { app } from '../app'

jest.setTimeout(120000)

// add global signin method to use for test files
declare global {
  var signin: (id?: string) => Promise<string[]>;
}

let mongo: any

// runs before all tests
beforeAll(async () => {
  process.env.JWT_KEY = 'asdafwef' // temporary
  
  mongo = await MongoMemoryServer.create({ binary: { version: '4.2.8' } })
  const mongoUri = await mongo.getUri()
  
  await mongoose.connect(mongoUri)
})

// reset data before each of test
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections()
  
  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

// after all test, disconnect from server
afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close() 
})

// Global SignIn Helper for test files
global.signin = async () => {
  const email = 'test@test.com'
  const password = 'password'

  const response = await request(app)
    .post('/api/users/signup')
    .send({ email, password })
    .expect(201)
  
  // get cookie 'cause supertest doesn't automatically fetch it
  const cookie = response.get('Set-Cookie')

  return cookie
}