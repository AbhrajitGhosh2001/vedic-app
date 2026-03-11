import { VedicChart } from './birth-chart'

export interface YearlyPredictionOutput {
  year: number
  userBirthDate: string
  cosmicWeather: string
  personalEnergyFocus: string
  emotionalTone: string
  keyThemes: string[]
  opportunities: string[]
  challenges: string[]
  guidance: string
  yearlyScore: number
  majorTransits: Array<{
    planet: string
    period: string
    sign: string
    impact: string
  }>
  dashaPhase: {
    currentMahaDasha: string
    nextTransition: string
    yearlyInfluence: string
  }
  quarterlyFocus: Array<{
    quarter: string
    theme: string
    focus: string
  }>
}

export function generateYearlyPrediction(
  natalChart: VedicChart,
  userBirthDate: string,
  year: number
): YearlyPredictionOutput {
  // Calculate major planetary transits for the year
  const majorTransits = calculateYearlyTransits(year, natalChart)
  
  // Calculate dasha phase
  const dashaPhase = calculateYearlyDashaPhase(userBirthDate, year)
  
  // Calculate quarterly focus
  const quarterlyFocus = generateQuarterlyFocus(majorTransits, year)

  const cosmicWeather = `The year ${year} is marked by ${majorTransits[0]?.planet}'s extended transit through ${majorTransits[0]?.sign}. This year emphasizes ${extractYearlyTheme(majorTransits)}, with significant turning points in mid and late year.`

  const keyThemes = [
    `${majorTransits[0]?.planet} transit influences`,
    `${dashaPhase.currentMahaDasha} maha dasha phase`,
    'Long-term karmic unfolding',
    'Personal and professional transformation'
  ]
  
  const opportunities = [
    `${majorTransits[0]?.planet}'s year-long transit supports ${majorTransits[0]?.impact}`,
    `${dashaPhase.currentMahaDasha} dasha brings opportunities aligned with your life purpose`,
    'Spring brings fresh beginnings and new initiatives',
    'Autumn provides harvest and consolidation period'
  ]
  
  const challenges = [
    'Year may require significant adjustments and adaptations',
    `Watch for ${majorTransits[majorTransits.length - 1]?.planet} retrograde periods`,
    'Mid-year may bring unexpected changes—stay flexible',
    'Year-end requires reflection and course correction'
  ]

  const personalEnergyFocus = `This year, you're in the ${dashaPhase.currentMahaDasha} maha dasha cycle. ${dashaPhase.yearlyInfluence}. Major planetary movements support ${majorTransits.slice(0, 2).map(t => t.planet).join(' and ')} themes.`

  const emotionalTone = `The ${year} emotional journey involves cycles of ${quarterlyFocus.map(q => q.theme).join(', ')}. You'll experience multiple phases of growth, challenge, and integration.`

  const guidance = `For ${year}, focus on ${keyThemes[0]}. Major decision-making windows: Q2 and Q4. Prepare for ${dashaPhase.nextTransition} transition by year-end. Maintain flexibility while pursuing your core intentions.`

  return {
    year,
    userBirthDate,
    cosmicWeather,
    personalEnergyFocus,
    emotionalTone,
    keyThemes,
    opportunities,
    challenges,
    guidance,
    yearlyScore: calculateYearlyScore(majorTransits, dashaPhase),
    majorTransits,
    dashaPhase,
    quarterlyFocus
  }
}

function calculateYearlyTransits(year: number, natalChart: VedicChart) {
  const transits = []
  const planets = ['Sun', 'Mars', 'Mercury', 'Venus', 'Jupiter', 'Saturn']
  
  planets.forEach((planet, idx) => {
    const zodiacIndex = (year * (0.3 + idx * 0.1)) % 12
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
    
    const impactMap: { [key: string]: string } = {
      'Sun': 'vitality and personal power',
      'Mars': 'courage and assertion',
      'Mercury': 'communication and intellect',
      'Venus': 'relationships and values',
      'Jupiter': 'growth and expansion',
      'Saturn': 'structure and mastery'
    }
    
    transits.push({
      planet,
      period: `${planet === 'Saturn' || planet === 'Jupiter' ? 'Year-long' : 'Several month'} transit`,
      sign: signs[Math.floor(zodiacIndex)],
      impact: impactMap[planet] || 'planetary influence'
    })
  })
  
  return transits
}

function calculateYearlyDashaPhase(birthDate: string, year: number) {
  const dashes = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury']
  const daysSinceBirth = Math.floor((new Date(year, 6, 1).getTime() - new Date(birthDate).getTime()) / 86400000)
  
  const mahaDashIndex = Math.floor((daysSinceBirth / 365.25) % 9)
  const nextIndex = (mahaDashIndex + 1) % 9
  
  return {
    currentMahaDasha: dashes[mahaDashIndex],
    nextTransition: dashes[nextIndex],
    yearlyInfluence: `The ${dashes[mahaDashIndex]} period emphasizes ${extractDashaTheme(dashes[mahaDashIndex])}`
  }
}

function extractDashaTheme(dasha: string): string {
  const themes: { [key: string]: string } = {
    'Ketu': 'spiritual release and detachment',
    'Venus': 'relationships, creativity, and pleasure',
    'Sun': 'self-expression and achievement',
    'Moon': 'emotional processing and nurturing',
    'Mars': 'courage, action, and transformation',
    'Rahu': 'ambition, desire, and worldly gains',
    'Jupiter': 'wisdom, expansion, and blessings',
    'Saturn': 'discipline, karma, and mastery',
    'Mercury': 'learning, communication, and adaptability'
  }
  return themes[dasha] || 'cosmic influence'
}

function extractYearlyTheme(transits: any[]): string {
  const majorTheme = transits[0]?.impact || 'planetary evolution'
  const secondaryTheme = transits[1]?.impact || 'personal growth'
  return `${majorTheme} and ${secondaryTheme}`
}

function generateQuarterlyFocus(transits: any[], year: number) {
  const quarters = [
    { quarter: 'Q1', theme: 'Foundation and Planning', focus: 'Lay groundwork for the year ahead' },
    { quarter: 'Q2', theme: 'Growth and Action', focus: 'Execute initiatives with momentum' },
    { quarter: 'Q3', theme: 'Integration and Reflection', focus: 'Assess progress and adjust course' },
    { quarter: 'Q4', theme: 'Completion and Vision', focus: 'Wrap up cycles and plan for next year' }
  ]
  return quarters
}

function calculateYearlyScore(transits: any[], dasha: any): number {
  const baseScore = 7.0
  const transitQuality = transits.filter(t => ['Jupiter', 'Venus'].includes(t.planet)).length * 0.5
  const dashaBonus = dasha.currentMahaDasha === 'Jupiter' ? 1.5 : dasha.currentMahaDasha === 'Saturn' ? -1 : 0
  
  return Math.min(10, Math.max(1, baseScore + transitQuality + dashaBonus))
}
