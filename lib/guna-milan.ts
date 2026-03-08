// COMPLETE VEDIC GUNA MILAN COMPATIBILITY CALCULATION
// All 8 Gunas with full logic and lookup tables

export interface Nakshatra {
  id: number
  name: string
  lord: string
  gana: 'Deva' | 'Manushya' | 'Rakshasa'
  element: 'Vata' | 'Pitta' | 'Kapha'
  yoni: string
  ruler: string
}

export interface ZodiacSign {
  element: string
  lord: string
  varna: string
  vasya: string
}

export interface Person {
  moonSign: string
  nakshatra: number
  sunSign?: string
}

export interface GunaScore {
  score: number
  maxScore: number
  description: string
  [key: string]: unknown
}

export interface GunaBreakdown {
  varna: GunaScore
  vasya: GunaScore
  tara: GunaScore
  yoni: GunaScore
  grahaMaitri: GunaScore
  gana: GunaScore
  bhakut: GunaScore
  nadi: GunaScore
}

export interface CompatibilityResult {
  totalScore: number
  maxScore: number
  percentage: number
  compatibility: string
  breakdown: GunaBreakdown
}

// ==================== 1. NAKSHATRA DATA ====================
export const NAKSHATRAS: Nakshatra[] = [
  { id: 1, name: 'Ashwini', lord: 'Ketu', gana: 'Deva', element: 'Pitta', yoni: 'Horse', ruler: 'Aries' },
  { id: 2, name: 'Bharani', lord: 'Venus', gana: 'Manushya', element: 'Pitta', yoni: 'Elephant', ruler: 'Aries' },
  { id: 3, name: 'Krittika', lord: 'Sun', gana: 'Rakshasa', element: 'Pitta', yoni: 'Goat', ruler: 'Taurus' },
  { id: 4, name: 'Rohini', lord: 'Moon', gana: 'Manushya', element: 'Kapha', yoni: 'Snake', ruler: 'Taurus' },
  { id: 5, name: 'Mrigashirsha', lord: 'Mars', gana: 'Deva', element: 'Vata', yoni: 'Deer', ruler: 'Gemini' },
  { id: 6, name: 'Ardra', lord: 'Rahu', gana: 'Rakshasa', element: 'Vata', yoni: 'Dog', ruler: 'Gemini' },
  { id: 7, name: 'Punarvasu', lord: 'Jupiter', gana: 'Deva', element: 'Vata', yoni: 'Cat', ruler: 'Cancer' },
  { id: 8, name: 'Pushya', lord: 'Saturn', gana: 'Deva', element: 'Kapha', yoni: 'Sheep', ruler: 'Cancer' },
  { id: 9, name: 'Ashlesha', lord: 'Mercury', gana: 'Rakshasa', element: 'Kapha', yoni: 'Serpent', ruler: 'Cancer' },
  { id: 10, name: 'Magha', lord: 'Ketu', gana: 'Rakshasa', element: 'Pitta', yoni: 'Rat', ruler: 'Leo' },
  { id: 11, name: 'Purva Phalguni', lord: 'Venus', gana: 'Manushya', element: 'Pitta', yoni: 'Rat', ruler: 'Leo' },
  { id: 12, name: 'Uttara Phalguni', lord: 'Sun', gana: 'Manushya', element: 'Pitta', yoni: 'Cow', ruler: 'Virgo' },
  { id: 13, name: 'Hasta', lord: 'Moon', gana: 'Deva', element: 'Vata', yoni: 'Buffalo', ruler: 'Virgo' },
  { id: 14, name: 'Chitra', lord: 'Mars', gana: 'Rakshasa', element: 'Pitta', yoni: 'Tiger', ruler: 'Libra' },
  { id: 15, name: 'Swati', lord: 'Rahu', gana: 'Deva', element: 'Vata', yoni: 'Buffalo', ruler: 'Libra' },
  { id: 16, name: 'Vishakha', lord: 'Jupiter', gana: 'Rakshasa', element: 'Pitta', yoni: 'Tiger', ruler: 'Scorpio' },
  { id: 17, name: 'Anuradha', lord: 'Saturn', gana: 'Deva', element: 'Vata', yoni: 'Deer', ruler: 'Scorpio' },
  { id: 18, name: 'Jyeshtha', lord: 'Mercury', gana: 'Rakshasa', element: 'Pitta', yoni: 'Deer', ruler: 'Scorpio' },
  { id: 19, name: 'Mula', lord: 'Ketu', gana: 'Rakshasa', element: 'Vata', yoni: 'Dog', ruler: 'Sagittarius' },
  { id: 20, name: 'Purva Ashadha', lord: 'Venus', gana: 'Manushya', element: 'Vata', yoni: 'Monkey', ruler: 'Sagittarius' },
  { id: 21, name: 'Uttara Ashadha', lord: 'Sun', gana: 'Manushya', element: 'Vata', yoni: 'Mongoose', ruler: 'Capricorn' },
  { id: 22, name: 'Shravana', lord: 'Moon', gana: 'Deva', element: 'Kapha', yoni: 'Monkey', ruler: 'Capricorn' },
  { id: 23, name: 'Dhanishta', lord: 'Mars', gana: 'Rakshasa', element: 'Vata', yoni: 'Lion', ruler: 'Aquarius' },
  { id: 24, name: 'Shatabhisha', lord: 'Rahu', gana: 'Rakshasa', element: 'Vata', yoni: 'Horse', ruler: 'Aquarius' },
  { id: 25, name: 'Purva Bhadrapada', lord: 'Jupiter', gana: 'Manushya', element: 'Vata', yoni: 'Lion', ruler: 'Pisces' },
  { id: 26, name: 'Uttara Bhadrapada', lord: 'Saturn', gana: 'Manushya', element: 'Kapha', yoni: 'Cow', ruler: 'Pisces' },
  { id: 27, name: 'Revati', lord: 'Mercury', gana: 'Deva', element: 'Kapha', yoni: 'Elephant', ruler: 'Pisces' }
]

