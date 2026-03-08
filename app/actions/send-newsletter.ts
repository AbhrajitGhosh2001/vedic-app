'use server'

import { sendDailyNewsletter } from './newsletter'
import { calculatePlanetaryPositions, getEvolutionaryLensAnalysis, getVedicLensAnalysis } from '@/lib/planetary-positions'
import * as numerology from '@/lib/numerology'

export async function generateAndSendTodayNewsletter(email: string) {
  try {
    console.log('[v0] Generating newsletter for:', email)

    const today = new Date()

    // Calculate planetary positions for today
    const planetaryPositions = calculatePlanetaryPositions(today)

    const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' })

    // Generate content with placeholder profile data
    const lifePath = 7 // Example life path
    const evolutionaryAnalysis = getEvolutionaryLensAnalysis(planetaryPositions, lifePath, today.toISOString().split('T')[0])
    const vedicAnalysis = getVedicLensAnalysis(planetaryPositions, today.toISOString().split('T')[0])

    const content = {
      vedicForecast: `Good ${dayOfWeek} morning! 🌅 ${planetaryPositions.map((p) => `${p.planet} in ${p.sign}`).slice(0, 3).join(', ')} create powerful energies today. 🌱 ${evolutionaryAnalysis.soulsGrowthPattern} ${evolutionaryAnalysis.actionSteps[0]}`,

      numerologyInsight: `Today's universal day number is ${(today.getDate() % 9) + 1}. This energy supports new beginnings and leadership. Trust your intuition when making decisions. Life Path 7 guides you toward introspection and wisdom.`,

      chineseZodiac: `The Dragon's energy dominates today, bringing ambition and charisma. 🕉️ ${vedicAnalysis.predictions.career || 'Focus on your unique gifts today.'} Lucky direction: Southeast.`,

      loveCompatibility: `Venus forms a harmonious aspect with Mars, creating magnetic attraction energy. Single? Great day for meeting someone special. Coupled? Plan a romantic evening to deepen your connection.`,

      moonPhase: `The waxing crescent moon is perfect for setting intentions and starting new projects. Plant seeds (literal or metaphorical) for what you want to grow in your life. Trust the process.`,

      luckyNumbers: [7, 14, 23, 31, 42, 56],
    }

    console.log('[v0] Generated newsletter content, sending to:', email)
    const result = await sendDailyNewsletter(email, content)
    console.log('[v0] Newsletter sent successfully:', result)

    return { success: true, message: 'Newsletter sent successfully', email }
  } catch (error) {
    console.error('[v0] Error generating/sending newsletter:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send newsletter',
    }
  }
}
