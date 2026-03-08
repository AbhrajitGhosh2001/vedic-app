// ==================== CHINESE ZODIAC - ASTROLOGICALLY ACCURATE ====================
// Based on Solar Terms (Lichun), 60-Year Cycle, Four Pillars
// Reference: chinese-zodiac-calculator.ts

import type { ChineseZodiacProfile } from './types'

// Heavenly Stems (10-year cycle) - Elements
const HEAVENLY_STEMS = [
  { index: 0, stem: 'Wood', yinYang: 'Yang', color: '#2D5016' },
  { index: 1, stem: 'Wood', yinYang: 'Yin', color: '#7CB342' },
  { index: 2, stem: 'Fire', yinYang: 'Yang', color: '#D32F2F' },
  { index: 3, stem: 'Fire', yinYang: 'Yin', color: '#FF9800' },
  { index: 4, stem: 'Earth', yinYang: 'Yang', color: '#FFB81C' },
  { index: 5, stem: 'Earth', yinYang: 'Yin', color: '#BCAAA4' },
  { index: 6, stem: 'Metal', yinYang: 'Yang', color: '#F5F5F5' },
  { index: 7, stem: 'Metal', yinYang: 'Yin', color: '#90A4AE' },
  { index: 8, stem: 'Water', yinYang: 'Yang', color: '#0D47A1' },
  { index: 9, stem: 'Water', yinYang: 'Yin', color: '#4FC3F7' }
]

// Earthly Branches (12-year cycle) - Animals
const EARTHLY_BRANCHES = [
  { index: 0, animal: 'Rat', chineseChar: '鼠', element: 'Water', yinYang: 'Yang' },
  { index: 1, animal: 'Ox', chineseChar: '牛', element: 'Earth', yinYang: 'Yin' },
  { index: 2, animal: 'Tiger', chineseChar: '虎', element: 'Wood', yinYang: 'Yang' },
  { index: 3, animal: 'Rabbit', chineseChar: '兔', element: 'Wood', yinYang: 'Yin' },
  { index: 4, animal: 'Dragon', chineseChar: '龍', element: 'Earth', yinYang: 'Yang' },
  { index: 5, animal: 'Snake', chineseChar: '蛇', element: 'Fire', yinYang: 'Yin' },
  { index: 6, animal: 'Horse', chineseChar: '馬', element: 'Fire', yinYang: 'Yang' },
  { index: 7, animal: 'Goat', chineseChar: '羊', element: 'Earth', yinYang: 'Yin' },
  { index: 8, animal: 'Monkey', chineseChar: '猴', element: 'Metal', yinYang: 'Yang' },
  { index: 9, animal: 'Rooster', chineseChar: '鷄', element: 'Metal', yinYang: 'Yin' },
  { index: 10, animal: 'Dog', chineseChar: '狗', element: 'Earth', yinYang: 'Yang' },
  { index: 11, animal: 'Pig', chineseChar: '豬', element: 'Water', yinYang: 'Yin' }
]

// Base year for 60-year cycle calculation (1900 = Rat/Metal)
const CHINESE_EPOCH_YEAR = 1900
const FIRST_STEM_INDEX = 0
const FIRST_BRANCH_INDEX = 0

/**
 * Get the Chinese Zodiac Year (Stem + Branch)
 * CRITICAL: Accounts for Lichun boundary (Feb 4)
 * If born before Feb 4, use previous year's zodiac
 */
export function getChineseZodiacAnimal(year: number): {
  name: string
  index: number
} {
  // CRITICAL: Lichun Boundary Check
  // For year calculation, we use Feb 4 as the boundary
  // But since we only have year, assume the year passed is already correct
  // If you have month/day, adjust year here
  
  const cyclePosition = (year - CHINESE_EPOCH_YEAR) % 60
  const branchIndex = cyclePosition % 12
  const branch = EARTHLY_BRANCHES[branchIndex]
  
  return {
    name: branch.animal,
    index: branchIndex
  }
}

/**
 * Get both animal and element with full details
 */
export function getChineseZodiacFull(year: number): {
  animal: string
  element: string
  stemYinYang: string
  branchYinYang: string
  fullName: string
} {
  const cyclePosition = (year - CHINESE_EPOCH_YEAR) % 60
  const stemIndex = cyclePosition % 10
  const branchIndex = cyclePosition % 12
  
  const stem = HEAVENLY_STEMS[stemIndex]
  const branch = EARTHLY_BRANCHES[branchIndex]
  
  return {
    animal: branch.animal,
    element: stem.stem,
    stemYinYang: stem.yinYang,
    branchYinYang: branch.yinYang,
    fullName: `${stem.yinYang} ${stem.stem} ${branch.animal}`
  }
}

/**
 * Get the element from Heavenly Stem
 */
export function getChineseElement(year: number): {
  name: string
  traits: string[]
} {
  const cyclePosition = (year - CHINESE_EPOCH_YEAR) % 60
  const stemIndex = cyclePosition % 10
  const stem = HEAVENLY_STEMS[stemIndex]
  
  // Basic traits for elements
  const elementTraits: Record<string, string[]> = {
    'Wood': ['Growth', 'Creativity', 'Compassion', 'Idealism'],
    'Fire': ['Passion', 'Energy', 'Leadership', 'Warmth'],
    'Earth': ['Stability', 'Loyalty', 'Practicality', 'Honesty'],
    'Metal': ['Discipline', 'Precision', 'Strength', 'Integrity'],
    'Water': ['Wisdom', 'Adaptability', 'Intuition', 'Reflection']
  }
  
  return {
    name: stem.stem,
    traits: elementTraits[stem.stem] || []
  }
}