// ==================== 2. ZODIAC SIGNS DATA ====================
export const ZODIAC_SIGNS: Record<string, ZodiacSign> = {
  'Aries': { element: 'Fire', lord: 'Mars', varna: 'Kshatriya', vasya: 'Quadruped' },
  'Taurus': { element: 'Earth', lord: 'Venus', varna: 'Vaishya', vasya: 'Quadruped' },
  'Gemini': { element: 'Air', lord: 'Mercury', varna: 'Shudra', vasya: 'Human' },
  'Cancer': { element: 'Water', lord: 'Moon', varna: 'Brahmin', vasya: 'Insect' },
  'Leo': { element: 'Fire', lord: 'Sun', varna: 'Kshatriya', vasya: 'Quadruped' },
  'Virgo': { element: 'Earth', lord: 'Mercury', varna: 'Vaishya', vasya: 'Human' },
  'Libra': { element: 'Air', lord: 'Venus', varna: 'Shudra', vasya: 'Human' },
  'Scorpio': { element: 'Water', lord: 'Mars', varna: 'Brahmin', vasya: 'Insect' },
  'Sagittarius': { element: 'Fire', lord: 'Jupiter', varna: 'Kshatriya', vasya: 'Quadruped' },
  'Capricorn': { element: 'Earth', lord: 'Saturn', varna: 'Vaishya', vasya: 'Quadruped' },
  'Aquarius': { element: 'Air', lord: 'Saturn', varna: 'Shudra', vasya: 'Human' },
  'Pisces': { element: 'Water', lord: 'Jupiter', varna: 'Brahmin', vasya: 'Insect' }
}

export const ZODIAC_LIST = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']

