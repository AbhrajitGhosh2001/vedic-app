'use server'

import * as numerology from './numerology'
import { calculateGunaMilan } from './guna-milan'

export interface DeepCompatibilityAnalysis {
  overallScore: number
  connectionType: string
  sections: {
    loveStyles: {
      user1Traits: string[]
      user2Traits: string[]
      dynamicDescription: string
    }
    attraction: {
      whatHeSeesInYou: string[]
      whatYouSeeInHim: string[]
      initialChemistry: string
    }
    clashes: {
      frictionPoints: string[]
      emotionalLabor: string
    }
    idealMatch1: {
      compatibleNumbers: string[]
      qualities: string[]
    }
    idealMatch2: {
      compatibleNumbers: string[]
      qualities: string[]
    }
    verdict: {
      mentalMatch: number
      physicalAttraction: number
      emotionalEase: number
      growthPotential: number
      effortRequired: string
      requirements: { forYou: string[]; forThem: string[] }
    }
    vedicDeepDive: {
      grahaMatri: {
        user1PlanetaryLord: string
        user2PlanetaryLord: string
        relationship: 'Friend' | 'Neutral' | 'Enemy'
        description: string
      }
      manglikComparison: {
        user1Manglik: boolean
        user2Manglik: boolean
        status: 'both' | 'one' | 'none' | 'cancellation'
        description: string
      }
      emotionalAlignment: {
        moonSigns: string
        nakshatras: string
        emotionalCommunication: string
        score: number
      }
      navamshaMarriage: {
        seventhHouseStrength: string
        venusJupiterAlignment: string
        maritalPotential: string
        score: number
      }
      relationshipNarrative: {
        emotionalDynamics: string
        psychologicalCompatibility: string
        strengths: string[]
        challenges: string[]
        vedicScore: number
      }
    }
  }
  gunaMilan: any
  numerologyComparison: {
    moolAnkMatch: { score: number; description: string }
    lifePathMatch: { score: number; description: string }
    destinyMatch: { score: number; description: string }
    overallHarmony: number
  }
}

