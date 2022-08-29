// NOTE: ADDING GLOBAL CSS
import 'bootstrap/dist/css/bootstrap.css'

import { buildClient } from '../api/buildClient'

import { Header } from '../components/header'

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  )
}

// Server Side Rendering Process
// Note: We're not allowed to fetch data from a component
// Info: https://nextjs.org/docs/advanced-features/custom-app
AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx)
  const { data } = await client.get('/api/users/currentuser')

  console.log(data)

  let pageProps = {}

  if (appContext.Component.getInitialProps) {
    // call page component getInitialProps
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    )
  }

  // return data back to Component (AppComponent)
  return {
    pageProps,
    ...data
  }
}

export default AppComponent
