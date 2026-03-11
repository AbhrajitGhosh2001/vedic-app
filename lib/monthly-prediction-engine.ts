import { VedicChart } from './birth-chart'

export interface MonthlPredictionOutput {
  month: string
  year: number
  userBirthDate: string
  cosmicWeather: string
  personalEnergyFocus: string
  emotionalTone: string
  keyThemes: string[]
  opportunities: string[]
  challenges: string[]
  guidance: string
  monthlyScore: number
  planetaryTransits: Array<{
    planet: string
    startDate: string
    endDate: string
    sign: string
    impact: string
  }>
  dashaInfluence: {
    mahaDasha: string
    antarDasha: string
    influence: string
  }
}

export function generateMonthlyPrediction(
  natalChart: VedicChart,
  userBirthDate: string,
  month: number,
  year: number
): MonthlPredictionOutput {
  const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' })
  
  // Calculate which planets transition this month
  const planetaryTransits = calculateMonthlyTransits(month, year, natalChart)
  
  // Calculate dasha influence
  const dashaInfluence = calculateMonthlyDashaInfluence(userBirthDate, month, year)

  const cosmicWeather = `The month of ${monthName} ${year} carries the influence of ${planetaryTransits[0]?.planet}'s transit through ${planetaryTransits[0]?.sign}. This month emphasizes ${extractThemeFromPlanets(planetaryTransits)}.`

  const keyThemes = extractKeyThemes(planetaryTransits, dashaInfluence)
  
  const opportunities = generateMonthlyOpportunities(planetaryTransits, dashaInfluence, natalChart)
  
  const challenges = generateMonthlyChallenges(planetaryTransits, dashaInfluence, natalChart)

  const personalEnergyFocus = `This month, your personal energy aligns with ${dashaInfluence.mahaDasha} dasha cycles. Focus on areas governed by ${planetaryTransits.map(p => p.planet).join(', ')}.`

  const emotionalTone = `The ${monthName} emotional landscape is colored by ${planetaryTransits[0]?.impact || 'balanced planetary influence'}. Expect phases of ${extractEmotionalPhases(month)}.`

  const guidance = `For ${monthName}, prioritize ${keyThemes[0]} while preparing for ${keyThemes[1] || 'upcoming transitions'}. Key dates to watch: early, mid, and late month transitions.`

  return {
    month: monthName,
    year,
    userBirthDate,
    cosmicWeather,
    personalEnergyFocus,
    emotionalTone,
    keyThemes,
    opportunities,
    challenges,
    guidance,
    monthlyScore: calculateMonthlyScore(planetaryTransits, dashaInfluence),
    planetaryTransits,
    dashaInfluence
  }
}

function calculateMonthlyTransits(month: number, year: number, natalChart: VedicChart) {
  const transits = []
  const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']
  
  planets.forEach((planet, idx) => {
    const dayOfYear = (month - 1) * 30 + 15
    const zodiacIndex = (dayOfYear * (0.5 + idx * 0.1)) % 12
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
    
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0]
    const endDate = new Date(year, month, 0).toISOString().split('T')[0]
    
    transits.push({
      planet,
      startDate,
      endDate,
      sign: signs[Math.floor(zodiacIndex)],
      impact: `${planet} transits create energy shifts in your ${signs[Math.floor(zodiacIndex)]} sector`
    })
  })
  
  return transits
}

function calculateMonthlyDashaInfluence(birthDate: string, month: number, year: number) {
  const dashes = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury']
  const daysSinceBirth = Math.floor((new Date(year, month - 1, 15).getTime() - new Date(birthDate).getTime()) / 86400000)
  
  const mahaDashIndex = Math.floor((daysSinceBirth / 365.25) % 9)
  const antarDashIndex = Math.floor((daysSinceBirth / 30.4375) % 9)
  
  return {
    mahaDasha: dashes[mahaDashIndex],
    antarDasha: dashes[antarDashIndex],
    influence: `Under ${dashes[mahaDashIndex]} maha dasha with ${dashes[antarDashIndex]} antardasha influence`
  }
}

function extractThemeFromPlanets(transits: any[]): string {
  const themes: { [key: string]: string } = {
    'Sun': 'self-expression and vitality',
    'Moon': 'emotional awareness and intuition',
    'Mars': 'courage and action',
    'Mercury': 'communication and learning',
    'Jupiter': 'growth and expansion',
    'Venus': 'relationships and creativity',
    'Saturn': 'discipline and responsibility'
  }
  
  return themes[transits[0]?.planet] || 'balanced cosmic influence'
}

function extractKeyThemes(transits: any[], dasha: any): string[] {
  return [
    `${transits[0]?.planet} transit themes`,
    `${dasha.mahaDasha} dasha influences`,
    'Karmic development',
    'Spiritual growth'
  ]
}

function generateMonthlyOpportunities(transits: any[], dasha: any, chart: any): string[] {
  return [
    `${transits[0]?.planet}'s favorable placement supports growth initiatives`,
    `${dasha.mahaDasha} dasha period favors your natural strengths`,
    'Mid-month window presents key decision-making opportunities',
    'Financial and career matters show positive potential'
  ]
}

function generateMonthlyChallenges(transits: any[], dasha: any, chart: any): string[] {
  return [
    'Early month may feel transitional—be patient',
    'Avoid major commitments during planetary shift periods',
    'Communication requires extra clarity mid-month',
    'Balance ambition with rest and reflection'
  ]
}

function extractEmotionalPhases(month: number): string {
  const phases = [
    'introspection and renewal', 'growth and expansion', 'creative expression',
    'emotional release', 'stability seeking', 'social engagement',
    'reflection and consolidation', 'transformation', 'completion and new beginnings',
    'fresh starts', 'building foundations', 'celebration and gratitude'
  ]
  return phases[month - 1] || 'dynamic change'
}

function calculateMonthlyScore(transits: any[], dasha: any): number {
  const baseScore = 65
  const transitBoost = transits.length > 3 ? 5 : 0
  const dashaInfluence = dasha.mahaDasha === 'Jupiter' ? 10 : dasha.mahaDasha === 'Saturn' ? -5 : 0
  
  return Math.min(100, Math.max(1, baseScore + transitBoost + dashaInfluence))
}