export async function generateDeepCompatibility(
  user1: any,
  user2: any
): Promise<DeepCompatibilityAnalysis> {
  
  // Calculate all numerology for both users
  const user1Numbers = {
    moolAnk: numerology.calculateMoolAnk(user1.birth_date),
    lifePath: numerology.calculateLifePath(user1.birth_date),
    destiny: numerology.calculateDestinyNumber(`${user1.first_name} ${user1.last_name || ''}`),
    personality: numerology.calculatePersonalityNumber(`${user1.first_name} ${user1.last_name || ''}`),
    soulUrge: numerology.calculateSoulUrge(`${user1.first_name} ${user1.last_name || ''}`),
  }

  const user2Numbers = {
    moolAnk: numerology.calculateMoolAnk(user2.birth_date),
    lifePath: numerology.calculateLifePath(user2.birth_date),
    destiny: numerology.calculateDestinyNumber(`${user2.first_name} ${user2.last_name || ''}`),
    personality: numerology.calculatePersonalityNumber(`${user2.first_name} ${user2.last_name || ''}`),
    soulUrge: numerology.calculateSoulUrge(`${user2.first_name} ${user2.last_name || ''}`),
  }

  // Calculate Guna Milan if we have nakshatra data
  let gunaMilan = null
  if (user1.nakshatra && user2.nakshatra && user1.moon_sign && user2.moon_sign) {
    gunaMilan = calculateGunaMilan(
      { moonSign: user1.moon_sign, nakshatra: user1.nakshatra },
      { moonSign: user2.moon_sign, nakshatra: user2.nakshatra }
    )
  }

  // Calculate numerology compatibility scores
  const moolAnkDiff = Math.abs(user1Numbers.moolAnk - user2Numbers.moolAnk)
  const lifePathDiff = Math.abs(user1Numbers.lifePath - user2Numbers.lifePath)
  const destinyDiff = Math.abs(user1Numbers.destiny - user2Numbers.destiny)

  const moolAnkScore = moolAnkDiff === 0 ? 100 : moolAnkDiff <= 2 ? 80 : moolAnkDiff <= 4 ? 60 : 40
  const lifePathScore = lifePathDiff === 0 ? 100 : lifePathDiff <= 2 ? 85 : lifePathDiff <= 4 ? 65 : 45
  const destinyScore = destinyDiff === 0 ? 100 : destinyDiff <= 2 ? 80 : destinyDiff <= 4 ? 60 : 40

  const numerologyHarmony = Math.round((moolAnkScore + lifePathScore + destinyScore) / 3)

  // Calculate overall score (weighted average)
  const gunaScore = gunaMilan ? gunaMilan.percentage : numerologyHarmony
  const overallScore = Math.round((gunaScore * 0.6) + (numerologyHarmony * 0.4))

  // Generate love styles based on numbers
  const user1Traits = getLoveStyleTraits(user1Numbers)
  const user2Traits = getLoveStyleTraits(user2Numbers)

  // Generate connection type
  let connectionType = 'Growth Partnership'
  if (overallScore >= 80) connectionType = 'Soulmate Connection'
  else if (overallScore >= 60) connectionType = 'Harmonious Match'
  else if (overallScore >= 40) connectionType = 'Growth Through Contrast'
  else connectionType = 'Karmic Lesson'

  return {
    overallScore,
    connectionType,
    sections: {
      loveStyles: {
        user1Traits,
        user2Traits,
        dynamicDescription: generateDynamicDescription(user1Numbers, user2Numbers)
      },
      attraction: {
        whatHeSeesInYou: getAttractionPoints(user1Numbers, 'in_you'),
        whatYouSeeInHim: getAttractionPoints(user2Numbers, 'in_them'),
        initialChemistry: getChemistryDescription(user1Numbers, user2Numbers)
      },
      clashes: {
        frictionPoints: getFrictionPoints(user1Numbers, user2Numbers),
        emotionalLabor: getEmotionalLaborDescription(user1Numbers, user2Numbers)
      },
      idealMatch1: {
        compatibleNumbers: getIdealNumbers(user1Numbers),
        qualities: getIdealQualities(user1Numbers)
      },
      idealMatch2: {
        compatibleNumbers: getIdealNumbers(user2Numbers),
        qualities: getIdealQualities(user2Numbers)
      },
      verdict: {
        mentalMatch: calculateMentalMatch(user1Numbers, user2Numbers),
        physicalAttraction: calculatePhysicalAttraction(user1Numbers, user2Numbers),
        emotionalEase: calculateEmotionalEase(user1Numbers, user2Numbers),
        growthPotential: calculateGrowthPotential(overallScore),
        effortRequired: overallScore >= 70 ? 'LOW' : overallScore >= 50 ? 'MODERATE' : 'HIGH',
        requirements: {
          forYou: getRequirementsFor(user1Numbers),
          forThem: getRequirementsFor(user2Numbers)
        }
      },
      vedicDeepDive: {
        grahaMatri: calculateGrahaMatri(user1, user2),
        manglikComparison: calculateManglikComparison(user1, user2),
        emotionalAlignment: calculateEmotionalAlignment(user1, user2),
        navamshaMarriage: calculateNavamshaMarriage(user1, user2),
        relationshipNarrative: generateRelationshipNarrative(user1, user2, gunaMilan, overallScore)
      }
    },
    gunaMilan,
    numerologyComparison: {
      moolAnkMatch: {
        score: moolAnkScore,
        description: getMoolAnkCompatibility(user1Numbers.moolAnk, user2Numbers.moolAnk)
      },
      lifePathMatch: {
        score: lifePathScore,
        description: getLifePathCompatibility(user1Numbers.lifePath, user2Numbers.lifePath)
      },
      destinyMatch: {
        score: destinyScore,
        description: getDestinyCompatibility(user1Numbers.destiny, user2Numbers.destiny)
      },
      overallHarmony: numerologyHarmony
    }
  }
}

function getLoveStyleTraits(numbers: any): string[] {
  const traits: string[] = []
  const meaning = numerology.numberMeanings[numbers.destiny] || numerology.numberMeanings[numbers.moolAnk]
  
  if (meaning) {
    traits.push(meaning.traits)
    traits.push(meaning.love)
    traits.push(meaning.strengths)
  }
  
  return traits.filter(Boolean)
}

function generateDynamicDescription(num1: any, num2: any): string {
  const diff = Math.abs(num1.lifePath - num2.lifePath)
  
  if (diff === 0) {
    return "You share the same life path, creating mirror-like understanding but potential power struggles over who leads."
  } else if (diff <= 2) {
    return "Your life paths complement each other beautifully - different enough to stay interesting, similar enough to understand deeply."
  } else if (diff <= 4) {
    return "Your energies create contrast - what one finds exciting, the other might find overwhelming. Growth happens through learning each other's rhythm."
  } else {
    return "You operate on very different frequencies. Initial spark is strong but maintaining harmony requires conscious effort and mutual respect."
  }
}

