import '../styles/app.scss'
import type { AppProps } from 'next/app'
import { CartProvider } from '../context/cart'
import Layout from '../components/layout'
import { ApolloProvider } from '@apollo/client'
import client from '../graphql'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <CartProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </CartProvider>
    </ApolloProvider>
  )
}
export default MyApp
