import type { UserProfile } from './types'

// Sample profiles for demo purposes
export const SAMPLE_PROFILES: UserProfile[] = [
  {
    id: 'sample-1',
    name: 'Priya',
    age: 28,
    gender: 'female',
    bio: 'Yoga instructor and meditation enthusiast. I believe in the cosmic connection between souls and the wisdom of the stars.',
    birthData: {
      date: '1996-03-15',
      time: '06:30',
      location: { city: 'Mumbai, India', latitude: 19.076, longitude: 72.8777 }
    },
    vedicChart: {
      sunSign: 'Pisces',
      moonSign: 'Cancer',
      risingSign: 'Aries',
      nakshatra: 8,
      nakshatraName: 'Pushya',
      nakshatraLord: 'Saturn'
    },
    traits: { gana: 'Deva', nadi: 'Kapha', yoni: 'Sheep', varna: 'Brahmin' },
    createdAt: new Date('2024-01-15')
  },
  {
    id: 'sample-2',
    name: 'Arjun',
    age: 30,
    gender: 'male',
    bio: 'Software engineer by day, stargazer by night. Looking for someone who appreciates both logic and magic.',
    birthData: {
      date: '1994-08-22',
      time: '14:15',
      location: { city: 'Delhi, India', latitude: 28.6139, longitude: 77.209 }
    },
    vedicChart: {
      sunSign: 'Leo',
      moonSign: 'Taurus',
      risingSign: 'Scorpio',
      nakshatra: 4,
      nakshatraName: 'Rohini',
      nakshatraLord: 'Moon'
    },
    traits: { gana: 'Manushya', nadi: 'Kapha', yoni: 'Snake', varna: 'Vaishya' },
    createdAt: new Date('2024-01-10')
  },
  {
    id: 'sample-3',
    name: 'Maya',
    age: 26,
    gender: 'female',
    bio: 'Artist and dreamer. My paintings are inspired by cosmic energy and the dance of celestial bodies.',
    birthData: {
      date: '1998-12-03',
      time: '23:45',
      location: { city: 'Bangalore, India', latitude: 12.9716, longitude: 77.5946 }
    },
    vedicChart: {
      sunSign: 'Sagittarius',
      moonSign: 'Pisces',
      risingSign: 'Leo',
      nakshatra: 27,
      nakshatraName: 'Revati',
      nakshatraLord: 'Mercury'
    },
    traits: { gana: 'Deva', nadi: 'Kapha', yoni: 'Elephant', varna: 'Brahmin' },
    createdAt: new Date('2024-01-20')
  },
  {
    id: 'sample-4',
    name: 'Karan',
    age: 32,
    gender: 'male',
    bio: 'Finance professional with a deep interest in Vedic philosophy. Seeking a soulmate for this lifetime and beyond.',
    birthData: {
      date: '1992-05-18',
      time: '09:00',
      location: { city: 'Chennai, India', latitude: 13.0827, longitude: 80.2707 }
    },
    vedicChart: {
      sunSign: 'Taurus',
      moonSign: 'Virgo',
      risingSign: 'Cancer',
      nakshatra: 13,
      nakshatraName: 'Hasta',
      nakshatraLord: 'Moon'
    },
    traits: { gana: 'Deva', nadi: 'Vata', yoni: 'Buffalo', varna: 'Vaishya' },
    createdAt: new Date('2024-01-08')
  },
  {
    id: 'sample-5',
    name: 'Ananya',
    age: 27,
    gender: 'female',
    bio: 'Classical dancer and music lover. I see life as a beautiful choreography written in the stars.',
    birthData: {
      date: '1997-09-28',
      time: '17:30',
      location: { city: 'Kolkata, India', latitude: 22.5726, longitude: 88.3639 }
    },
    vedicChart: {
      sunSign: 'Libra',
      moonSign: 'Scorpio',
      risingSign: 'Aquarius',
      nakshatra: 17,
      nakshatraName: 'Anuradha',
      nakshatraLord: 'Saturn'
    },
    traits: { gana: 'Deva', nadi: 'Vata', yoni: 'Deer', varna: 'Brahmin' },
    createdAt: new Date('2024-01-12')
  },
  {
    id: 'sample-6',
    name: 'Vikram',
    age: 29,
    gender: 'male',
    bio: 'Entrepreneur with a passion for sustainable living. Looking for a partner who shares my vision for a meaningful life.',
    birthData: {
      date: '1995-02-14',
      time: '11:20',
      location: { city: 'Hyderabad, India', latitude: 17.385, longitude: 78.4867 }
    },
    vedicChart: {
      sunSign: 'Aquarius',
      moonSign: 'Aries',
      risingSign: 'Taurus',
      nakshatra: 1,
      nakshatraName: 'Ashwini',
      nakshatraLord: 'Ketu'
    },
    traits: { gana: 'Deva', nadi: 'Pitta', yoni: 'Horse', varna: 'Kshatriya' },
    createdAt: new Date('2024-01-05')
  }
]