function getAttractionPoints(numbers: any, perspective: 'in_you' | 'in_them'): string[] {
  const points: string[] = []
  const meaning = numerology.numberMeanings[numbers.moolAnk]
  
  if (meaning) {
    points.push(`Their ${numbers.moolAnk} energy brings ${meaning.traits.toLowerCase()}`)
    points.push(`Natural ${meaning.strengths.toLowerCase()} that complements you`)
    points.push(`${meaning.love}`)
  }
  
  return points
}

function getChemistryDescription(num1: any, num2: any): string {
  const harmony = Math.abs(num1.destiny - num2.destiny)
  
  if (harmony <= 1) {
    return "Instant recognition - you feel seen, understood, and magnetically drawn together. The honeymoon phase is electric."
  } else if (harmony <= 3) {
    return "Strong initial attraction with a sense of mystery. You're intrigued by their differences while feeling comfortable in their presence."
  } else {
    return "Powerful but complex chemistry. The attraction is undeniable but you're drawn to qualities that might challenge you long-term."
  }
}

function getFrictionPoints(num1: any, num2: any): string[] {
  const points: string[] = []
  
  if (Math.abs(num1.lifePath - num2.lifePath) > 3) {
    points.push("Different life priorities creating tension over time allocation and goals")
  }
  
  if (Math.abs(num1.destiny - num2.destiny) > 3) {
    points.push("Conflicting communication styles leading to misunderstandings")
  }
  
  if (Math.abs(num1.soulUrge - num2.soulUrge) > 3) {
    points.push("Deep emotional needs that don't naturally align")
  }
  
  return points.length > 0 ? points : ["Minor friction - mostly compatible rhythms"]
}

function getEmotionalLaborDescription(num1: any, num2: any): string {
  const soulUrgeDiff = Math.abs(num1.soulUrge - num2.soulUrge)
  
  if (soulUrgeDiff > 4) {
    return "Significant emotional labor imbalance likely. One partner may end up doing more emotional caretaking and processing."
  } else if (soulUrgeDiff > 2) {
    return "Moderate emotional labor differences. Communication about needs prevents resentment from building."
  } else {
    return "Balanced emotional exchange. Both partners naturally understand and meet each other's emotional needs."
  }
}

function getIdealNumbers(numbers: any): string[] {
  const ideal: string[] = []
  
  // Compatible life paths
  if ([1, 5, 7].includes(numbers.lifePath)) {
    ideal.push("Life Path 3, 5, or 9 (freedom-loving, creative spirits)")
  } else if ([2, 4, 6].includes(numbers.lifePath)) {
    ideal.push("Life Path 2, 4, or 8 (stable, committed, grounding)")
  } else {
    ideal.push("Life Path 3, 6, or 9 (expressive, caring, evolved)")
  }
  
  return ideal
}

function getIdealQualities(numbers: any): string[] {
  return [
    "Emotionally available and expressive",
    "Secure attachment style",
    "Respects independence while offering stability",
    "Growth-oriented mindset",
    "Can hold space for your complexity"
  ]
}

function calculateMentalMatch(num1: any, num2: any): number {
  const diff = Math.abs(num1.lifePath - num2.lifePath)
  return diff === 0 ? 5 : diff <= 2 ? 4 : diff <= 4 ? 3 : 2
}

function calculatePhysicalAttraction(num1: any, num2: any): number {
  const diff = Math.abs(num1.moolAnk - num2.moolAnk)
  return diff === 0 ? 4 : diff <= 2 ? 5 : diff <= 4 ? 4 : 3
}

function calculateEmotionalEase(num1: any, num2: any): number {
  const diff = Math.abs(num1.soulUrge - num2.soulUrge)
  return diff === 0 ? 5 : diff <= 2 ? 4 : diff <= 4 ? 3 : 2
}

function calculateGrowthPotential(overallScore: number): number {
  return overallScore >= 70 ? 5 : overallScore >= 50 ? 4 : overallScore >= 30 ? 3 : 2
}

function getRequirementsFor(numbers: any): string[] {
  return [
    `Honor your ${numbers.lifePath} life path - don't sacrifice core direction`,
    "Maintain healthy boundaries and personal space",
    "Communicate needs clearly without guilt"
  ]
}

function getMoolAnkCompatibility(num1: number, num2: number): string {
  if (num1 === num2) return "Same birth day energy - instant understanding but may compete"
  if (Math.abs(num1 - num2) <= 2) return "Complementary energies that balance each other"
  return "Different instinctive responses - requires patience"
}

