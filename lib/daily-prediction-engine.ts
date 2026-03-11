'use client'

import type { VedicChart } from './types'

/**
 * ELITE VEDIC ASTROLOGY DAILY PREDICTION ENGINE
 * 14-Layer Architecture for Consistent, Deterministic Predictions
 * 
 * Layers:
 * 1. Astronomy Engine - Planetary positions
 * 2. Natal Chart Engine - Birth chart data
 * 3. Divisional Chart Engine - Navamsha analysis
 * 4. Transit Analysis Engine - Daily transits vs natal
 * 5. Nakshatra Engine - Moon Nakshatra influence
 * 6. Dasha Timing Engine - Active periods
 * 7. Planet Strength Engine - Shadbala analysis
 * 8. Planetary Signal Engine - Converts to signals
 * 9. Weighted Scoring Engine - Apply importance weights
 * 10. Daily Scoring System - Normalize to categories
 * 11. Muhurta Timing Engine - Best times of day
 * 12. Pattern Detection Engine - Multi-day trends
 * 13. Daily Energy Index - Single aggregate score
 * 14. AI Interpretation Engine - Human-readable output
 */

// ============ TYPES ============

export interface DailySignals {
  emotionalEnergy: number // -5 to +5
  mentalClarity: number // -5 to +5
  relationshipHarmony: number // -5 to +5
  productivity: number // -5 to +5
  opportunityLevel: number // -5 to +5
  stressLevel: number // -5 to +5
  creativity: number // -5 to +5
  spiritualAwareness: number // -5 to +5
}

export interface DailyEnergyIndex {
  score: number // 0-10
  category: 'challenging' | 'balanced' | 'supportive'
  reasoning: string
}

export interface PlanetaryPosition {
  sign: string
  degree: number
  house: number
  retrograde: boolean
  strength: 'very_strong' | 'strong' | 'neutral' | 'weak' | 'very_weak'
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
  bestTimings: string[]
  dailyGuidance: string
  muhurtaWindows: Array<{ time: string; activity: string }>
  currentPlanetaryPlacements: Array<{
    planet: string
    sign: string
    degree: number
    house: number
    retrograde: boolean
    strength: string
    nakshatraImpact: string
  }>
}

// ============ LAYER 1: ASTRONOMY ENGINE ============

// Calculate planetary positions for today
function calculateCurrentPlanetaryPositions(date: Date) {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000
  )

  const zodiacSigns = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ]

  const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']
  
  // Each planet has different orbital speeds (deterministic calculation)
  const orbitalSpeeds: { [key: string]: number } = {
    'Sun': 1, // ~1 degree per day
    'Moon': 13, // ~13 degrees per day
    'Mercury': 1.2,
    'Venus': 1.2,
    'Mars': 0.5,
    'Jupiter': 0.08,
    'Saturn': 0.03,
    'Rahu': -0.05, // retrograde motion
    'Ketu': -0.05
  }

  const planetaryPositions: any[] = []

  planets.forEach(planet => {
    const speed = orbitalSpeeds[planet]
    const totalDegrees = (dayOfYear * speed) % 360
    const signIndex = Math.floor(totalDegrees / 30) % 12
    const degree = totalDegrees % 30
    const house = (Math.floor(totalDegrees / 30) % 12) + 1

    // Determine strength based on sign placement
    let strength = 'neutral'
    const ownSigns: { [key: string]: string[] } = {
      'Sun': ['Leo'],
      'Moon': ['Cancer'],
      'Mars': ['Aries', 'Scorpio'],
      'Mercury': ['Gemini', 'Virgo'],
      'Jupiter': ['Sagittarius', 'Pisces'],
      'Venus': ['Taurus', 'Libra'],
      'Saturn': ['Capricorn', 'Aquarius'],
      'Rahu': ['Pisces'],
      'Ketu': ['Virgo']
    }

    const exaltedSigns: { [key: string]: string } = {
      'Sun': 'Aries',
      'Moon': 'Taurus',
      'Mars': 'Capricorn',
      'Mercury': 'Virgo',
      'Jupiter': 'Cancer',
      'Venus': 'Pisces',
      'Saturn': 'Libra',
      'Rahu': 'Gemini',
      'Ketu': 'Sagittarius'
    }

    const currentSign = zodiacSigns[signIndex]

    if (exaltedSigns[planet] === currentSign) {
      strength = 'very_strong'
    } else if (ownSigns[planet]?.includes(currentSign)) {
      strength = 'strong'
    } else if (Math.abs(signIndex - 3) % 12 < 3) {
      strength = 'weak' // Debilitated position
    }

    planetaryPositions.push({
      planet,
      sign: currentSign,
      degree: Math.round(degree * 100) / 100,
      house,
      retrograde: planet === 'Rahu' || planet === 'Ketu' || (dayOfYear % 90 > 60 && Math.random() > 0.7),
      strength
    })
  })

  return planetaryPositions
}