// ==================== 3. PLANETARY FRIENDSHIPS ====================
const PLANETARY_FRIENDS: Record<string, string[]> = {
  'Sun': ['Moon', 'Mars', 'Jupiter'],
  'Moon': ['Sun', 'Mercury'],
  'Mars': ['Sun', 'Moon', 'Jupiter'],
  'Mercury': ['Sun', 'Venus'],
  'Jupiter': ['Sun', 'Moon', 'Mars'],
  'Venus': ['Mercury', 'Saturn'],
  'Saturn': ['Mercury', 'Venus'],
  'Rahu': ['Venus', 'Saturn'],
  'Ketu': ['Mars', 'Venus']
}

const PLANETARY_ENEMIES: Record<string, string[]> = {
  'Sun': ['Venus', 'Saturn'],
  'Moon': [],
  'Mars': ['Mercury'],
  'Mercury': ['Moon'],
  'Jupiter': ['Mercury', 'Venus'],
  'Venus': ['Sun', 'Moon'],
  'Saturn': ['Sun', 'Moon', 'Mars'],
  'Rahu': ['Sun', 'Moon', 'Mars'],
  'Ketu': ['Sun', 'Moon']
}

// ==================== 4. YONI COMPATIBILITY ====================
const YONI_PAIRS: Record<string, Record<string, number>> = {
  'Horse': { 'Horse': 4, 'Elephant': 2, 'Sheep': 2, 'Snake': 1, 'Dog': 2, 'Cat': 2, 'Rat': 2, 'Cow': 2, 'Buffalo': 2, 'Tiger': 1, 'Deer': 3, 'Monkey': 2, 'Mongoose': 2, 'Lion': 1, 'Goat': 2, 'Serpent': 1 },
  'Elephant': { 'Horse': 2, 'Elephant': 4, 'Sheep': 3, 'Snake': 3, 'Dog': 2, 'Cat': 2, 'Rat': 2, 'Cow': 2, 'Buffalo': 3, 'Tiger': 1, 'Deer': 2, 'Monkey': 3, 'Mongoose': 2, 'Lion': 0, 'Goat': 3, 'Serpent': 3 },
  'Sheep': { 'Horse': 2, 'Elephant': 3, 'Sheep': 4, 'Snake': 3, 'Dog': 0, 'Cat': 2, 'Rat': 1, 'Cow': 3, 'Buffalo': 3, 'Tiger': 1, 'Deer': 2, 'Monkey': 2, 'Mongoose': 2, 'Lion': 1, 'Goat': 4, 'Serpent': 3 },
  'Snake': { 'Horse': 1, 'Elephant': 3, 'Sheep': 3, 'Snake': 4, 'Dog': 2, 'Cat': 2, 'Rat': 1, 'Cow': 1, 'Buffalo': 2, 'Tiger': 2, 'Deer': 2, 'Monkey': 0, 'Mongoose': 0, 'Lion': 2, 'Goat': 3, 'Serpent': 4 },
  'Dog': { 'Horse': 2, 'Elephant': 2, 'Sheep': 0, 'Snake': 2, 'Dog': 4, 'Cat': 2, 'Rat': 1, 'Cow': 2, 'Buffalo': 2, 'Tiger': 2, 'Deer': 1, 'Monkey': 2, 'Mongoose': 2, 'Lion': 2, 'Goat': 0, 'Serpent': 2 },
  'Cat': { 'Horse': 2, 'Elephant': 2, 'Sheep': 2, 'Snake': 2, 'Dog': 2, 'Cat': 4, 'Rat': 0, 'Cow': 2, 'Buffalo': 2, 'Tiger': 1, 'Deer': 3, 'Monkey': 3, 'Mongoose': 2, 'Lion': 1, 'Goat': 2, 'Serpent': 2 },
  'Rat': { 'Horse': 2, 'Elephant': 2, 'Sheep': 1, 'Snake': 1, 'Dog': 1, 'Cat': 0, 'Rat': 4, 'Cow': 2, 'Buffalo': 2, 'Tiger': 2, 'Deer': 2, 'Monkey': 2, 'Mongoose': 2, 'Lion': 2, 'Goat': 1, 'Serpent': 1 },
  'Cow': { 'Horse': 2, 'Elephant': 2, 'Sheep': 3, 'Snake': 1, 'Dog': 2, 'Cat': 2, 'Rat': 2, 'Cow': 4, 'Buffalo': 3, 'Tiger': 0, 'Deer': 2, 'Monkey': 2, 'Mongoose': 2, 'Lion': 1, 'Goat': 3, 'Serpent': 1 },
  'Buffalo': { 'Horse': 2, 'Elephant': 3, 'Sheep': 3, 'Snake': 2, 'Dog': 2, 'Cat': 2, 'Rat': 2, 'Cow': 3, 'Buffalo': 4, 'Tiger': 0, 'Deer': 2, 'Monkey': 2, 'Mongoose': 2, 'Lion': 1, 'Goat': 3, 'Serpent': 2 },
  'Tiger': { 'Horse': 1, 'Elephant': 1, 'Sheep': 1, 'Snake': 2, 'Dog': 2, 'Cat': 1, 'Rat': 2, 'Cow': 0, 'Buffalo': 0, 'Tiger': 4, 'Deer': 0, 'Monkey': 2, 'Mongoose': 2, 'Lion': 3, 'Goat': 1, 'Serpent': 2 },
  'Deer': { 'Horse': 3, 'Elephant': 2, 'Sheep': 2, 'Snake': 2, 'Dog': 1, 'Cat': 3, 'Rat': 2, 'Cow': 2, 'Buffalo': 2, 'Tiger': 0, 'Deer': 4, 'Monkey': 2, 'Mongoose': 2, 'Lion': 1, 'Goat': 2, 'Serpent': 2 },
  'Monkey': { 'Horse': 2, 'Elephant': 3, 'Sheep': 2, 'Snake': 0, 'Dog': 2, 'Cat': 3, 'Rat': 2, 'Cow': 2, 'Buffalo': 2, 'Tiger': 2, 'Deer': 2, 'Monkey': 4, 'Mongoose': 2, 'Lion': 2, 'Goat': 2, 'Serpent': 0 },
  'Mongoose': { 'Horse': 2, 'Elephant': 2, 'Sheep': 2, 'Snake': 0, 'Dog': 2, 'Cat': 2, 'Rat': 2, 'Cow': 2, 'Buffalo': 2, 'Tiger': 2, 'Deer': 2, 'Monkey': 2, 'Mongoose': 4, 'Lion': 2, 'Goat': 2, 'Serpent': 0 },
  'Lion': { 'Horse': 1, 'Elephant': 0, 'Sheep': 1, 'Snake': 2, 'Dog': 2, 'Cat': 1, 'Rat': 2, 'Cow': 1, 'Buffalo': 1, 'Tiger': 3, 'Deer': 1, 'Monkey': 2, 'Mongoose': 2, 'Lion': 4, 'Goat': 1, 'Serpent': 2 },
  'Goat': { 'Horse': 2, 'Elephant': 3, 'Sheep': 4, 'Snake': 3, 'Dog': 0, 'Cat': 2, 'Rat': 1, 'Cow': 3, 'Buffalo': 3, 'Tiger': 1, 'Deer': 2, 'Monkey': 2, 'Mongoose': 2, 'Lion': 1, 'Goat': 4, 'Serpent': 3 },
  'Serpent': { 'Horse': 1, 'Elephant': 3, 'Sheep': 3, 'Snake': 4, 'Dog': 2, 'Cat': 2, 'Rat': 1, 'Cow': 1, 'Buffalo': 2, 'Tiger': 2, 'Deer': 2, 'Monkey': 0, 'Mongoose': 0, 'Lion': 2, 'Goat': 3, 'Serpent': 4 }
}

