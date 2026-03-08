'use server'

import { createClient } from '@/lib/supabase/server'

interface NewsletterSubscription {
  email: string
  stripe_customer_id: string
  stripe_subscription_id: string
  timezone: string
  preferred_send_hour?: number
}

export async function createNewsletterSubscription(data: NewsletterSubscription) {
  const supabase = await createClient()

  const { data: subscription, error } = await supabase
    .from('newsletter_subscribers')
    .insert({
      email: data.email,
      stripe_customer_id: data.stripe_customer_id,
      stripe_subscription_id: data.stripe_subscription_id,
      timezone: data.timezone,
      preferred_send_hour: data.preferred_send_hour || 6,
      status: 'active',
      subscribed_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('[v0] Error creating newsletter subscription:', error)
    throw error
  }

  // Send welcome email via Resend
  try {
    await sendWelcomeEmail(data.email, data.timezone)
  } catch (emailError) {
    console.error('[v0] Error sending welcome email:', emailError)
    // Don't throw - subscription was created successfully
  }

  return subscription
}

export async function sendWelcomeEmail(email: string, timezone: string) {
  const resendApiKey = process.env.RESEND_API_KEY

  if (!resendApiKey) {
    console.error('[v0] RESEND_API_KEY not set')
    return { error: 'Email service not configured' }
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Geek Boost Media <noreply@geekboostmedia.com>',
      to: [email],
      subject: '🌟 Welcome to Your Daily Cosmic Insights!',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #7c3aed 0%, #d97706 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px 20px; }
              .feature { margin: 20px 0; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #d97706; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
              .cta { display: inline-block; background: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✨ Welcome to Geek Boost Media ✨</h1>
                <p style="font-size: 18px; margin-top: 10px;">Your Daily Cosmic Journey Begins</p>
              </div>
              
              <div class="content">
                <p>Hello, Cosmic Seeker!</p>
                
                <p>Thank you for joining Geek Boost Media Daily Cosmic Insights Newsletter. Starting tomorrow, you'll receive personalized guidance at 6:00 AM ${timezone} time.</p>
                
                <div class="feature">
                  <h3 style="color: #7c3aed; margin-top: 0;">🌙 What You'll Receive Daily:</h3>
                  <ul>
                    <li><strong>Vedic Astrology Forecast</strong> - Planetary movements and their impact on your day</li>
                    <li><strong>Numerology Insights</strong> - Lucky numbers and hidden patterns</li>
                    <li><strong>Chinese Zodiac Wisdom</strong> - Eastern guidance for success</li>
                    <li><strong>Love & Compatibility</strong> - Relationship cosmic timing</li>
                    <li><strong>Moon Phase Guidance</strong> - Align with lunar energy</li>
                  </ul>
                </div>
                
                <div class="feature">
                  <h3 style="color: #d97706; margin-top: 0;">🎁 Your 7-Day Free Trial</h3>
                  <p>Experience a full week of cosmic insights completely free. If you love it (we think you will!), your subscription continues at just $2.88/month. Cancel anytime.</p>
                </div>
                
                <p style="text-align: center;">
                  <a href="https://theaineed.com/profile/insights" class="cta">Explore Your Birth Chart</a>
                </p>
                
                <p>May the stars guide your path,<br>
                <strong>THE AI NEED Team</strong></p>
              </div>
              
              <div class="footer">
                <p>You're receiving this because you subscribed to THE AI NEED Daily Cosmic Insights.</p>
                <p>Questions? Reply to this email or visit our <a href="https://theaineed.com/wisdom">Wisdom Page</a></p>
              </div>
            </div>
          </body>
        </html>
      `,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    console.error('[v0] Resend API error:', data)
    throw new Error(`Failed to send email: ${data.message || 'Unknown error'}`)
  }

  console.log('[v0] Welcome email sent successfully:', data.id)
  return data
}

export async function sendDailyNewsletter(email: string, content: {
  vedicForecast: string
  numerologyInsight: string
  chineseZodiac: string
  loveCompatibility: string
  moonPhase: string
  luckyNumbers: number[]
}) {
  const resendApiKey = process.env.RESEND_API_KEY

  if (!resendApiKey) {
    console.error('[v0] RESEND_API_KEY not set')
    return { error: 'Email service not configured' }
  }

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'THE AI NEED <newsletter@theaineed.com>',
      to: [email],
      subject: `✨ Your Cosmic Forecast for ${today}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #7c3aed 0%, #d97706 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px 20px; }
              .section { margin: 25px 0; padding: 20px; background: white; border-radius: 8px; border-left: 4px solid #d97706; }
              .section h2 { color: #7c3aed; margin-top: 0; font-size: 18px; }
              .lucky-numbers { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px; }
              .number { background: #7c3aed; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✨ ${today} ✨</h1>
                <p>Your Daily Cosmic Insights</p>
              </div>
              
              <div class="content">
                <div class="section">
                  <h2>🌙 Vedic Astrology Forecast</h2>
                  <p>${content.vedicForecast}</p>
                </div>
                
                <div class="section">
                  <h2>🔢 Numerology Insight</h2>
                  <p>${content.numerologyInsight}</p>
                </div>
                
                <div class="section">
                  <h2>🐉 Chinese Zodiac Wisdom</h2>
                  <p>${content.chineseZodiac}</p>
                </div>
                
                <div class="section">
                  <h2>❤️ Love & Compatibility</h2>
                  <p>${content.loveCompatibility}</p>
                </div>
                
                <div class="section">
                  <h2>🌕 Moon Phase Guidance</h2>
                  <p>${content.moonPhase}</p>
                </div>
                
                <div class="section">
                  <h2>🍀 Your Lucky Numbers Today</h2>
                  <div class="lucky-numbers">
                    ${content.luckyNumbers.map(n => `<div class="number">${n}</div>`).join('')}
                  </div>
                </div>
                
                <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                  <strong>Want deeper insights?</strong> Explore your complete birth chart and compatibility matches on <a href="https://theaineed.com" style="color: #7c3aed;">THE AI NEED</a>
                </p>
              </div>
              
              <div class="footer">
                <p>THE AI NEED - Where the stars align, love & peace follow</p>
                <p><a href="https://theaineed.com/newsletter/unsubscribe">Unsubscribe</a> | <a href="https://theaineed.com">Visit Website</a></p>
              </div>
            </div>
          </body>
        </html>
      `,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    console.error('[v0] Resend API error:', data)
    throw new Error(`Failed to send newsletter: ${data.message || 'Unknown error'}`)
  }

  console.log('[v0] Newsletter sent successfully:', data.id)
  return data
}

// Wrapper function for Stripe webhook
export async function subscribeToNewsletter(
  email: string,
  stripeCustomerId: string,
  stripeSubscriptionId: string,
  timezone: string = 'America/New_York'
) {
  return createNewsletterSubscription({
    email,
    stripe_customer_id: stripeCustomerId,
    stripe_subscription_id: stripeSubscriptionId,
    timezone,
    preferred_send_hour: 6,
  })
}

// Unsubscribe function for Stripe webhook
export async function unsubscribeFromNewsletter(email: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('newsletter_subscribers')
    .update({ 
      status: 'cancelled',
      unsubscribed_at: new Date().toISOString()
    })
    .eq('email', email)

  if (error) {
    console.error('[v0] Error unsubscribing:', error)
    throw error
  }

  console.log('[v0] Unsubscribed:', email)
  return { success: true }
}