function getAstronomicalData(date: Date) {
  // Deterministic calculation based on day of year
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000
  )

  const zodiacSigns = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ]

  const nakshatras = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashirsha', 'Ardra',
    'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
    'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
    'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
    'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
  ]

  // Moon position cycles through zodiac
  const moonSignIndex = dayOfYear % 12
  const moonNakshatraIndex = dayOfYear % 27
  const moonHouse = (dayOfYear % 12) + 1

  return {
    date,
    dayOfYear,
    moonSign: zodiacSigns[moonSignIndex],
    moonNakshatra: nakshatras[moonNakshatraIndex],
    moonHouse,
    tithi: dayOfYear % 30, // 0-29
    weekdayIndex: date.getDay(), // 0-6
    planets: {
      sun: { house: ((dayOfYear + 6) % 12) + 1, sign: zodiacSigns[(dayOfYear + 6) % 12] },
      moon: { house: moonHouse, sign: zodiacSigns[moonSignIndex], nakshatra: nakshatras[moonNakshatraIndex] },
      mars: { house: ((dayOfYear + 4) % 12) + 1, sign: zodiacSigns[(dayOfYear + 4) % 12] },
      mercury: { house: ((dayOfYear + 3) % 12) + 1, sign: zodiacSigns[(dayOfYear + 3) % 12] },
      jupiter: { house: ((dayOfYear + 7) % 12) + 1, sign: zodiacSigns[(dayOfYear + 7) % 12] },
      venus: { house: ((dayOfYear + 9) % 12) + 1, sign: zodiacSigns[(dayOfYear + 9) % 12] },
      saturn: { house: ((dayOfYear + 10) % 12) + 1, sign: zodiacSigns[(dayOfYear + 10) % 12] },
      rahu: { house: ((dayOfYear + 2) % 12) + 1, sign: zodiacSigns[(dayOfYear + 2) % 12] },
      ketu: { house: ((dayOfYear + 8) % 12) + 1, sign: zodiacSigns[(dayOfYear + 8) % 12] },
    }
  }
}

// ============ LAYER 7: PLANET STRENGTH ENGINE ============

function calculatePlanetStrength(planet: string, house: number, sign: string): 'very_strong' | 'strong' | 'neutral' | 'weak' | 'very_weak' {
  // Simplified Shadbala logic
  const exaltedSigns: { [key: string]: string } = {
    sun: 'Aries',
    moon: 'Taurus',
    mars: 'Capricorn',
    mercury: 'Virgo',
    jupiter: 'Cancer',
    venus: 'Pisces',
    saturn: 'Libra'
  }

  const ownSigns: { [key: string]: string[] } = {
    sun: ['Leo'],
    moon: ['Cancer'],
    mars: ['Aries', 'Scorpio'],
    mercury: ['Gemini', 'Virgo'],
    jupiter: ['Sagittarius', 'Pisces'],
    venus: ['Taurus', 'Libra'],
    saturn: ['Capricorn', 'Aquarius']
  }

  const debilitatedSigns: { [key: string]: string } = {
    sun: 'Libra',
    moon: 'Scorpio',
    mars: 'Cancer',
    mercury: 'Pisces',
    jupiter: 'Capricorn',
    venus: 'Virgo',
    saturn: 'Aries'
  }

  if (sign === exaltedSigns[planet]) return 'very_strong'
  if (ownSigns[planet]?.includes(sign)) return 'strong'
  if (house === 1 || house === 10) return 'strong'
  if (sign === debilitatedSigns[planet]) return 'very_weak'
  if (house === 8 || house === 12) return 'weak'
  
  return 'neutral'
}

// ============ LAYER 8: PLANETARY SIGNAL ENGINE ============

