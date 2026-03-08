'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendTestNewsletterSignup(email: string, timezone: string) {
  console.log('[v0] Sending test newsletter signup. User email:', email, 'Verified Resend email: tataighosh5@gmail.com')
  
  // In test mode, Resend can only send to the verified email address
  const verifiedEmail = 'tataighosh5@gmail.com'
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'Geek Boost Media <noreply@geekboostmedia.com>',
      to: [verifiedEmail], // Always send to verified email in test mode
      subject: '🌟 Test Newsletter Signup - Welcome!',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; background: #fbbf24; color: #1a1a2e; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
              .test-note { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0; color: #856404; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✨ Welcome to Geek Boost Media Newsletter!</h1>
                <p>Your Free Test Subscription is Active</p>
              </div>
              <div class="content">
                <p>Hi there,</p>
                <p>Thank you for signing up for our test newsletter! You'll receive daily cosmic insights at 6:00 AM in your timezone (${timezone}).</p>
                
                <p><strong>Email you requested:</strong> ${email}</p>
                
                <h3>What You'll Receive:</h3>
                <ul>
                  <li>🔮 Daily Vedic astrology forecasts</li>
                  <li>🔢 Numerology insights and patterns</li>
                  <li>🐉 Chinese zodiac wisdom</li>
                  <li>💫 Cosmic event notifications</li>
                  <li>❤️ Love and compatibility guidance</li>
                </ul>
                
                <div class="test-note">
                  <strong>⚠️ Test Mode Note:</strong> This is a test email sent to our verified address. In production, you would receive these emails at ${email}.
                </div>
                
                <p>Your first newsletter will arrive tomorrow morning. Get ready to align with the cosmos!</p>
                
                <div style="text-align: center;">
                  <a href="https://geekboostmedia.com" class="button">Explore Geek Boost Media</a>
                </div>
              </div>
              <div class="footer">
                <p>Geek Boost Media - Numerology & Zodiac Insights | Who Were You Meant to Be? | Who Is Your Perfect Match? | Decode the Universe Now!</p>
                <p>This is a test subscription. No payment required.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('[v0] Resend error:', error)
      throw error
    }

    console.log('[v0] Test newsletter sent successfully:', data?.id)
    return { 
      success: true, 
      emailId: data?.id,
      message: `Test email sent to verified address. In production, ${email} would receive the newsletter.`,
      verifiedEmail 
    }
  } catch (error) {
    console.error('[v0] Failed to send test newsletter:', error)
    throw error
  }
}
