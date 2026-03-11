import type { VedicChart } from './types'

export interface DailySignals {
  emotionalEnergy: number // -5 to +5
  productivity: number // -5 to +5
  relationships: number // -5 to +5
  decisionClarity: number // -5 to +5
  creativity: number // -5 to +5
}

export interface DailyEnergyIndex {
  score: number // 0-10
  category: 'difficult' | 'neutral' | 'supportive'
}

export interface DailyPredictionOutput {
  date: string
  userBirthDate: string
  signals: DailySignals
  energyIndex: DailyEnergyIndex
  cosmicWeather: string
  personalEnergyToday: string
  emotionalTone: string
  opportunities: string[]
  challenges: string[]
  dailyGuidance: string
}

/**
 * STEP 1: Get current planetary positions for a given date
 * In a real system, this would use astronomical calculations or an API
 * For now, we'll use simplified deterministic calculations
 */
function getCurrentPlanetaryPositions(date: Date) {
  // Simplified: Use date to generate deterministic planet positions
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
  
  return {
    moonSign: dayOfYear % 12, // 0-11 (zodiac signs)
    moonNakshatra: dayOfYear % 27, // 0-26 (nakshatras)
    moonHouse: (dayOfYear % 12) + 1, // 1-12
    sunHouse: ((dayOfYear + 6) % 12) + 1,
    mercuryHouse: ((dayOfYear + 3) % 12) + 1,
    venusHouse: ((dayOfYear + 9) % 12) + 1,
    marsHouse: ((dayOfYear + 4) % 12) + 1,
    jupiterHouse: ((dayOfYear + 7) % 12) + 1,
    saturnHouse: ((dayOfYear + 10) % 12) + 1,
  }
}

/**
 * STEP 2: Rule-Based Signal Engine
 * Generate signals based on planetary transits and natal chart
 */
function calculateDailySignals(
  natalChart: VedicChart,
  currentDate: Date
): DailySignals {
  const positions = getCurrentPlanetaryPositions(currentDate)
  
  let emotionalEnergy = 0
  let productivity = 0
  let relationships = 0
  let decisionClarity = 0
  let creativity = 0

  // Rule: Moon house influences emotional energy
  if (positions.moonHouse === 1) emotionalEnergy += 2
  if (positions.moonHouse === 8) emotionalEnergy -= 2
  if (positions.moonHouse === 12) emotionalEnergy -= 1
  if (positions.moonHouse === 4) emotionalEnergy += 1

  // Rule: Mercury in 3rd or 10th house enhances clarity
  if (positions.mercuryHouse === 3 || positions.mercuryHouse === 10) decisionClarity += 3
  if (positions.mercuryHouse === 8 || positions.mercuryHouse === 12) decisionClarity -= 2

  // Rule: Mars placement affects productivity
  if (positions.marsHouse === 6 || positions.marsHouse === 10) productivity += 2
  if (positions.marsHouse === 7) relationships -= 2
  if (positions.marsHouse === 8) emotionalEnergy -= 1

  // Rule: Venus influences relationships and creativity
  if (positions.venusHouse === 5 || positions.venusHouse === 7) {
    relationships += 3
    creativity += 2
  }
  if (positions.venusHouse === 6 || positions.venusHouse === 8) relationships -= 2

  // Rule: Jupiter brings optimism and expansion
  if (positions.jupiterHouse === 1 || positions.jupiterHouse === 10) {
    productivity += 2
    decisionClarity += 1
  }
  if (positions.jupiterHouse === 12) decisionClarity -= 1

  // Rule: Saturn brings structure but also heaviness
  if (positions.saturnHouse === 10) productivity += 1
  if (positions.saturnHouse === 8 || positions.saturnHouse === 12) {
    emotionalEnergy -= 2
    productivity -= 1
  }

  // Rule: Sun house placement
  if (positions.sunHouse === 1 || positions.sunHouse === 10) {
    decisionClarity += 2
    productivity += 1
  }
  if (positions.sunHouse === 8 || positions.sunHouse === 12) decisionClarity -= 1

  // Normalize scores to -5 to +5 range
  const normalize = (score: number) => Math.max(-5, Math.min(5, score))

  return {
    emotionalEnergy: normalize(emotionalEnergy),
    productivity: normalize(productivity),
    relationships: normalize(relationships),
    decisionClarity: normalize(decisionClarity),
    creativity: normalize(creativity),
  }
}

/**
 * STEP 3: Convert signals to Daily Energy Index (0-10)
 */
function calculateEnergyIndex(signals: DailySignals): DailyEnergyIndex {
  // Calculate average of all signals and convert to 0-10 scale
  const average = (
    signals.emotionalEnergy +
    signals.productivity +
    signals.relationships +
    signals.decisionClarity +
    signals.creativity
  ) / 5

  // Convert from -5 to +5 range to 0-10 range
  const score = ((average + 5) / 10) * 10

  let category: 'difficult' | 'neutral' | 'supportive'
  if (score < 4) category = 'difficult'
  else if (score < 7) category = 'neutral'
  else category = 'supportive'

  return {
    score: Math.round(score * 10) / 10,
    category,
  }
}

/**
 * STEP 4: AI Interpretation Layer
 * Generate text predictions based on signal results
 */
