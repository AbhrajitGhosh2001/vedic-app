'use server'

import { headers } from 'next/headers'

import { stripe } from '../../lib/stripe'
import { PRODUCTS } from '../../lib/products'

export async function startCheckoutSession(productId: string, metadata?: Record<string, string>) {
  const product = PRODUCTS.find((p) => p.id === productId)
  if (!product) {
    throw new Error(`Product with id "${productId}" not found`)
  }

  // Create Checkout Sessions from body params.
  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    redirect_on_completion: 'never',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.priceInCents,
          recurring: {
            interval: product.billingInterval || 'month',
            interval_count: 1,
          },
        },
        quantity: 1,
      },
    ],
    mode: 'subscription',
    subscription_data: {
      trial_period_days: product.trialDays || 0,
      metadata: metadata || {},
    },
  })

  return session.client_secret
}
