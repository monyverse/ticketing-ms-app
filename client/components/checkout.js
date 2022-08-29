import { useState } from 'react'
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useElements,
  useStripe
} from '@stripe/react-stripe-js'

// https://github.com/stripe/react-stripe-js/blob/master/examples/hooks/2-Split-Card.js

const ELEMENT_OPTIONS = {
  style: {
    base: {
      iconColor: '#c4f0ff',
      fontSize: '18px',
      fontWeight: 500,
      fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
      color: '#424770',
      letterSpacing: '0.025em',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      iconColor: '#ffc7ee',
      color: '#9e2146',
    },
  },
};

const SubmitButton = ({ processing, error, children, disabled }) => {
  return (
    <button
      className={`btn ${error ? 'btn-danger' : 'btn-primary'}`}
      type="submit"
      disabled={processing || disabled}
    >
      {processing ? 'Processing...' : children}
    </button>
  )
}

const ErrorMessage = ({ children }) => (
  <div className="alert alert-danger m-3" role="alert">
    <svg width="16" height="16" viewBox="0 0 17 17">
      <path
        fill="#FFF"
        d="M8.5,17 C3.80557963,17 0,13.1944204 0,8.5 C0,3.80557963 3.80557963,0 8.5,0 C13.1944204,0 17,3.80557963 17,8.5 C17,13.1944204 13.1944204,17 8.5,17 Z"
      />
      <path
        fill="#6772e5"
        d="M8.5,7.29791847 L6.12604076,4.92395924 C5.79409512,4.59201359 5.25590488,4.59201359 4.92395924,4.92395924 C4.59201359,5.25590488 4.59201359,5.79409512 4.92395924,6.12604076 L7.29791847,8.5 L4.92395924,10.8739592 C4.59201359,11.2059049 4.59201359,11.7440951 4.92395924,12.0760408 C5.25590488,12.4079864 5.79409512,12.4079864 6.12604076,12.0760408 L8.5,9.70208153 L10.8739592,12.0760408 C11.2059049,12.4079864 11.7440951,12.4079864 12.0760408,12.0760408 C12.4079864,11.7440951 12.4079864,11.2059049 12.0760408,10.8739592 L9.70208153,8.5 L12.0760408,6.12604076 C12.4079864,5.79409512 12.4079864,5.25590488 12.0760408,4.92395924 C11.7440951,4.59201359 11.2059049,4.59201359 10.8739592,4.92395924 L8.5,7.29791847 L8.5,7.29791847 Z"
      />
    </svg>
    &nbsp;
    {children}
  </div>
);

const CheckOutForm = ({ handleSubmit, amount }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [processing, setProcessing] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault()

    // Make sure to disable form submission until Stripe.js has loaded
    if (!stripe || !elements) return
    
    const card = elements.getElement(CardNumberElement)
    
    if (card === null) {
      return
    }

    if (error) {
      card.focus()
      return
    }

    if (cardComplete) {
      setProcessing(true)
    }

    const result = await stripe.createToken(card)
    
    setProcessing(false)

    if (result.error) {
      setError(result.error) 
    } else {
     handleSubmit(result.token.id)  
    }
  }

  const onChange = e => {
    setError(e.error)
    setCardComplete(e.complete)
    console.log(e)
  }
  
  return (
    <form onSubmit={onSubmit}>
      <div className="row row-cols-12">
        <div className="col-6">
          <label htmlFor="cardNumber">Card Number</label>
          <CardNumberElement
            id="cardNumber"
            className="form-control"
            onChange={onChange}
            options={ELEMENT_OPTIONS}
            
          />
        </div>
        <div className="col">
          <label htmlFor="expiry">Card Expiration</label>
          <CardExpiryElement
            id="expiry"
            className="form-control"
            onChange={onChange}
            options={ELEMENT_OPTIONS}
          />
        </div>
        <div className="col">
          <label htmlFor="cvc">CVC</label>
          <CardCvcElement
            id="cvc"
            className="form-control"
            onChange={onChange}
            options={ELEMENT_OPTIONS}
          />
        </div> 
      </div>
      <div className="mt-3">
        {error && <ErrorMessage>{error.message}</ErrorMessage>}
        <SubmitButton processing={processing} error={error} disabled={!stripe}>
          Pay ${amount}
        </SubmitButton> 
      </div>
    </form>
  )
}

export { CheckOutForm }