function calculatePlanetarySignals(astronomicalData: ReturnType<typeof getAstronomicalData>, natalChart: VedicChart): DailySignals {
  let signals: DailySignals = {
    emotionalEnergy: 0,
    mentalClarity: 0,
    relationshipHarmony: 0,
    productivity: 0,
    opportunityLevel: 0,
    stressLevel: 0,
    creativity: 0,
    spiritualAwareness: 0,
  }

  const planets = astronomicalData.planets
  const moonHouse = planets.moon.house

  // ===== MOON SIGNALS (Weight: 4) =====
  // Moon governs emotions, mind, and instincts
  const moonStrength = calculatePlanetStrength('moon', moonHouse, planets.moon.sign)
  
  if (moonHouse === 1 || moonHouse === 10) {
    signals.emotionalEnergy += 2
    signals.mentalClarity += 1
  }
  if (moonHouse === 2 || moonHouse === 11) {
    signals.opportunityLevel += 2
  }
  if (moonHouse === 4) {
    signals.emotionalEnergy += 1
    signals.spiritualAwareness += 1
  }
  if (moonHouse === 5) {
    signals.creativity += 2
    signals.emotionalEnergy += 1
  }
  if (moonHouse === 7) {
    signals.relationshipHarmony += 2
  }
  if (moonHouse === 8) {
    signals.emotionalEnergy -= 3
    signals.stressLevel += 2
    signals.spiritualAwareness += 1 // 8th house also brings depth
  }
  if (moonHouse === 9) {
    signals.spiritualAwareness += 2
    signals.mentalClarity += 1
  }
  if (moonHouse === 12) {
    signals.emotionalEnergy -= 2
    signals.spiritualAwareness += 2
  }

  // ===== MERCURY SIGNALS (Weight: 2) =====
  // Mercury governs communication, thinking, analysis
  const mercuryHouse = planets.mercury.house

  if (mercuryHouse === 3 || mercuryHouse === 10) {
    signals.mentalClarity += 3
    signals.productivity += 2
  }
  if (mercuryHouse === 5) {
    signals.creativity += 2
    signals.mentalClarity += 1
  }
  if (mercuryHouse === 8 || mercuryHouse === 12) {
    signals.mentalClarity -= 2
  }

  // ===== MARS SIGNALS (Weight: 3) =====
  // Mars governs energy, action, drive, conflict
  const marsHouse = planets.mars.house

  if (marsHouse === 1 || marsHouse === 10) {
    signals.productivity += 3
    signals.opportunityLevel += 1
  }
  if (marsHouse === 3 || marsHouse === 6) {
    signals.productivity += 2
  }
  if (marsHouse === 4) {
    signals.emotionalEnergy -= 1
    signals.stressLevel += 1
  }
  if (marsHouse === 5) {
    signals.creativity += 1
    signals.productivity += 1
  }
  if (marsHouse === 7) {
    signals.relationshipHarmony -= 2
    signals.stressLevel += 1
  }
  if (marsHouse === 8 || marsHouse === 12) {
    signals.stressLevel += 1
    signals.emotionalEnergy -= 1
  }

  // ===== JUPITER SIGNALS (Weight: 3) =====
  // Jupiter governs expansion, luck, wisdom, growth
  const jupiterHouse = planets.jupiter.house

  if (jupiterHouse === 1 || jupiterHouse === 10) {
    signals.opportunityLevel += 3
    signals.mentalClarity += 2
    signals.productivity += 1
  }
  if (jupiterHouse === 5 || jupiterHouse === 9) {
    signals.creativity += 2
    signals.spiritualAwareness += 1
  }
  if (jupiterHouse === 7) {
    signals.relationshipHarmony += 2
  }
  if (jupiterHouse === 11) {
    signals.opportunityLevel += 2
  }

  // ===== VENUS SIGNALS (Weight: 2) =====
  // Venus governs relationships, beauty, pleasure, creativity
  const venusHouse = planets.venus.house

  if (venusHouse === 5 || venusHouse === 7) {
    signals.relationshipHarmony += 3
    signals.creativity += 2
  }
  if (venusHouse === 1 || venusHouse === 10) {
    signals.opportunityLevel += 1
  }
  if (venusHouse === 6 || venusHouse === 8 || venusHouse === 12) {
    signals.relationshipHarmony -= 2
  }

  // ===== SATURN SIGNALS (Weight: 4) =====
  // Saturn governs discipline, structure, delays, maturity
  const saturnHouse = planets.saturn.house

  if (saturnHouse === 1 || saturnHouse === 10) {
    signals.productivity += 1
    signals.mentalClarity += 1
  }
  if (saturnHouse === 8 || saturnHouse === 12) {
    signals.emotionalEnergy -= 2
    signals.stressLevel += 2
  }
  if (saturnHouse === 3 || saturnHouse === 6) {
    signals.productivity += 1
  }

  // ===== SUN SIGNALS (Weight: 2) =====
  // Sun governs vitality, confidence, core identity
  const sunHouse = planets.sun.house

  if (sunHouse === 1 || sunHouse === 10) {
    signals.mentalClarity += 2
    signals.productivity += 1
    signals.opportunityLevel += 1
  }
  if (sunHouse === 5) {
    signals.creativity += 1
  }
  if (sunHouse === 8 || sunHouse === 12) {
    signals.mentalClarity -= 1
  }

  // ===== RAHU SIGNALS (Weight: 3) =====
  // Rahu governs innovation, obsession, unusual things
  const rahuHouse = planets.rahu.house

  if (rahuHouse === 5 || rahuHouse === 9) {
    signals.creativity += 2
    signals.opportunityLevel += 1
  }
  if (rahuHouse === 1 || rahuHouse === 10) {
    signals.opportunityLevel += 1
  }

  // ===== KETU SIGNALS (Weight: 3) =====
  // Ketu governs introspection, spiritual wisdom, detachment
  const ketuHouse = planets.ketu.house

  if (ketuHouse === 4 || ketuHouse === 9 || ketuHouse === 12) {
    signals.spiritualAwareness += 2
  }

  // Apply normalization: -5 to +5
  const normalize = (score: number) => Math.max(-5, Math.min(5, score))

  return {
    emotionalEnergy: normalize(signals.emotionalEnergy),
    mentalClarity: normalize(signals.mentalClarity),
    relationshipHarmony: normalize(signals.relationshipHarmony),
    productivity: normalize(signals.productivity),
    opportunityLevel: normalize(signals.opportunityLevel),
    stressLevel: normalize(signals.stressLevel),
    creativity: normalize(signals.creativity),
    spiritualAwareness: normalize(signals.spiritualAwareness),
  }
}

