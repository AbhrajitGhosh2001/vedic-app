# Newsletter System Setup Guide

## Overview
THE AI NEED Daily Cosmic Insights Newsletter is now configured to send personalized astrology emails at 6:00 AM in each subscriber's timezone.

---

## Email Details

### Welcome Email
- **Subject**: `🌟 Welcome to Your Daily Cosmic Insights!`
- **Sent**: Immediately after subscription
- **Content**: Welcome message, trial details, what to expect

### Daily Newsletter
- **Subject**: `✨ Your Cosmic Forecast for [Date]`
- **Sent**: Every day at 6:00 AM subscriber's local time
- **Content**:
  - Vedic Astrology Forecast
  - Numerology Insights
  - Chinese Zodiac Wisdom
  - Love & Compatibility
  - Moon Phase Guidance
  - Lucky Numbers

---

## Current Status

### ✅ Stripe Integration
- **Status**: Connected and working
- **Product**: Cosmic Insights Newsletter - $2.88/month
- **Trial**: 7-day free trial included
- **Billing**: Monthly recurring subscription

### ⚠️ Resend Integration
- **API Endpoint**: Configured (`https://api.resend.com/emails`)
- **From Address**: `THE AI NEED <newsletter@theaineed.com>`
- **Environment Variable**: `RESEND_API_KEY` (needs to be set)

**Action Required:**
1. Go to https://resend.com and create an account
2. Verify your domain `theaineed.com` or use Resend's test domain
3. Get your API key from the dashboard
4. Add `RESEND_API_KEY` to your environment variables in Vercel

### ⚠️ Cron Job Setup
The newsletter cron job needs to be configured to run every hour.

**Option 1: Vercel Cron (Recommended)**
Add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/send-newsletters",
    "schedule": "0 * * * *"
  }]
}
```

**Option 2: External Cron Service**
Use a service like cron-job.org or EasyCron to call:
```
https://theaineed.com/api/cron/send-newsletters
```
Every hour with header:
```
Authorization: Bearer YOUR_CRON_SECRET
```

**Action Required:**
1. Add `CRON_SECRET` environment variable (any secure random string)
2. Set up cron job using one of the options above

---

## Database Migration

Run the timezone migration:
```bash
# Execute: scripts/010_add_newsletter_timezone.sql
```

This adds `timezone` and `preferred_send_hour` columns to `newsletter_subscribers` table.

---

## How It Works

### 1. User Subscribes
- User enters email on `/newsletter` page
- Timezone is auto-detected (can be changed)
- Redirects to Stripe Checkout for $2.88/month subscription
- 7-day free trial starts automatically

### 2. Welcome Email Sent
- After successful payment, welcome email sent via Resend
- Contains trial info and what to expect

### 3. Daily Newsletters
- Cron job runs every hour
- Checks which timezones have reached 6:00 AM
- Sends personalized newsletter to those subscribers
- Updates `last_sent_at` timestamp

### 4. Timezone Logic
Example: If it's 11:00 AM UTC:
- **Eastern Time (UTC-5)**: 6:00 AM → Send ✅
- **Pacific Time (UTC-8)**: 3:00 AM → Wait
- **London (UTC+0)**: 11:00 AM → Already sent
- **Tokyo (UTC+9)**: 8:00 PM → Already sent

---

## Testing

### Test Welcome Email
1. Subscribe to newsletter with your email
2. Check inbox for welcome email
3. Verify subject line and content

### Test Cron Job Manually
```bash
curl -X GET https://theaineed.com/api/cron/send-newsletters \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Test Timezone Detection
1. Go to `/newsletter` page
2. Check that timezone selector shows your detected timezone
3. Try changing it to different timezones

---

## Troubleshooting

### Emails Not Sending
1. Check `RESEND_API_KEY` is set correctly
2. Verify domain in Resend dashboard
3. Check server logs for Resend API errors
4. Test welcome email by subscribing

### Cron Job Not Running
1. Verify `CRON_SECRET` is set
2. Check cron job is configured (vercel.json or external)
3. Test manually with curl command above
4. Check `/api/cron/send-newsletters` logs

### Wrong Timezone
1. Users can manually select timezone on signup page
2. Update subscriber's timezone in database if needed:
```sql
UPDATE newsletter_subscribers 
SET timezone = 'America/Los_Angeles' 
WHERE email = 'user@example.com';
```

---

## Next Steps

1. ✅ Stripe is working - subscribers can sign up
2. ⚠️ Set `RESEND_API_KEY` environment variable
3. ⚠️ Set `CRON_SECRET` environment variable
4. ⚠️ Configure cron job (Vercel or external)
5. ⚠️ Verify domain in Resend for production emails
6. ✅ Test subscription flow end-to-end

---

## Subscription Management

### Cancel Subscription
Users manage subscriptions through Stripe Customer Portal.

### Update Timezone
Users would need to contact support or you can add a preferences page where they can update their timezone:
```sql
UPDATE newsletter_subscribers 
SET timezone = 'New/Timezone' 
WHERE email = 'user@example.com';
```

---

For questions or issues, check the server logs or contact support.
