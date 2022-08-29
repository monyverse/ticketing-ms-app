import mongoose from 'mongoose'

import { PasswordManager } from '../utils/password-manager'

// NOTE: Mongoose doesn't really work well with typescript
// so we'll create interfaces and inject it to provide better type support

// An interface that describes the properties
// that are required to create a new User
interface UserAttrs {
  email: string
  password: string
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
  email: string
  password: string
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  // to allow typescript to do some type checking of the arguments to create new doc
  build(attrs: UserAttrs): UserDoc
}

// Create Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  // Formatting JSON properties before sending it to client
  toJSON: {
    transform(doc, ret) {
      // assign _id to id, for it to work with other micro services DB types
      ret.id = ret._id
      delete ret._id // remove _id after converting it
      delete ret.password // remove password
      delete ret.__v // remove versionKey 
    }
  }
})

// Before saving password hash it
userSchema.pre('save', async function() {
  // this === the model in this context (userSchema). 
  if (this.isModified('password')) {
    const hashed = await PasswordManager.toHash(this.get('password'))
    this.set('password', hashed)
  }
})

// Static method to create new user which also provide property check
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs)
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema)

export { User }