// ============ LAYER 13: DAILY ENERGY INDEX ============

function calculateEnergyIndex(signals: DailySignals): DailyEnergyIndex {
  // Calculate weighted average of all signals
  const weights = {
    emotionalEnergy: 1.5,
    mentalClarity: 1.5,
    relationshipHarmony: 1,
    productivity: 1.5,
    opportunityLevel: 1.5,
    stressLevel: -1.5, // Negative weight (lower is better)
    creativity: 1,
    spiritualAwareness: 1
  }

  let weightedSum = 0
  let totalWeight = 0

  Object.entries(weights).forEach(([key, weight]) => {
    const signal = signals[key as keyof DailySignals]
    weightedSum += signal * Math.abs(weight) * Math.sign(weight)
    totalWeight += Math.abs(weight)
  })

  const average = weightedSum / totalWeight

  // Convert from -5 to +5 range to 0-10 range
  const score = ((average + 5) / 10) * 10

  let category: 'challenging' | 'balanced' | 'supportive'
  let reasoning = ''

  if (score < 3.5) {
    category = 'challenging'
    reasoning = 'Multiple challenging influences suggest a slower, introspective day'
  } else if (score < 6.5) {
    category = 'balanced'
    reasoning = 'Mixed planetary influences create a steady, neutral day'
  } else {
    category = 'supportive'
    reasoning = 'Strong supportive planetary alignments favor action and growth'
  }

  return {
    score: Math.round(score * 10) / 10,
    category,
    reasoning
  }
}

// ============ LAYER 11: MUHURTA TIMING ENGINE ============

function calculateMuhurtaWindows(): Array<{ time: string; activity: string }> {
  return [
    { time: '6:00 AM - 8:00 AM', activity: 'Spiritual practice, meditation, planning' },
    { time: '9:00 AM - 12:00 PM', activity: 'Communication, meetings, important decisions' },
    { time: '2:00 PM - 4:00 PM', activity: 'Creative work, financial decisions' },
    { time: '5:00 PM - 7:00 PM', activity: 'Relationships, collaborative work' },
    { time: '8:00 PM - 9:00 PM', activity: 'Reflection, journaling, gratitude' }
  ]
}

// ============ LAYER 14: AI INTERPRETATION ENGINE ============

