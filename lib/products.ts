export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  images?: string[]
  trialDays?: number
  billingInterval?: 'day' | 'month' | 'year'
}

// This is the source of truth for all products.
// All UI to display products should pull from this array.
// IDs passed to the checkout session should be the same as IDs from this array.
export const PRODUCTS: Product[] = [
  {
    id: 'cosmic-insights-free',
    name: 'Cosmic Insights Newsletter',
    description: 'Daily Vedic astrology and numerology insights with ads',
    priceInCents: 0, // Free
    billingInterval: 'month',
  },
  {
    id: 'cosmic-insights-ad-free',
    name: 'Cosmic Insights Newsletter - Ad Free',
    description: 'Daily Vedic astrology and numerology insights, no ads',
    priceInCents: 288, // $2.88/month
    trialDays: 0,
    billingInterval: 'month',
  },
]