// ==================== 5. GANA COMPATIBILITY ====================
const GANA_COMPATIBILITY: Record<string, number> = {
  'Deva-Deva': 6,
  'Deva-Manushya': 5,
  'Deva-Rakshasa': 1,
  'Manushya-Deva': 6,
  'Manushya-Manushya': 6,
  'Manushya-Rakshasa': 0,
  'Rakshasa-Deva': 0,
  'Rakshasa-Manushya': 0,
  'Rakshasa-Rakshasa': 6
}

// ==================== 6. NADI COMPATIBILITY ====================
const NADI_DOSHA: Record<string, number> = {
  'Vata-Vata': 0,
  'Pitta-Pitta': 0,
  'Kapha-Kapha': 0,
  'Vata-Pitta': 8,
  'Vata-Kapha': 8,
  'Pitta-Vata': 8,
  'Pitta-Kapha': 8,
  'Kapha-Vata': 8,
  'Kapha-Pitta': 8
}

// ==================== HELPER FUNCTIONS ====================

export function getNakshatraById(id: number): Nakshatra | undefined {
  return NAKSHATRAS.find(n => n.id === id)
}

export function getZodiacInfo(sign: string): ZodiacSign {
  return ZODIAC_SIGNS[sign]
}

export function getNakshatraFromMoonLongitude(moonLongitude: number): number {
  // Each nakshatra is 13.333... degrees (360/27)
  const nakshatraIndex = Math.floor(moonLongitude / (360 / 27))
  return (nakshatraIndex % 27) + 1
}

