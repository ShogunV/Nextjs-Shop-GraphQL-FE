import '../styles/app.scss'
import type { AppProps } from 'next/app'
import { CartProvider } from '../context/cart'
import Layout from '../components/layout'
import { ApolloProvider } from '@apollo/client'
import client from '../graphql'
import { useEffect } from 'react'
import api from '../helpers/api'

function MyApp({ Component, pageProps }: AppProps) {

  useEffect(() => {
    api.get('csrf-cookie')
  }, [])

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
