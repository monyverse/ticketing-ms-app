import { scrypt, randomBytes } from 'crypto'
import { promisify } from 'util'

// Turn scrypt callback behavior into promise, so we can use async/await on it
const scryptAsync = promisify(scrypt)

export class PasswordManager {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex')
    // scrypt returns a Buffer but TS doesn't know, so we gonna type cast it
    const buf = (await scryptAsync(password, salt, 64)) as Buffer

    return `${buf.toString('hex')}.${salt}`
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.')
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer

    return buf.toString('hex') === hashedPassword
  }
}