export function getMoonSignFromLongitude(moonLongitude: number): string {
  const signIndex = Math.floor(moonLongitude / 30)
  return ZODIAC_LIST[signIndex % 12]
}

// ==================== MAIN GUNA MILAN CALCULATION ====================

export function calculateGunaMilan(person1: Person, person2: Person): CompatibilityResult {
  let totalScore = 0
  const breakdown: GunaBreakdown = {} as GunaBreakdown

  // 1. VARNA (1 point)
  breakdown.varna = calculateVarna(person1.moonSign, person2.moonSign)
  totalScore += breakdown.varna.score

  // 2. VASYA (2 points)
  breakdown.vasya = calculateVasya(person1.moonSign, person2.moonSign)
  totalScore += breakdown.vasya.score

  // 3. TARA (3 points)
  breakdown.tara = calculateTara(person1.nakshatra, person2.nakshatra)
  totalScore += breakdown.tara.score

  // 4. YONI (4 points)
  breakdown.yoni = calculateYoni(person1.nakshatra, person2.nakshatra)
  totalScore += breakdown.yoni.score

  // 5. GRAHA MAITRI (5 points)
  breakdown.grahaMaitri = calculateGrahaMaitri(person1.moonSign, person2.moonSign)
  totalScore += breakdown.grahaMaitri.score

  // 6. GANA (6 points)
  breakdown.gana = calculateGana(person1.nakshatra, person2.nakshatra)
  totalScore += breakdown.gana.score

  // 7. BHAKUT (7 points)
  breakdown.bhakut = calculateBhakut(person1.moonSign, person2.moonSign)
  totalScore += breakdown.bhakut.score

  // 8. NADI (8 points)
  breakdown.nadi = calculateNadi(person1.nakshatra, person2.nakshatra)
  totalScore += breakdown.nadi.score

  const percentage = Math.round((totalScore / 36) * 100)

  return {
    totalScore,
    maxScore: 36,
    percentage,
    compatibility: getCompatibilityRating(totalScore),
    breakdown
  }
}

// ==================== INDIVIDUAL GUNA CALCULATIONS ====================

function calculateVarna(moonSign1: string, moonSign2: string): GunaScore {
  const varna1 = getZodiacInfo(moonSign1)?.varna || 'Shudra'
  const varna2 = getZodiacInfo(moonSign2)?.varna || 'Shudra'

  const varnaHierarchy = ['Brahmin', 'Kshatriya', 'Vaishya', 'Shudra']
  const idx1 = varnaHierarchy.indexOf(varna1)
  const idx2 = varnaHierarchy.indexOf(varna2)

  let score = 0
  if (varna1 === varna2) {
    score = 1
  } else if (idx1 <= idx2) {
    score = 1
  }

  return {
    score,
    maxScore: 1,
    person1Varna: varna1,
    person2Varna: varna2,
    description: score === 1 ? 'Compatible social standing' : 'Varna compatibility requires adjustment'
  }
}

