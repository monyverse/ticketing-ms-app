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

import { newOrderRouter }  from './routes/new' 
import { showOrderRouter }  from './routes/show' 
import { indexOrderRouter } from './routes/index'
import { deleteOrderRouter } from './routes/delete'

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

app.use(newOrderRouter)
app.use(showOrderRouter)
app.use(deleteOrderRouter)
app.use(indexOrderRouter)

app.all('*', async (req, res) => {
  throw new NotFoundError()
})

// Error Handler
app.use(errorHandler)

export { app }