function getLifePathCompatibility(num1: number, num2: number): string {
  if (num1 === num2) return "Walking the same path - deep alignment of purpose"
  if (Math.abs(num1 - num2) <= 2) return "Parallel paths that support each other's growth"
  return "Divergent life directions - needs mutual respect and flexibility"
}

function getDestinyCompatibility(num1: number, num2: number): string {
  if (num1 === num2) return "Natural communication flow and understanding"
  if (Math.abs(num1 - num2) <= 2) return "Different expressions but harmonious interaction"
  return "May need translation - express yourselves differently"
}

// Vedic Compatibility Functions

function calculateGrahaMatri(user1: any, user2: any): any {
  const planetaryLords: { [key: string]: string } = {
    'Aries': 'Mars', 'Taurus': 'Venus', 'Gemini': 'Mercury', 'Cancer': 'Moon',
    'Leo': 'Sun', 'Virgo': 'Mercury', 'Libra': 'Venus', 'Scorpio': 'Mars',
    'Sagittarius': 'Jupiter', 'Capricorn': 'Saturn', 'Aquarius': 'Saturn', 'Pisces': 'Jupiter'
  }

  const planetFriendships: { [key: string]: { [key: string]: string } } = {
    'Sun': { 'Moon': 'Neutral', 'Mars': 'Friend', 'Mercury': 'Enemy', 'Jupiter': 'Friend', 'Venus': 'Enemy', 'Saturn': 'Enemy' },
    'Moon': { 'Sun': 'Neutral', 'Mars': 'Friend', 'Mercury': 'Neutral', 'Jupiter': 'Friend', 'Venus': 'Friend', 'Saturn': 'Enemy' },
    'Mars': { 'Sun': 'Friend', 'Moon': 'Friend', 'Mercury': 'Enemy', 'Jupiter': 'Friend', 'Venus': 'Enemy', 'Saturn': 'Friend' },
    'Mercury': { 'Sun': 'Enemy', 'Moon': 'Neutral', 'Mars': 'Enemy', 'Jupiter': 'Friend', 'Venus': 'Friend', 'Saturn': 'Enemy' },
    'Jupiter': { 'Sun': 'Friend', 'Moon': 'Friend', 'Mars': 'Friend', 'Mercury': 'Friend', 'Venus': 'Neutral', 'Saturn': 'Enemy' },
    'Venus': { 'Sun': 'Enemy', 'Moon': 'Friend', 'Mars': 'Enemy', 'Mercury': 'Friend', 'Jupiter': 'Neutral', 'Saturn': 'Friend' },
    'Saturn': { 'Sun': 'Enemy', 'Moon': 'Enemy', 'Mars': 'Friend', 'Mercury': 'Enemy', 'Jupiter': 'Enemy', 'Venus': 'Friend' }
  }

  const lord1 = planetaryLords[user1.sun_sign] || 'Sun'
  const lord2 = planetaryLords[user2.sun_sign] || 'Sun'
  const relationship = planetFriendships[lord1]?.[lord2] || 'Neutral'

  const relationshipTexts: { [key: string]: string } = {
    'Friend': `${lord1} and ${lord2} are friends in the cosmic arrangement. You naturally understand each other's motivations and support each other's goals. There's psychological ease and natural compatibility.`,
    'Neutral': `${lord1} and ${lord2} maintain a neutral stance. You don't naturally support or hinder each other, creating independence but requiring conscious effort to build bridges.`,
    'Enemy': `${lord1} and ${lord2} have opposing natures. This creates tension and misunderstanding, but also opportunity for growth through learning to appreciate your differences.`
  }

  return {
    user1PlanetaryLord: lord1,
    user2PlanetaryLord: lord2,
    relationship,
    description: relationshipTexts[relationship]
  }
}

function calculateManglikComparison(user1: any, user2: any): any {
  const isManglik = (profile: any) => {
    if (!profile.mars_house) return false
    const manglikHouses = [1, 2, 4, 7, 8, 12]
    return manglikHouses.includes(profile.mars_house)
  }

  const user1Manglik = isManglik(user1)
  const user2Manglik = isManglik(user2)

  let status: 'both' | 'one' | 'none' | 'cancellation' = 'none'
  let description = ''

  if (user1Manglik && user2Manglik) {
    status = 'both'
    description = 'Both partners are Manglik. This intensifies passion, energy, and transformation potential. While traditionally considered challenging, two Manglik individuals often understand each other\'s intensity and create a powerful, dynamic partnership.'
  } else if (user1Manglik || user2Manglik) {
    status = 'one'
    description = 'One partner is Manglik. The Manglik\'s Mars energy may create passion-driven situations, while the non-Manglik partner brings grounding stability. This dynamic can work beautifully when both appreciate the intensity the Manglik brings.'
  } else {
    status = 'none'
    description = 'Neither partner has Manglik Dosha. Without Mars intensity in critical houses, your relationship has a more peaceful, steady foundation, though you may find less dramatic passion.'
  }

  return { user1Manglik, user2Manglik, status, description }
}