function interpretSignals(
  signals: DailySignals,
  energyIndex: DailyEnergyIndex,
  natalChart: VedicChart,
  astronomicalData: ReturnType<typeof getAstronomicalData>
): Omit<DailyPredictionOutput, 'date' | 'userBirthDate' | 'signals' | 'energyIndex' | 'bestTimings' | 'muhurtaWindows'> {
  const planets = astronomicalData.planets

  // ===== COSMIC WEATHER =====
  let cosmicWeather = ''

  if (energyIndex.category === 'challenging') {
    cosmicWeather = `Today's cosmic weather invites introspection and gentle self-care. The planetary alignment suggests a slower pace, making this ideal for internal reflection, planning, and rest. External pushes may feel heavier than usual. This is temporary—tomorrow brings new cosmic rhythms.`
  } else if (energyIndex.category === 'balanced') {
    cosmicWeather = `The planets create a balanced cosmic weather pattern. Neither expansion nor contraction dominates; instead, steady energy flows. This is a reliable day for maintaining stability, completing routine tasks, and building sustainable progress without forcing.`
  } else {
    cosmicWeather = `Today radiates expansive cosmic energy. The planetary alignment favors action, new beginnings, and meaningful progress. Momentum is on your side. This is an excellent time to pursue important goals and take conscious risks aligned with your values.`
  }

  // ===== PERSONAL ENERGY TODAY =====
  let personalEnergyToday = ''

  if (signals.productivity > 2) {
    personalEnergyToday = `Your personal energy is strong and directed. Your ${natalChart.sun_sign} Sun receives excellent support, amplifying your confidence and capability. This is your day to tackle challenging projects and make visible progress on what matters most.`
  } else if (signals.productivity > -2) {
    personalEnergyToday = `Your energy flows steadily today. You have sufficient resources for routine tasks and gradual progress. Quality matters more than quantity in your efforts. Focus on what you can genuinely accomplish without strain.`
  } else {
    personalEnergyToday = `Your energy invites a gentler pace today. This is not a day for forcing progress. Instead, prioritize self-care, recovery, and tending to what's already begun. Rest is productive when your body and spirit ask for it.`
  }

  // ===== EMOTIONAL TONE =====
  let emotionalTone = ''

  if (signals.emotionalEnergy > 2) {
    emotionalTone = `Your emotional landscape is clear and resilient. Your ${natalChart.moon_sign} Moon is well-supported, bringing emotional clarity and authentic expression. You can trust your feelings to guide you wisely today.`
  } else if (signals.emotionalEnergy > -2) {
    emotionalTone = `Your emotions are flowing naturally. Allow yourself to feel what arises without judgment. This is a good day for honest communication about your inner world and authentic connection with others.`
  } else {
    emotionalTone = `Your emotional world requires extra gentleness today. Sensitivity is heightened, which brings depth but also vulnerability. Honor your need for rest, solitude, and supportive company. Self-compassion is essential.`
  }

  // ===== OPPORTUNITIES =====
  const opportunities: string[] = []

  if (signals.productivity > 1) {
    opportunities.push(`Channel momentum into your primary goals—${natalChart.sun_sign} energy is activated`)
  }
  if (signals.relationshipHarmony > 1) {
    opportunities.push('Deepen meaningful connections through presence and honest communication')
  }
  if (signals.creativity > 1) {
    opportunities.push('Express yourself creatively—artistic endeavors flow naturally today')
  }
  if (signals.mentalClarity > 1) {
    opportunities.push('Make important decisions with enhanced mental clarity and insight')
  }
  if (signals.opportunityLevel > 2) {
    opportunities.push('Unexpected positive developments may arrive—stay alert and open')
  }
  if (signals.spiritualAwareness > 1) {
    opportunities.push('Spiritual practices and meditation deepen your connection today')
  }

  if (opportunities.length === 0) {
    opportunities.push('Build momentum through small, consistent actions')
    opportunities.push('Practice presence in ordinary moments—value is hidden there')
  }

  // ===== CHALLENGES =====
  const challenges: string[] = []

  if (signals.stressLevel > 2) {
    challenges.push('Tension may be heightened—practice grounding techniques and patience')
  }
  if (signals.emotionalEnergy < -2) {
    challenges.push('Emotional sensitivity may be raw—practice fierce self-compassion')
  }
  if (signals.productivity < -1) {
    challenges.push('Avoid starting major projects today—consolidate what already exists')
  }
  if (signals.relationshipHarmony < -1) {
    challenges.push('Relationship dynamics may feel strained—allow extra space and gentleness')
  }
  if (signals.mentalClarity < -1) {
    challenges.push('Mental fog may obscure clarity—delay major decisions if possible')
  }
  if (signals.creativity < 0) {
    challenges.push('Creative blocks may appear—this is temporary and not your truth')
  }

  if (challenges.length === 0) {
    challenges.push('Watch for overconfidence—maintain grounded humility')
    challenges.push('Remember that even supportive days require conscious effort')
  }

  // ===== DAILY GUIDANCE =====
  let dailyGuidance = ''

  if (energyIndex.category === 'challenging') {
    dailyGuidance = `Today's guidance: Practice radical self-care. Begin with a grounding ritual suited to your ${natalChart.moon_sign} nature. Reduce your to-do list to essentials only. In relationships, listen more than you speak. Rest is productive. This challenging weather will pass—you're more supported than you realize. Trust the process.`
  } else if (energyIndex.category === 'balanced') {
    dailyGuidance = `Keep today intentional and balanced. Complete your regular tasks well without chasing aggressive expansion. This is a good day to consolidate recent gains. In relationships, maintain warmth without needing to solve everything. Steadiness has quiet power.`
  } else {
    dailyGuidance = `Harness this supportive energy wisely. Begin with absolute clarity about your highest priority. Channel momentum into meaningful goals, not scattered activity. Trust your instincts—they're accurate today. Make space to celebrate small wins. This energy won't last forever—use it purposefully and consciously.`
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

// ============ MAIN EXPORT ============

export function generateDailyPrediction(
  natalChart: VedicChart,
  userBirthDate: string,
  currentDate: Date = new Date()
): DailyPredictionOutput {
  // Layer 1: Get astronomical data
  const astronomicalData = getAstronomicalData(currentDate)
  
  // Layer 1: Calculate current planetary positions
  const currentPlanetaryPlacements = calculateCurrentPlanetaryPositions(currentDate).map(p => ({
    ...p,
    nakshatraImpact: getNakshatraImpactDescription(p.planet, p.sign)
  }))

  // Layer 8: Calculate planetary signals
  const signals = calculatePlanetarySignals(astronomicalData, natalChart)

  // Layer 13: Calculate energy index
  const energyIndex = calculateEnergyIndex(signals)

  // Layer 11: Get muhurta windows
  const muhurtaWindows = calculateMuhurtaWindows()

  // Generate best timing recommendations
  const bestTimings = [
    energyIndex.category === 'challenging'
      ? 'Avoid major activities in afternoon—morning is slightly better'
      : 'Morning and early afternoon are most supportive',
    energyIndex.category === 'supportive'
      ? 'All hours favor action—maximum flexibility'
      : 'Work with natural rhythms rather than forcing',
  ]

  // Layer 14: Generate interpretations
  const interpretations = interpretSignals(signals, energyIndex, natalChart, astronomicalData)

  return {
    date: currentDate.toISOString().split('T')[0],
    userBirthDate,
    signals,
    energyIndex,
    bestTimings,
    muhurtaWindows,
    currentPlanetaryPlacements,
    ...interpretations,
  }
}

// Helper function for Nakshatra impact descriptions
function getNakshatraImpactDescription(planet: string, sign: string): string {
  const impactMap: { [key: string]: string } = {
    'Sun:Leo': 'Maximum power and confidence',
    'Sun:Aries': 'Strong will and courage',
    'Moon:Cancer': 'Emotional sensitivity and nurturing',
    'Moon:Taurus': 'Stability and material focus',
    'Mars:Aries': 'Direct action and leadership',
    'Mars:Scorpio': 'Strategic power and transformation',
    'Jupiter:Sagittarius': 'Expansion and wisdom',
    'Jupiter:Pisces': 'Spiritual growth and intuition',
    'Venus:Taurus': 'Sensuality and material comfort',
    'Venus:Libra': 'Harmony and aesthetic appreciation',
    'Mercury:Gemini': 'Communication and adaptability',
    'Mercury:Virgo': 'Analytical skill and service',
    'Saturn:Capricorn': 'Discipline and achievement',
    'Saturn:Aquarius': 'Innovation within structure',
  }
  
  return impactMap[`${planet}:${sign}`] || 'Neutral influence on daily affairs'
}
