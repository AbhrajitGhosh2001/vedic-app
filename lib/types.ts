export interface BirthData {
  date: string // YYYY-MM-DD
  time: string // HH:MM
  location: {
    city: string
    latitude: number
    longitude: number
  }
}

export interface VedicChart {
  sunSign: string
  moonSign: string
  risingSign: string
  nakshatra: number
  nakshatraName: string
  nakshatraLord: string
}

export interface UserProfile {
  id: string
  first_name: string
  last_name?: string
  bio?: string
  profile_image_url?: string
  age?: number
  gender?: 'male' | 'female' | 'other'
  birth_date?: string
  birth_time?: string
  birth_location?: string
  birth_location_lat?: number
  birth_location_lng?: number
  sun_sign?: string
  moon_sign?: string
  rising_sign?: string
  nakshatra?: number
  nakshatra_name?: string
  gana?: string
  nadi?: string
  yoni?: string
  varna?: string
  chinese_zodiac_animal?: string
  chinese_zodiac_element?: string
  birth_year?: number
  created_at?: string
  updated_at?: string
}

export interface MatchRecord {
  id: string
  user1Id: string
  user2Id: string
  compatibility: {
    totalScore: number
    maxScore: number
    percentage: number
    compatibility: string
    breakdown: Record<string, unknown>
  }
  calculatedAt: Date
  shareToken?: string
}
