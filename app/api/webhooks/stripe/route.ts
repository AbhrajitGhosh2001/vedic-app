import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { subscribeToNewsletter, unsubscribeFromNewsletter } from '@/app/actions/newsletter'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia'
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        if (session.metadata?.email) {
          await subscribeToNewsletter(
            session.metadata.email,
            session.customer as string,
            session.subscription as string
          )
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const supabase = await createClient()

        const status = subscription.status === 'active' ? 'active' : 
                      subscription.status === 'canceled' ? 'cancelled' : 
                      'inactive'

        await supabase
          .from('newsletter_subscribers')
          .update({ 
            status,
            stripe_subscription_id: subscription.id
          })
          .eq('stripe_customer_id', subscription.customer as string)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const supabase = await createClient()

        const { data: subscriber } = await supabase
          .from('newsletter_subscribers')
          .select('email')
          .eq('stripe_customer_id', subscription.customer as string)
          .single()

        if (subscriber?.email) {
          await unsubscribeFromNewsletter(subscriber.email)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const supabase = await createClient()

        await supabase
          .from('newsletter_subscribers')
          .update({ status: 'payment_failed' })
          .eq('stripe_customer_id', invoice.customer as string)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook handler error:', err)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
