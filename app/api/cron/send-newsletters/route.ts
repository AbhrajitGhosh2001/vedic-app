import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendDailyNewsletter } from '@/app/actions/newsletter'
import { calculatePlanetaryPositions, getEvolutionaryLensAnalysis, getVedicLensAnalysis } from '@/lib/planetary-positions'
import * as numerology from '@/lib/numerology'

// This API route should be called by Vercel Cron or external cron service
// Run every hour to check which timezones need newsletter sent at 6 AM
export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()
  
  // Get current hour in UTC
  const now = new Date()
  const currentUTCHour = now.getUTCHours()
  
  console.log('[v0] Running newsletter cron at UTC hour:', currentUTCHour)

  // Get all active subscribers
  const { data: subscribers, error } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .eq('status', 'active')

  if (error) {
    console.error('[v0] Error fetching subscribers:', error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  if (!subscribers || subscribers.length === 0) {
    return NextResponse.json({ message: 'No active subscribers' })
  }

  // Filter subscribers who should receive newsletter this hour
  const subscribersToSend = subscribers.filter(sub => {
    // Calculate what hour it is in subscriber's timezone
    const localHour = getLocalHour(currentUTCHour, sub.timezone)
    const targetHour = sub.preferred_send_hour || 6
    
    return localHour === targetHour
  })

  console.log(`[v0] Sending newsletter to ${subscribersToSend.length} subscribers`)

  const results = await Promise.allSettled(
    subscribersToSend.map(async (subscriber) => {
      try {
        // Generate personalized content based on subscriber's profile and planetary positions
        const content = await generateAdvancedNewsletterContent(subscriber.email, supabase)
        await sendDailyNewsletter(subscriber.email, content)
        
        // Update last_sent timestamp
        await supabase
          .from('newsletter_subscribers')
          .update({ last_sent_at: new Date().toISOString() })
          .eq('id', subscriber.id)
        
        return { email: subscriber.email, status: 'sent' }
      } catch (error) {
        console.error(`[v0] Failed to send to ${subscriber.email}:`, error)
        return { email: subscriber.email, status: 'failed', error }
      }
    })
  )

  const sent = results.filter(r => r.status === 'fulfilled').length
  const failed = results.filter(r => r.status === 'rejected').length

  return NextResponse.json({
    message: `Processed ${subscribersToSend.length} subscribers`,
    sent,
    failed,
  })
}

function getLocalHour(utcHour: number, timezone: string): number {
  // Simple timezone offset calculation
  // In production, use a library like date-fns-tz for accurate DST handling
  const timezoneOffsets: Record<string, number> = {
    'America/New_York': -5,
    'America/Chicago': -6,
    'America/Denver': -7,
    'America/Los_Angeles': -8,
    'America/Phoenix': -7,
    'Europe/London': 0,
    'Europe/Paris': 1,
    'Asia/Tokyo': 9,
    'Asia/Shanghai': 8,
    'Asia/Kolkata': 5.5,
    'Australia/Sydney': 11,
  }

  const offset = timezoneOffsets[timezone] || -5 // Default to ET
  const localHour = (utcHour + offset + 24) % 24
  return Math.floor(localHour)
}

async function generateAdvancedNewsletterContent(email: string, supabase: any) {
  // Fetch user profile with birth data if available
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
    .single()

  const today = new Date()
  const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' })
  
  // Calculate planetary positions for today
  const planetaryPositions = calculatePlanetaryPositions(today)
  
  let evolutionaryInsight = ''
  let vedicPredictions = ''
  let numerologyInsight = ''
  
  if (profile?.birth_date) {
    try {
      // Calculate Life Path for numerology support
      const lifePath = numerology.calculateLifePath(profile.birth_date)
      
      // Get evolutionary lens analysis
      const evolutionaryAnalysis = getEvolutionaryLensAnalysis(
        planetaryPositions,
        lifePath,
        profile.birth_date
      )
      
      evolutionaryInsight = `🌱 **Evolutionary Lens**: ${evolutionaryAnalysis.soulsGrowthPattern} ${evolutionaryAnalysis.actionSteps[0]}`
      
      // Get Vedic lens predictions
      const vedicAnalysis = getVedicLensAnalysis(planetaryPositions, profile.birth_date)
      
      vedicPredictions = `🕉️ **Vedic Prediction**: ${vedicAnalysis.predictions.career || 'Focus on your unique gifts today.'} ${vedicAnalysis.predictions.relationships || ''}`
      
      // Calculate numerology for the day
      const personalYear = numerology.calculatePersonalYear(profile.birth_date)
      const luckyNumbers = numerology.getLuckyNumbers(lifePath)
      
      numerologyInsight = `🔢 **Numerology**: Your Personal Year ${personalYear} brings opportunities. Life Path ${lifePath} guides you toward ${numerology.numberMeanings[lifePath]?.traits || 'growth'}.`
    } catch (err) {
      console.error('[v0] Error calculating personalized insights:', err)
    }
  }
  
  return {
    vedicForecast: `Good ${dayOfWeek} morning! 🌅 ${planetaryPositions.map(p => `${p.planet} in ${p.sign}`).slice(0, 3).join(', ')} create powerful energies today. ${evolutionaryInsight || 'Focus on authentic self-expression.'}`,
    
    numerologyInsight: numerologyInsight || `Today's universal day number is ${(today.getDate() % 9) + 1}. This energy supports new beginnings and leadership. Trust your intuition when making decisions.`,
    
    chineseZodiac: `The Dragon's energy dominates today, bringing ambition and charisma. ${vedicPredictions || 'Excellent day for networking and making bold moves in your career.'} Lucky direction: Southeast.`,
    
    loveCompatibility: `Venus forms a harmonious aspect with Mars, creating magnetic attraction energy. Single? Great day for meeting someone special. Coupled? Plan a romantic evening to deepen your connection.`,
    
    moonPhase: `The waxing crescent moon is perfect for setting intentions and starting new projects. Plant seeds (literal or metaphorical) for what you want to grow in your life. Trust the process.`,
    
    luckyNumbers: [7, 14, 23, 31, 42, 56],
  }
}
