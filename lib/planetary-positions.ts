// Planetary positions and evolutionary lens calculations
// Based on ephemeris data and Vedic astrological principles

export interface PlanetaryPosition {
  planet: string
  sign: string
  nakshatra: string
  degree: number
  retrograde: boolean
}

export interface EvolutionaryLensAnalysis {
  primaryIntention: string
  soulsGrowthPattern: string
  lifeLesson: string
  karmaBeingResolved: string
  evolutionaryGoal: string
  numerologicalSupport: string
  actionSteps: string[]
}

export interface VedicLensAnalysis {
  dashtaPhala: string
  planetaryCycles: string[]
  remedies: string[]
  auspiciousPeriods: string[]
  predictions: {
    health: string
    wealth: string
    career: string
    relationships: string
    spirituality: string
  }
}

// Simplified ephemeris - in production use NASA JPL or Swiss Ephemeris
const planetaryMeanMotions: Record<string, number> = {
  Sun: 0.9833,
  Moon: 13.1761,
  Mercury: 1.3159,
  Venus: 1.6021,
  Mars: 0.5240,
  Jupiter: 0.0831,
  Saturn: 0.0335,
  Rahu: -0.0531,
  Ketu: -0.0531,
}

const nakshatras = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashirsha', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purvashadha', 'Uttarashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
]

const zodiacSigns = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
]

// Calculate approximate planetary positions for a given date
export function calculatePlanetaryPositions(date: Date): PlanetaryPosition[] {
  const positions: PlanetaryPosition[] = []
  
  // Calculate Julian Day Number
  const jd = getJulianDayNumber(date)
  
  // Calculate positions for each planet
  const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Rahu', 'Ketu']
  
  planets.forEach((planet) => {
    const degree = calculatePlanetaryDegree(planet, jd)
    const signIndex = Math.floor(degree / 30)
    const sign = zodiacSigns[signIndex % 12]
    const nakshatraIndex = Math.floor((degree % 30) / (30 / 27))
    const nakshatra = nakshatras[nakshatraIndex]
    
    positions.push({
      planet,
      sign,
      nakshatra,
      degree: degree % 360,
      retrograde: isRetrograde(planet, date)
    })
  })
  
  return positions
}