function interpretSignals(
  signals: DailySignals,
  energyIndex: DailyEnergyIndex,
  natalChart: VedicChart,
  date: Date
): Omit<DailyPredictionOutput, 'date' | 'userBirthDate' | 'signals' | 'energyIndex'> {
  const zodiacSigns = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ]

  // Interpret Cosmic Weather based on overall energy
  let cosmicWeather = ''
  if (energyIndex.category === 'difficult') {
    cosmicWeather = `Today brings introspective cosmic weather. The planetary alignment suggests a slower, more contemplative pace. This is an excellent day for internal work, meditation, and planning rather than external action. The universe invites you to rest and recharge.`
  } else if (energyIndex.category === 'neutral') {
    cosmicWeather = `The cosmic weather today is balanced and steady. Planets create a neutral environment where neither major expansion nor contraction is favored. This is a good day for routine tasks, maintaining stability, and working with what you already have.`
  } else {
    cosmicWeather = `Today radiates supportive cosmic energy. The planetary positions align to bring momentum, clarity, and forward motion. The universe favors action, new initiatives, and meaningful progress on important matters.`
  }

  // Personal Energy interpretation
  let personalEnergyToday = ''
  if (signals.productivity > 2) {
    personalEnergyToday = `Your personal energy is high and directed. Your ${natalChart.sun_sign} Sun is receiving excellent support, making this ideal for tackling challenging projects and moving goals forward. You have natural momentum on your side.`
  } else if (signals.productivity > 0) {
    personalEnergyToday = `Your energy flows steadily today. You have enough resources to accomplish routine tasks and make gradual progress. Focus on quality over quantity in your efforts.`
  } else {
    personalEnergyToday = `Your energy asks for gentleness today. This is a good day to prioritize what truly matters rather than trying to do everything. Rest, recovery, and self-care are more valuable than pushing hard.`
  }

  // Emotional Tone interpretation
  let emotionalTone = ''
  if (signals.emotionalEnergy > 2) {
    emotionalTone = `Your emotional landscape is clear and stable. Your ${natalChart.moon_sign} Moon is well-supported, bringing emotional clarity and authentic self-expression. You can trust your feelings to guide you wisely.`
  } else if (signals.emotionalEnergy > -2) {
    emotionalTone = `Your emotions are present and natural today. Allow yourself to feel what arises without judgment. This is a good day for honest communication about your inner world.`
  } else {
    emotionalTone = `Your emotional world requires extra care today. Sensitivity is heightened, which brings depth but also vulnerability. Honor your need for space, gentleness, and supportive company.`
  }

  // Opportunities array based on signals
  const opportunities: string[] = []
  if (signals.productivity > 1) opportunities.push('Push forward on important projects with strong momentum and focus')
  if (signals.relationships > 1) opportunities.push('Deepen connections with meaningful conversations and quality time')
  if (signals.creativity > 1) opportunities.push('Express your creativity freely—artistic endeavors will flow naturally')
  if (signals.decisionClarity > 1) opportunities.push(`Trust your intuition for decision-making—your ${natalChart.lagna} Ascendant clarity is enhanced`)
  if (signals.emotionalEnergy > 1) opportunities.push('Engage in activities that bring joy and emotional nourishment')
  
  // Fallback if no positive signals
  if (opportunities.length === 0) {
    opportunities.push('Build momentum through small, consistent actions')
    opportunities.push('Practice presence and mindfulness in everyday moments')
  }

  // Challenges array based on signals
  const challenges: string[] = []
  if (signals.emotionalEnergy < -2) challenges.push('Emotional sensitivity may be heightened—practice self-compassion')
  if (signals.productivity < -1) challenges.push('Avoid making major decisions or starting new projects if possible')
  if (signals.relationships < -1) challenges.push('Relationship dynamics may be strained—allow extra patience and space')
  if (signals.decisionClarity < -1) challenges.push('Clarity may be foggy—delay important decisions until tomorrow if you can')
  if (signals.creativity < 0) challenges.push('Creative blocks may appear—this is temporary, not a reflection of your abilities')
  
  // Fallback if no challenges
  if (challenges.length === 0) {
    challenges.push('Watch for overconfidence—maintain grounded awareness')
    challenges.push('Remember that even supportive days require balanced effort')
  }

  // Daily Guidance based on energy index
  let dailyGuidance = ''
  if (energyIndex.category === 'difficult') {
    dailyGuidance = `Today's guidance is to practice radical self-care. Start with a grounding practice suited to your ${natalChart.moon_sign} nature. Reduce your to-do list to essentials. In conversations, lead with listening more than speaking. Embrace rest as productive. This challenging energy will pass, and you're supported more than you realize.`
  } else if (energyIndex.category === 'neutral') {
    dailyGuidance = `Keep today balanced and intentional. Do your routine tasks well, but don't chase new opportunities aggressively. This is a good day to consolidate what you've built. In relationships, maintain warmth without needing to solve everything. Trust that steadiness has its own power.`
  } else {
    dailyGuidance = `Harness today's supportive energy wisely. Begin with clarity about your highest priority. Channel momentum into meaningful goals rather than scattered activity. Trust your instincts—they're accurate today. Make space to celebrate small wins. This energy won't last forever, so use it purposefully.`
  }

  return {
    cosmicWeather,
    personalEnergyToday,
    emotionalTone,
    opportunities,
    challenges,
    dailyGuidance,
  }
}

/**
 * MAIN: Generate consistent daily prediction
 */
export function generateDailyPrediction(
  natalChart: VedicChart,
  userBirthDate: string,
  currentDate: Date = new Date()
): DailyPredictionOutput {
  // Calculate signals based on natal chart and current transits
  const signals = calculateDailySignals(natalChart, currentDate)
  
  // Convert signals to energy index
  const energyIndex = calculateEnergyIndex(signals)
  
  // Generate interpretations from signals
  const interpretations = interpretSignals(signals, energyIndex, natalChart, currentDate)

  return {
    date: currentDate.toISOString().split('T')[0],
    userBirthDate,
    signals,
    energyIndex,
    ...interpretations,
  }
}
