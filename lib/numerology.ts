// Numerology and Letterology calculation utilities

// Letter to number mapping
const letterValues: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 10, K: 11, L: 12, M: 13, N: 14, O: 15, P: 16, Q: 17, R: 18,
  S: 19, T: 20, U: 21, V: 22, W: 23, X: 24, Y: 25, Z: 26
}

const vowels = ['A', 'E', 'I', 'O', 'U']
const masterNumbers = [11, 22, 33, 44]

// Reduce number to single digit (keep master numbers)
function reduceToSingleDigit(num: number): number {
  while (num > 9 && !masterNumbers.includes(num)) {
    num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0)
  }
  return num
}

// Calculate Mool Ank (Birth Day Number) - DAY ONLY
export function calculateMoolAnk(birthDate: string): number {
  const day = parseInt(birthDate.split('-')[2])
  
  // Keep master numbers 11, 22, 29
  if (day === 11 || day === 22 || day === 29) return day
  
  return reduceToSingleDigit(day)
}

// Calculate Life Path Number - FULL DATE
export function calculateLifePath(birthDate: string): number {
  const digits = birthDate.replace(/-/g, '').split('').map(d => parseInt(d))
  const sum = digits.reduce((acc, curr) => acc + curr, 0)
  return reduceToSingleDigit(sum)
}

// Calculate Destiny Number (Expression Number) from full name
export function calculateDestinyNumber(fullName: string): number {
  const letters = fullName.toUpperCase().replace(/[^A-Z]/g, '')
  const sum = letters.split('').reduce((acc, letter) => acc + (letterValues[letter] || 0), 0)
  return reduceToSingleDigit(sum)
}

// Calculate Personality Number (consonants only)
export function calculatePersonalityNumber(fullName: string): number {
  const letters = fullName.toUpperCase().replace(/[^A-Z]/g, '')
  const consonants = letters.split('').filter(l => !vowels.includes(l))
  const sum = consonants.reduce((acc, letter) => acc + (letterValues[letter] || 0), 0)
  return reduceToSingleDigit(sum)
}

// Calculate Soul Urge (vowels only)
export function calculateSoulUrge(fullName: string): number {
  const letters = fullName.toUpperCase().replace(/[^A-Z]/g, '')
  const onlyVowels = letters.split('').filter(l => vowels.includes(l))
  const sum = onlyVowels.reduce((acc, letter) => acc + (letterValues[letter] || 0), 0)
  return reduceToSingleDigit(sum)
}

// Calculate Maturity Number
export function calculateMaturityNumber(moolAnk: number, destinyNumber: number): number {
  return reduceToSingleDigit(moolAnk + destinyNumber)
}

// Calculate Personal Year Number
export function calculatePersonalYear(birthDate: string): number {
  const [year, month, day] = birthDate.split('-').map(n => parseInt(n))
  const currentYear = new Date().getFullYear()
  const digits = `${month}${day}${currentYear}`.split('').map(d => parseInt(d))
  const sum = digits.reduce((acc, curr) => acc + curr, 0)
  return reduceToSingleDigit(sum)
}

// Get first letter meaning (Cornerstone)
export function getCornerstone(firstName: string): string {
  return firstName.toUpperCase().charAt(0)
}

// Get last letter meaning (Capstone)
export function getCapstone(lastName: string): string {
  const name = lastName.toUpperCase()
  return name.charAt(name.length - 1)
}

// Analyze vowel/consonant balance
export function analyzeBalance(fullName: string): { vowels: number; consonants: number; type: string } {
  const letters = fullName.toUpperCase().replace(/[^A-Z]/g, '')
  const vowelCount = letters.split('').filter(l => vowels.includes(l)).length
  const consonantCount = letters.length - vowelCount
  
  let type = 'Balanced'
  if (vowelCount > consonantCount * 1.2) type = 'Vowel-Dominant'
  else if (consonantCount > vowelCount * 1.2) type = 'Consonant-Dominant'
  
  return { vowels: vowelCount, consonants: consonantCount, type }
}

// Get lucky numbers for a number
export function getLuckyNumbers(number: number): number[] {
  return [number, number + 9, number + 18, number + 27, number + 36]
}

