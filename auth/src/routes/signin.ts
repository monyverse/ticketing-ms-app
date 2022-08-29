import jwt from 'jsonwebtoken'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { BadRequestError, validateRequest } from '@retr0tickets/common'

import { User } from '../models/user'

import { PasswordManager } from '../utils/password-manager'

const router = express.Router()

router.post(
  '/api/users/signin',
  [
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body
       
    const existingUser = await User.findOne({ email })

    if (!existingUser) {
      throw new BadRequestError('Invalid credentials')
    }
    
    const passwordsMatch = await PasswordManager.compare(
      existingUser.password,
      password
    )

    if (!passwordsMatch) {
      throw new BadRequestError('Invalid Credentials')
    }

    // Generate JWT
    const userJwt = jwt.sign({
      id: existingUser.id,
      email: existingUser.email
    }, process.env.JWT_KEY!) // (!) non-null assertion operator

    // After signing in, store it on session object
    // they are now considered logged in
    req.session = {
      jwt: userJwt
    }

    // sendRefreshToken()

    res.status(200).send(existingUser)
  }
)

export { router as signinRouter }