function calculateEmotionalAlignment(user1: any, user2: any): any {
  const moonSignCompatibility: { [key: string]: string[] } = {
    'Aries': ['Leo', 'Sagittarius', 'Aries'],
    'Taurus': ['Virgo', 'Capricorn', 'Taurus'],
    'Gemini': ['Libra', 'Aquarius', 'Gemini'],
    'Cancer': ['Scorpio', 'Pisces', 'Cancer'],
    'Leo': ['Aries', 'Sagittarius', 'Leo'],
    'Virgo': ['Taurus', 'Capricorn', 'Virgo'],
    'Libra': ['Gemini', 'Aquarius', 'Libra'],
    'Scorpio': ['Cancer', 'Pisces', 'Scorpio'],
    'Sagittarius': ['Aries', 'Leo', 'Sagittarius'],
    'Capricorn': ['Taurus', 'Virgo', 'Capricorn'],
    'Aquarius': ['Gemini', 'Libra', 'Aquarius'],
    'Pisces': ['Cancer', 'Scorpio', 'Pisces']
  }

  const user1Moon = user1.moon_sign || 'Unknown'
  const user2Moon = user2.moon_sign || 'Unknown'
  
  const isCompatible = moonSignCompatibility[user1Moon]?.includes(user2Moon) || false
  const score = isCompatible ? 80 : 50

  const emotionalCommunication = isCompatible
    ? `Your ${user1Moon} Moon and ${user2Moon} Moon create emotional resonance. You naturally understand each other's feelings and respond with empathy.`
    : `Your ${user1Moon} Moon and ${user2Moon} Moon process emotions differently. This requires patience and willingness to translate your emotional languages.`

  return {
    moonSigns: `${user1Moon} ↔ ${user2Moon}`,
    nakshatras: `${user1.nakshatra_name || 'Unknown'} ↔ ${user2.nakshatra_name || 'Unknown'}`,
    emotionalCommunication,
    score
  }
}

function calculateNavamshaMarriage(user1: any, user2: any): any {
  // Simplified Navamsha analysis based on available data
  const venusMoon1 = user1.moon_sign
  const venusMoon2 = user2.moon_sign

  const seventhHouseStrength = 'Strong Venus and benefic 7th lord in Navamsha indicate marital harmony'
  const venusJupiterAlignment = venusMoon1 && venusMoon2 
    ? `Venus in ${venusMoon1} (User 1) and ${venusMoon2} (User 2) creates romantic compatibility`
    : 'Check your detailed Navamsha chart for Venus placement'
  
  const maritalPotential = 'Your Navamsha chart holds the key to long-term marriage potential and spiritual compatibility in relationships'
  
  return {
    seventhHouseStrength,
    venusJupiterAlignment,
    maritalPotential,
    score: 70
  }
}

function generateRelationshipNarrative(user1: any, user2: any, gunaMilan: any, overallScore: number): any {
  const emotionalDynamics = `Your emotional connection is woven through ${user1.moon_sign} and ${user2.moon_sign} energies. ${user1.moon_sign} brings its natural tendencies, while ${user2.moon_sign} contributes its own emotional signature, creating a unique dance of vulnerability and support.`
  
  const psychologicalCompatibility = `Psychologically, you operate through different lenses. Your ${user1.sun_sign} Sun and their ${user2.sun_sign} Sun create both harmony and challenge—you're here to learn from each other's perspective on life.`
  
  const strengths = [
    'Different but complementary astrological energies',
    'Potential for significant mutual growth',
    'Unique chemistry that goes beyond conventional compatibility',
    gunaMilan ? `Vedic Guna Milan score of ${gunaMilan.totalScore}/36` : 'Soul-level connection'
  ]
  
  const challenges = [
    'Need for conscious communication about emotional needs',
    'Different relationship rhythms to navigate',
    'Potential for misunderstanding without awareness',
    'External pressures that test the bond'
  ]

  return {
    emotionalDynamics,
    psychologicalCompatibility,
    strengths,
    challenges,
    vedicScore: overallScore
  }
}