// Get lucky days for a number
export function getLuckyDays(number: number): string[] {
  const daysMap: Record<number, string[]> = {
    1: ['Sunday'],
    2: ['Monday'],
    3: ['Thursday'],
    4: ['Saturday'],
    5: ['Wednesday'],
    6: ['Friday'],
    7: ['Monday', 'Wednesday'],
    8: ['Saturday'],
    9: ['Tuesday'],
    11: ['Monday', 'Wednesday'],
    22: ['Saturday'],
    33: ['Friday']
  }
  return daysMap[number] || []
}

// Get lucky colors for a number
export function getLuckyColors(number: number): string[] {
  const colorsMap: Record<number, string[]> = {
    1: ['Gold', 'Orange', 'Yellow'],
    2: ['White', 'Green', 'Silver'],
    3: ['Yellow', 'Purple', 'Gold'],
    4: ['Blue', 'Navy', 'Black'],
    5: ['Silver', 'Green', 'Grey'],
    6: ['Blue', 'Pink', 'Green'],
    7: ['Purple', 'Blue', 'Grey'],
    8: ['Black', 'Grey', 'Brown'],
    9: ['Red', 'Orange', 'Purple'],
    11: ['Silver', 'White', 'Gold'],
    22: ['Coral', 'Brown', 'Gold'],
    33: ['Sea Green', 'Turquoise', 'Gold']
  }
  return colorsMap[number] || []
}

// Number meanings
export const numberMeanings: Record<number, {
  traits: string
  strengths: string
  challenges: string
  career: string
  love: string
}> = {
  1: {
    traits: 'Leadership, Independence, Innovation',
    strengths: 'Pioneer, Determined, Ambitious',
    challenges: 'Stubborn, Arrogant, Lonely',
    career: 'Entrepreneur, CEO, Leader',
    love: 'Dominant, needs independence'
  },
  2: {
    traits: 'Cooperation, Balance, Diplomacy',
    strengths: 'Peacemaker, Sensitive, Intuitive',
    challenges: 'Indecisive, Dependent, Passive',
    career: 'Mediator, Teacher, Counselor',
    love: 'Partnership-focused, loyal'
  },
  3: {
    traits: 'Creativity, Expression, Communication',
    strengths: 'Optimistic, Social, Artistic',
    challenges: 'Scattered, Superficial, Jealous',
    career: 'Artist, Writer, Entertainer',
    love: 'Expressive, playful, romantic'
  },
  4: {
    traits: 'Stability, Structure, Foundation',
    strengths: 'Reliable, Practical, Hardworking',
    challenges: 'Rigid, Stubborn, Narrow-minded',
    career: 'Engineer, Accountant, Builder',
    love: 'Loyal, grounded, committed'
  },
  5: {
    traits: 'Freedom, Change, Adventure',
    strengths: 'Versatile, Curious, Adaptable',
    challenges: 'Restless, Impulsive, Unreliable',
    career: 'Salesman, Pilot, Journalist',
    love: 'Freedom-loving, passionate'
  },
  6: {
    traits: 'Service, Harmony, Responsibility',
    strengths: 'Caring, Nurturing, Balanced',
    challenges: 'Overly responsible, Anxious',
    career: 'Counselor, Nurse, Healer',
    love: 'Family-oriented, devoted'
  },
  7: {
    traits: 'Spirituality, Wisdom, Analysis',
    strengths: 'Introspective, Philosophical, Analytical',
    challenges: 'Withdrawn, Cynical, Isolated',
    career: 'Scientist, Philosopher, Researcher',
    love: 'Deep, mysterious, spiritual'
  },
  8: {
    traits: 'Material Success, Abundance, Power',
    strengths: 'Ambitious, Confident, Strong',
    challenges: 'Greedy, Controlling, Insensitive',
    career: 'Business, Finance, Management',
    love: 'Powerful, passionate, ambitious'
  },
  9: {
    traits: 'Completion, Humanitarianism, Wisdom',
    strengths: 'Compassionate, Intuitive, Wise',
    challenges: 'Overwhelmed, Melancholic, Judgmental',
    career: 'Social worker, Doctor, Activist',
    love: 'Universal love, idealistic'
  },
  11: {
    traits: 'Intuition, Enlightenment, Inspiration',
    strengths: 'Visionary, Spiritual, Idealistic',
    challenges: 'Nervous, Uncertain, Naive',
    career: 'Spiritual leader, Counselor, Teacher',
    love: 'Deeply spiritual connection'
  },
  22: {
    traits: 'Master Builder, Legacy, Manifestation',
    strengths: 'Visionary builder, Powerful, Ambitious',
    challenges: 'Frustrated, Overwhelmed, Arrogant',
    career: 'Major projects, Legacy builder, Architect',
    love: 'Transformative relationships'
  },
  33: {
    traits: 'Master Teacher, Guidance, Blessing',
    strengths: 'Compassionate, Nurturing, Healer',
    challenges: 'Over-giving, Sacrificing, Manipulative',
    career: 'Teacher, Healer, Mentor',
    love: 'Deeply devoted, unconditional'
  }
}