// Get evolutionary lens analysis based on planetary positions
export function getEvolutionaryLensAnalysis(
  positions: PlanetaryPosition[],
  lifePath: number,
  birthDate: string
): EvolutionaryLensAnalysis {
  const northNodeSign = positions.find(p => p.planet === 'Rahu')?.sign || 'Unknown'
  const sunSign = positions.find(p => p.planet === 'Sun')?.sign || 'Unknown'
  const moonNakshatra = positions.find(p => p.planet === 'Moon')?.nakshatra || 'Unknown'
  
  const primaryIntentions: Record<string, string> = {
    'Aries': 'Develop courage, initiative, and authentic self-expression',
    'Taurus': 'Build stability, self-worth, and material mastery',
    'Gemini': 'Master communication, adaptability, and intellectual growth',
    'Cancer': 'Deepen emotional wisdom, nurturing capacity, and intuition',
    'Leo': 'Express creative genius, authentic power, and heart-centered leadership',
    'Virgo': 'Perfect service, discernment, and practical wisdom',
    'Libra': 'Master relationships, harmony, and balanced decision-making',
    'Scorpio': 'Transform through depth, truth, and emotional mastery',
    'Sagittarius': 'Expand consciousness, wisdom, and philosophical understanding',
    'Capricorn': 'Build lasting legacy, responsibility, and disciplined power',
    'Aquarius': 'Revolutionize consciousness, community, and humanitarian vision',
    'Pisces': 'Dissolve ego, access infinite compassion, and spiritual merger'
  }
  
  const evolutionaryGoals: Record<string, string> = {
    'Ashwini': 'Pioneer new beginnings with spontaneous courage',
    'Bharani': 'Channel creative passion into productive work',
    'Krittika': 'Discern truth and radiate transformative clarity',
    'Rohini': 'Build lasting beauty and material stability',
    'Mrigashirsha': 'Harness curiosity toward meaningful discovery',
    'Ardra': 'Transform challenges into wisdom through flexibility',
    'Punarvasu': 'Return to light after every darkness',
    'Pushya': 'Nourish others while maintaining inner strength',
    'Ashlesha': 'Release stagnation and transform through intimacy',
    'Magha': 'Claim your authority and honor your lineage',
    'Purva Phalguni': 'Channel desire into creative manifestation',
    'Uttara Phalguni': 'Serve others from a place of stable integrity',
    'Hasta': 'Master practical skills and manifest intentions',
    'Chitra': 'Bridge worlds and express creative individuality',
    'Swati': 'Balance independence with healthy interdependence',
    'Vishakha': 'Transform ambition into balanced achievement',
    'Anuradha': 'Devotion leads to deep spiritual friendship',
    'Jyeshtha': 'Lead with courage while respecting ancient wisdom',
    'Mula': 'Question everything and discover hidden truths',
    'Purvashadha': 'Expand vision while maintaining ethical grounding',
    'Uttarashadha': 'Universal success through individual authenticity',
    'Shravana': 'Listen deeply to inner and outer guidance',
    'Dhanishta': 'Harmonize individual will with universal flow',
    'Shatabhisha': 'Heal hidden wounds and shine inner light',
    'Purva Bhadrapada': 'Passionate transformation through spiritual practice',
    'Uttara Bhadrapada': 'Graceful completion and ultimate liberation',
    'Revati': 'Compassionate guidance and sacred completion'
  }
  
  return {
    primaryIntention: primaryIntentions[sunSign] || 'Evolve through self-discovery',
    soulsGrowthPattern: `North Node in ${northNodeSign} calls you toward unfamiliar territory. This lifetime emphasizes ${primaryIntentions[northNodeSign]?.toLowerCase() || 'growth in new areas'}.`,
    lifeLesson: `Your Moon's nakshatra ${moonNakshatra} reveals your emotional foundation. The lesson: ${evolutionaryGoals[moonNakshatra] || 'balance and wisdom'}.`,
    karmaBeingResolved: `Life Path ${lifePath} combined with your placements suggests you're resolving karmic patterns related to ${getKarmicTheme(lifePath)}.`,
    evolutionaryGoal: evolutionaryGoals[moonNakshatra] || 'Continuous spiritual evolution',
    numerologicalSupport: `Life Path ${lifePath} supports your evolution through ${getNumerologicalSupport(lifePath)}.`,
    actionSteps: [
      `Honor your ${sunSign} nature while growing toward your ${northNodeSign} potential`,
      `Practice the lessons of ${moonNakshatra} through daily meditation and reflection`,
      `Align your material goals with your spiritual growth trajectory`,
      `Track synchronicities and intuitive guidance weekly`
    ]
  }
}

// Get Vedic lens predictions
export function getVedicLensAnalysis(
  positions: PlanetaryPosition[],
  birthDate: string
): VedicLensAnalysis {
  const today = new Date()
  const daysFromBirth = Math.floor((today.getTime() - new Date(birthDate).getTime()) / (1000 * 60 * 60 * 24))
  const saturnCycle = daysFromBirth % (29.5 * 365.25) // Saturn return ~29.5 years
  
  const inSaturnReturn = saturnCycle > (27 * 365.25) || saturnCycle < (2.5 * 365.25)
  
  return {
    dashtaPhala: `Current planetary dashas indicate a period of ${getDashaDescription(positions)}. Karma is being expressed through ${getKarmaExpression(positions)}.`,
    planetaryCycles: getPlanetaryCycles(positions, today),
    remedies: getVedicRemedies(positions),
    auspiciousPeriods: getAuspiciousPeriods(positions, today),
    predictions: {
      health: `Your vitality is supported by ${positions.find(p => p.planet === 'Sun')?.sign || 'your sun sign'}. Focus on practices that ground ${positions.find(p => p.planet === 'Mars')?.sign || 'your fire element'}.`,
      wealth: `Material expansion is indicated. ${positions.find(p => p.planet === 'Jupiter')?.retrograde ? 'Current Jupiter retrograde suggests internal wealth growth over external.' : 'Abundance flows through clear intention and action.'}`,
      career: `Career growth through ${getCareerGuidance(positions)}. This is a time to ${inSaturnReturn ? 'restructure and rebuild' : 'consolidate and expand'}.`,
      relationships: `Relationship energy: ${positions.find(p => p.planet === 'Venus')?.sign} Venus suggests focus on ${getRelationshipGuidance(positions)}.`,
      spirituality: `Spiritual evolution: Your soul seeks ${getSpirtualGuidance(positions)}. Meditation and introspection are especially powerful now.`
    }
  }
}

// Helper functions
function getJulianDayNumber(date: Date): number {
  const a = Math.floor((14 - (date.getMonth() + 1)) / 12)
  const y = date.getFullYear() + 4800 - a
  const m = (date.getMonth() + 1) + 12 * a - 3
  
  return date.getDate() + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045
}