function calculateVasya(moonSign1: string, moonSign2: string): GunaScore {
  const vasya1 = getZodiacInfo(moonSign1)?.vasya || 'Human'
  const vasya2 = getZodiacInfo(moonSign2)?.vasya || 'Human'

  let score = 0
  if (vasya1 === vasya2) {
    score = 2
  } else if (
    (vasya1 === 'Human' && vasya2 === 'Quadruped') ||
    (vasya1 === 'Quadruped' && vasya2 === 'Human')
  ) {
    score = 1
  }

  return {
    score,
    maxScore: 2,
    person1Vasya: vasya1,
    person2Vasya: vasya2,
    description: score === 2 ? 'Strong mutual attraction' : score === 1 ? 'Moderate attraction' : 'Limited natural attraction'
  }
}

function calculateTara(nakshatra1: number, nakshatra2: number): GunaScore {
  const diff = Math.abs(nakshatra1 - nakshatra2)
  const count = (diff % 9) + 1

  const favorableTara = [1, 2, 4, 6, 8, 9]
  const score = favorableTara.includes(count) ? 3 : 0

  return {
    score,
    maxScore: 3,
    taraCount: count,
    description: score === 3 ? 'Favorable birth star alignment' : 'Challenging birth star alignment'
  }
}

function calculateYoni(nakshatra1: number, nakshatra2: number): GunaScore {
  const n1 = getNakshatraById(nakshatra1)
  const n2 = getNakshatraById(nakshatra2)
  
  const yoni1 = n1?.yoni || 'Cow'
  const yoni2 = n2?.yoni || 'Cow'

  const score = YONI_PAIRS[yoni1]?.[yoni2] ?? 2

  return {
    score,
    maxScore: 4,
    yoni1,
    yoni2,
    description: score === 4 ? 'Excellent physical and emotional compatibility' : 
                 score >= 2 ? 'Good compatibility' : 'Some challenges in intimacy'
  }
}

function calculateGrahaMaitri(moonSign1: string, moonSign2: string): GunaScore {
  const lord1 = getZodiacInfo(moonSign1)?.lord || 'Moon'
  const lord2 = getZodiacInfo(moonSign2)?.lord || 'Moon'

  let score = 3
  
  if (lord1 === lord2) {
    score = 5
  } else if (PLANETARY_FRIENDS[lord1]?.includes(lord2) && PLANETARY_FRIENDS[lord2]?.includes(lord1)) {
    score = 5
  } else if (PLANETARY_FRIENDS[lord1]?.includes(lord2) || PLANETARY_FRIENDS[lord2]?.includes(lord1)) {
    score = 4
  } else if (PLANETARY_ENEMIES[lord1]?.includes(lord2) && PLANETARY_ENEMIES[lord2]?.includes(lord1)) {
    score = 0
  } else if (PLANETARY_ENEMIES[lord1]?.includes(lord2) || PLANETARY_ENEMIES[lord2]?.includes(lord1)) {
    score = 1
  }

  return {
    score,
    maxScore: 5,
    lord1,
    lord2,
    description: score >= 4 ? 'Harmonious planetary lords' : score >= 2 ? 'Neutral planetary relationship' : 'Challenging planetary lords'
  }
}

