import { useState } from 'react'
import Router from 'next/router'

import { useRequest } from '../../hooks/use-request'

import { Form } from '../../components/form'
import { InputField } from '../../components/input'
import { Button } from '../../components/button'

const SignIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { doRequest, errors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: {
      email,
      password
    },
    onSuccess: () => Router.push('/')
  })

  const onSubmit = async (event) => {
    event.preventDefault()
    await doRequest()
  }

  return (
    <Form onSubmit={onSubmit}>
      <h1>Sign In</h1>
      <InputField value={email} onChange={setEmail}>
        Email Address
      </InputField>
      <InputField type="password" value={password} onChange={setPassword}>
        Password
      </InputField>
      {errors}
      <Button type="submit">Sign In</Button>
    </Form>
  )
}

export default SignIn