function calculatePlanetaryDegree(planet: string, jd: number): number {
  // Simplified calculation - in production use full ephemeris
  const motion = planetaryMeanMotions[planet] || 1
  const degree = (motion * (jd - 2451545)) % 360
  return degree < 0 ? degree + 360 : degree
}

function isRetrograde(planet: string, date: Date): boolean {
  // Simplified - actual calculation requires detailed ephemeris
  if (planet === 'Rahu' || planet === 'Ketu') return false
  
  const month = date.getMonth()
  // Rough retrograde periods (simplified)
  const retroPeriods: Record<string, number[]> = {
    'Mercury': [1, 5, 9],
    'Venus': [1, 8],
    'Mars': [2, 10],
    'Jupiter': [9, 10, 11, 12],
    'Saturn': [4, 5, 6, 7, 8, 9]
  }
  
  return (retroPeriods[planet] || []).includes(month)
}

function getDashaDescription(positions: PlanetaryPosition[]): string {
  const lord = positions[Math.floor(Math.random() * positions.length)]?.planet || 'planetary'
  return `${lord} dasha - a time for ${lord.toLowerCase()} qualities to flower in your life`
}

function getKarmaExpression(positions: PlanetaryPosition[]): string {
  return 'the unfolding of your soul\'s evolutionary intentions through daily choices and relationships'
}

function getPlanetaryCycles(positions: PlanetaryPosition[], date: Date): string[] {
  return [
    'Moon transits your birth chart every 27-30 days - tracking emotional cycles',
    'Mercury retrograde periods occur 3x yearly - ideal for review and introspection',
    'Venus transit brings relationship themes - notice what emerges',
    'Saturn\'s slow movement suggests long-term structural development'
  ]
}

function getVedicRemedies(positions: PlanetaryPosition[]): string[] {
  const remedies = [
    'Daily meditation aligned with your Moon\'s nakshatra',
    'Chant the Mahamantra or Gayatri Mantra during auspicious hours',
    'Perform gratitude ritual honoring planets in challenging positions',
    'Wear gemstone for your weak planetary lord (consult astrologer)',
    'Donate to causes aligned with planets seeking balance'
  ]
  
  return remedies
}

function getAuspiciousPeriods(positions: PlanetaryPosition[], date: Date): string[] {
  const moonDay = date.getDate()
  const isDayOfWeek = date.getDay()
  
  return [
    isDayOfWeek === 0 ? 'Sundays are ruled by Sun - manifestation and leadership' : '',
    isDayOfWeek === 1 ? 'Mondays are ruled by Moon - introspection and new beginnings' : '',
    `Waxing Moon periods (current Moon waxes ${Math.floor((date.getDate() % 15) / 15 * 100)}%)`,
    `Avoid major decisions during Mercury retrograde - use for review instead`,
    'Full Moon and New Moon days carry amplified power - set intentions wisely'
  ].filter(Boolean)
}

function getKarmicTheme(lifePath: number): string {
  const themes: Record<number, string> = {
    1: 'independence and authentic leadership',
    2: 'balance and partnership',
    3: 'creative expression and communication',
    4: 'stability and foundation-building',
    5: 'freedom and adaptability',
    6: 'service and responsibility',
    7: 'spiritual wisdom and introspection',
    8: 'power and material mastery',
    9: 'universal love and completion'
  }
  return themes[lifePath] || 'continuous growth'
}

function getNumerologicalSupport(lifePath: number): string {
  const supports: Record<number, string> = {
    1: 'pioneering new paths and bold action',
    2: 'gentle wisdom and intuitive knowing',
    3: 'creative joy and authentic expression',
    4: 'patient foundation and grounded work',
    5: 'dynamic change and adventure',
    6: 'nurturing love and healing',
    7: 'spiritual insight and truth-seeking',
    8: 'abundance manifestation and power',
    9: 'global compassion and wisdom'
  }
  return supports[lifePath] || 'your unique path'
}

function getCareerGuidance(positions: PlanetaryPosition[]): string {
  const career = positions.find(p => p.planet === 'Saturn')?.sign || 'your calling'
  return `${career} themes - structure, discipline, and long-term vision serve you well`
}

function getRelationshipGuidance(positions: PlanetaryPosition[]): string {
  return `deepening authentic connection and honoring both independence and intimacy`
}

function getSpirtualGuidance(positions: PlanetaryPosition[]): string {
  return `liberation through understanding your true nature and cosmic interconnection`
}