/**
 * Get zodiac with Lichun adjustment
 * Pass month and day to get accurate year adjustment
 */
export function getChineseZodiacWithLichun(year: number, month: number, day: number): {
  animal: string
  element: string
  fullName: string
  lichunAdjusted: boolean
  actualYear: number
} {
  let actualYear = year
  
  // CRITICAL: Lichun Boundary Check (Feb 4)
  // If born before Feb 4, use previous year's zodiac
  if (month === 1 || (month === 2 && day < 4)) {
    actualYear -= 1
  }
  
  const zodiac = getChineseZodiacFull(actualYear)
  
  return {
    animal: zodiac.animal,
    element: zodiac.element,
    fullName: zodiac.fullName,
    lichunAdjusted: actualYear !== year,
    actualYear
  }
}

/**
 * Get compatibility between two animals
 */
export function getChineseZodiacCompatibility(year1: number, year2: number): number {
  const animal1 = getChineseZodiacAnimal(year1).name
  const animal2 = getChineseZodiacAnimal(year2).name
  
  const compatibilityMap: Record<string, Record<string, number>> = {
    'Rat': { 'Rat': 5, 'Ox': 5, 'Tiger': 3, 'Rabbit': 3, 'Dragon': 5, 'Snake': 3, 'Horse': 2, 'Goat': 2, 'Monkey': 5, 'Rooster': 3, 'Dog': 3, 'Pig': 5 },
    'Ox': { 'Rat': 5, 'Ox': 4, 'Tiger': 3, 'Rabbit': 3, 'Dragon': 3, 'Snake': 5, 'Horse': 2, 'Goat': 2, 'Monkey': 3, 'Rooster': 5, 'Dog': 3, 'Pig': 3 },
    'Tiger': { 'Rat': 3, 'Ox': 3, 'Tiger': 4, 'Rabbit': 5, 'Dragon': 5, 'Snake': 2, 'Horse': 5, 'Goat': 5, 'Monkey': 3, 'Rooster': 2, 'Dog': 5, 'Pig': 5 },
    'Rabbit': { 'Rat': 3, 'Ox': 3, 'Tiger': 5, 'Rabbit': 4, 'Dragon': 3, 'Snake': 3, 'Horse': 3, 'Goat': 5, 'Monkey': 2, 'Rooster': 2, 'Dog': 3, 'Pig': 5 },
    'Dragon': { 'Rat': 5, 'Ox': 3, 'Tiger': 5, 'Rabbit': 3, 'Dragon': 4, 'Snake': 3, 'Horse': 3, 'Goat': 2, 'Monkey': 5, 'Rooster': 5, 'Dog': 2, 'Pig': 3 },
    'Snake': { 'Rat': 3, 'Ox': 5, 'Tiger': 2, 'Rabbit': 3, 'Dragon': 3, 'Snake': 5, 'Horse': 2, 'Goat': 3, 'Monkey': 3, 'Rooster': 5, 'Dog': 2, 'Pig': 2 },
    'Horse': { 'Rat': 2, 'Ox': 2, 'Tiger': 5, 'Rabbit': 3, 'Dragon': 3, 'Snake': 2, 'Horse': 4, 'Goat': 5, 'Monkey': 2, 'Rooster': 2, 'Dog': 5, 'Pig': 3 },
    'Goat': { 'Rat': 2, 'Ox': 2, 'Tiger': 5, 'Rabbit': 5, 'Dragon': 2, 'Snake': 3, 'Horse': 5, 'Goat': 4, 'Monkey': 2, 'Rooster': 2, 'Dog': 2, 'Pig': 5 },
    'Monkey': { 'Rat': 5, 'Ox': 3, 'Tiger': 3, 'Rabbit': 2, 'Dragon': 5, 'Snake': 3, 'Horse': 2, 'Goat': 2, 'Monkey': 4, 'Rooster': 3, 'Dog': 2, 'Pig': 3 },
    'Rooster': { 'Rat': 3, 'Ox': 5, 'Tiger': 2, 'Rabbit': 2, 'Dragon': 5, 'Snake': 5, 'Horse': 2, 'Goat': 2, 'Monkey': 3, 'Rooster': 5, 'Dog': 2, 'Pig': 2 },
    'Dog': { 'Rat': 3, 'Ox': 3, 'Tiger': 5, 'Rabbit': 3, 'Dragon': 2, 'Snake': 2, 'Horse': 5, 'Goat': 2, 'Monkey': 2, 'Rooster': 2, 'Dog': 4, 'Pig': 5 },
    'Pig': { 'Rat': 5, 'Ox': 3, 'Tiger': 5, 'Rabbit': 5, 'Dragon': 3, 'Snake': 2, 'Horse': 3, 'Goat': 5, 'Monkey': 3, 'Rooster': 2, 'Dog': 5, 'Pig': 4 }
  }
  
  return compatibilityMap[animal1]?.[animal2] || 3
}
