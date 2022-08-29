import express from 'express'
// express-async-errors to handle asynchronous errors
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import { 
  errorHandler,
  NotFoundError,
  currentUser 
} from '@retr0tickets/common'

import { newTicketRouter }  from './routes/new' 
import { showTicketRouter }  from './routes/show' 
import { indexTicketRouter } from './routes/index'
import { updateTicketRouter } from './routes/update'

const app = express()

// for cookie session secure property
// the reason for this is the traffic is being proxy to app
// through ingress-nginx
app.set('trust proxy', true)

app.use(json())
app.use(
  cookieSession({
    signed: false,
    // secure HTTPS, Note: in postman disable SSL cert verification
    // if dev or prod set to true otherwise if test set to false
    // Jest automatically defines env variable NODE_ENV as test
    secure: process.env.NODE_ENV !== 'test',
  })
)

// set current user to routes that need authentication 
app.use(currentUser)

app.use(newTicketRouter)
app.use(showTicketRouter)
app.use(updateTicketRouter)
app.use(indexTicketRouter)

app.all('*', async (req, res) => {
  throw new NotFoundError()
})

// Error Handler
app.use(errorHandler)

export { app }