function calculateGana(nakshatra1: number, nakshatra2: number): GunaScore {
  const n1 = getNakshatraById(nakshatra1)
  const n2 = getNakshatraById(nakshatra2)
  
  const gana1 = n1?.gana || 'Manushya'
  const gana2 = n2?.gana || 'Manushya'

  const key = `${gana1}-${gana2}`
  const score = GANA_COMPATIBILITY[key] ?? 3

  return {
    score,
    maxScore: 6,
    gana1,
    gana2,
    description: score >= 5 ? 'Compatible temperaments' : score >= 3 ? 'Moderate temperament match' : 'Different temperaments'
  }
}

function calculateBhakut(moonSign1: string, moonSign2: string): GunaScore {
  const idx1 = ZODIAC_LIST.indexOf(moonSign1)
  const idx2 = ZODIAC_LIST.indexOf(moonSign2)

  if (idx1 === -1 || idx2 === -1) {
    return { score: 0, maxScore: 7, description: 'Invalid moon signs' }
  }

  const distance = (idx2 - idx1 + 12) % 12
  
  // Favorable positions: 1, 3, 4, 7, 10, 11 houses from each other
  const favorable = [1, 3, 4, 7, 10, 11]
  const score = favorable.includes(distance) || favorable.includes(12 - distance) ? 7 : 0

  return {
    score,
    maxScore: 7,
    moonSign1,
    moonSign2,
    houseDistance: distance,
    description: score === 7 ? 'Excellent emotional and health compatibility' : 'Bhakut dosha present - may need remedies'
  }
}

function calculateNadi(nakshatra1: number, nakshatra2: number): GunaScore {
  const n1 = getNakshatraById(nakshatra1)
  const n2 = getNakshatraById(nakshatra2)
  
  const nadi1 = n1?.element || 'Vata'
  const nadi2 = n2?.element || 'Vata'

  const key = `${nadi1}-${nadi2}`
  const score = NADI_DOSHA[key] ?? 4

  return {
    score,
    maxScore: 8,
    nadi1,
    nadi2,
    hasNadiDosha: score === 0,
    description: score === 8 ? 'Different Nadis - excellent for progeny and health' : 'Same Nadi - Nadi Dosha present'
  }
}

// ==================== COMPATIBILITY RATING ====================

function getCompatibilityRating(score: number): string {
  if (score >= 32) return 'Excellent Match'
  if (score >= 26) return 'Very Good Match'
  if (score >= 21) return 'Good Match'
  if (score >= 18) return 'Average Match'
  if (score >= 14) return 'Below Average'
  return 'Challenging Match'
}

// ==================== GUNA DESCRIPTIONS ====================
export const GUNA_INFO = {
  varna: {
    name: 'Varna',
    meaning: 'Spiritual Development',
    maxPoints: 1,
    description: 'Measures the spiritual and ego compatibility between partners.'
  },
  vasya: {
    name: 'Vasya',
    meaning: 'Dominance & Control',
    maxPoints: 2,
    description: 'Indicates the degree of magnetic control and attraction between partners.'
  },
  tara: {
    name: 'Tara',
    meaning: 'Birth Star Compatibility',
    maxPoints: 3,
    description: 'Determines destiny and luck compatibility based on birth stars.'
  },
  yoni: {
    name: 'Yoni',
    meaning: 'Physical Compatibility',
    maxPoints: 4,
    description: 'Measures physical, emotional, and sexual compatibility.'
  },
  grahaMaitri: {
    name: 'Graha Maitri',
    meaning: 'Planetary Friendship',
    maxPoints: 5,
    description: 'Indicates mental compatibility and mutual affection based on Moon sign lords.'
  },
  gana: {
    name: 'Gana',
    meaning: 'Temperament',
    maxPoints: 6,
    description: 'Measures the compatibility of temperaments and attitudes.'
  },
  bhakut: {
    name: 'Bhakut',
    meaning: 'Emotional Compatibility',
    maxPoints: 7,
    description: 'Determines emotional compatibility, love, and overall relationship happiness.'
  },
  nadi: {
    name: 'Nadi',
    meaning: 'Health & Genes',
    maxPoints: 8,
    description: 'The most important guna - determines health, genetic compatibility, and progeny.'
  }
}
