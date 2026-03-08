'use client'

import { useCallback, useEffect } from 'react'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import { startCheckoutSession } from '../app/actions/stripe'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function Checkout({ 
  productId, 
  metadata 
}: { 
  productId: string
  metadata?: Record<string, string>
}) {
  useEffect(() => {
    console.log('[v0] Checkout mounted with productId:', productId)
    console.log('[v0] Checkout metadata:', metadata)
  }, [productId, metadata])

  const startCheckoutSessionForProduct = useCallback(
    async () => {
      console.log('[v0] Starting checkout session...')
      try {
        const clientSecret = await startCheckoutSession(productId, metadata)
        console.log('[v0] Got client secret:', clientSecret ? 'SUCCESS' : 'FAILED')
        return clientSecret
      } catch (error) {
        console.error('[v0] Checkout session error:', error)
        throw error
      }
    },
    [productId, metadata],
  )

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ clientSecret: startCheckoutSessionForProduct }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}

export default Checkout