// Cornerstone meanings
export const cornerstoneMeanings: Record<string, string> = {
  A: 'Leadership, ambitious, independent, pioneering',
  B: 'Sensitive, diplomatic, cooperative, balanced',
  C: 'Creative, communicative, expressive, social',
  D: 'Practical, grounded, dependable, organized',
  E: 'Versatile, free-spirited, adaptable, curious',
  F: 'Loving, nurturing, responsible, caring',
  G: 'Spiritual, analytical, introspective, mysterious',
  H: 'Ambitious, confident, determined, powerful',
  I: 'Intuitive, sensitive, idealistic, artistic',
  J: 'Jovial, inventive, curious, unconventional',
  K: 'Independent, capable, determined, leader',
  L: 'Logical, analytical, truthful, honest',
  M: 'Organized, maternal, nurturing, responsible',
  N: 'Intuitive, creative, adaptable, expressive',
  O: 'Magnetic, charismatic, influential, confident',
  P: 'Perceptive, spiritual, observant, idealistic',
  Q: 'Quiet, introspective, philosophical, mystical',
  R: 'Responsible, realistic, honest, authentic',
  S: 'Sensitive, artistic, spiritual, emotional',
  T: 'Truthful, analytical, thoughtful, methodical',
  U: 'Understanding, universal, humanitarian',
  V: 'Visionary, idealistic, creative, sensitive',
  W: 'Practical, grounded, responsible, strong-willed',
  X: 'Mysterious, adventurous, unconventional',
  Y: 'Adventurous, curious, adaptable, artistic',
  Z: 'Unconventional, independent, innovative'
}

// Capstone meanings
export const capstoneMeanings: Record<string, string> = {
  A: 'Ambitious finisher, keeps going until complete',
  B: 'Sensitive closer, needs emotional resolution',
  C: 'Creative finisher, brings elegance to endings',
  D: 'Practical completer, sees things through',
  E: 'Adaptable finisher, flexible with outcomes',
  F: 'Loyal finisher, nurturing to the end',
  G: 'Spiritual completer, seeks deeper meaning',
  H: 'Power finisher, needs authority in conclusions',
  I: 'Idealistic finisher, seeks perfection',
  J: 'Ingenious finisher, finds unique solutions',
  K: 'Independent completer, strong closure',
  L: 'Logical finisher, analytical about endings',
  M: 'Responsible finisher, caring completion',
  N: 'Intuitive finisher, instinctive closure',
  O: 'Confident finisher, powerful completion',
  P: 'Perceptive finisher, intuitive ending',
  Q: 'Quiet finisher, mysterious closure',
  R: 'Realistic finisher, honest completion',
  S: 'Sensitive finisher, emotional closure',
  T: 'Thorough finisher, detailed completion',
  U: 'Universal finisher, humanitarian closure',
  V: 'Visionary finisher, idealistic completion',
  W: 'Willful finisher, strong-willed closure',
  X: 'Unconventional finisher, unique endings',
  Y: 'Adventurous finisher, explores conclusions',
  Z: 'Innovative finisher, original completion'
}
