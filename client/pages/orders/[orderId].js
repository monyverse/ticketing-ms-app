import { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import Router from 'next/router'

import { CheckOutForm } from '../../components/checkout'
import { useRequest } from '../../hooks/use-request'

const OrderShow = ({ order }) => {
  const [stripePromise, ] = useState(() => loadStripe('pk_test_51K12LxHIvFtLgnAwpe26fgb77OUpokv9InA1j1uygcEM6OfPPpCdIXUDSr0dy6vxJS5rwdeyUCdfazETxVxQLWbD00WtOniKaJ'))
  const [timeLeft, setTimeLeft] = useState('')
  const amount = order.ticket.price
  
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: () => Router.push('/orders')
  })

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date()
      setTimeLeft(Math.round(msLeft / 1000))
    }
    
    findTimeLeft() // set 1s offset for setInterval 1s delay
    
    const timerId = setInterval(findTimeLeft, 1000)

    return () => {
      clearInterval(timerId)
    }
  }, [order])

  const handleSubmit = (token) => {
    // amount = order.ticket.price * 100
    // email = currentUser.email
    doRequest({ token })
  }
  
  if (timeLeft < 0) {
    return <div>Order Expired.</div>
  }
  
  return (
    <div>
      <div className="alert alert-danger m-1">
        {errors && errors}
      </div>
      <div className="alert alert-warning mt-1">
        Time left to pay: {timeLeft} seconds until order expires
      </div>
      <Elements stripe={stripePromise}>
        <CheckOutForm handleSubmit={handleSubmit} amount={amount} />
      </Elements>
    </div> 
  )
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query
  const { data } = await client.get(`/api/orders/${orderId}`)

  return { order: data }
}

export default OrderShow
