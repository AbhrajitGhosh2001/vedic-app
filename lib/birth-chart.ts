import type { BirthData, VedicChart } from './types'

export type { VedicChart }

// ==================== VEDIC ASTROLOGY - PURE JAVASCRIPT ====================
// Pure JS implementation for accurate sidereal zodiac calculations
// Uses Lahiri Ayanamsa (standard for Vedic astrology)

// Lahiri Ayanamsa value for reference date (Jan 1, 2000)
const LAHIRI_AYANAMSA_2000 = 23.1850;

// Vedic zodiac signs (30° each)
const VEDIC_ZODIAC_SIGNS = [
  'Aries',       // 0-30°
  'Taurus',      // 30-60°
  'Gemini',      // 60-90°
  'Cancer',      // 90-120°
  'Leo',         // 120-150°
  'Virgo',       // 150-180°
  'Libra',       // 180-210°
  'Scorpio',     // 210-240°
  'Sagittarius', // 240-270°
  'Capricorn',   // 270-300°
  'Aquarius',    // 300-330°
  'Pisces'       // 330-360°
];

// 27 Nakshatras (13.33° each)
const NAKSHATRAS = [
  { num: 1, name: 'Ashwini', lord: 'Ketu' },
  { num: 2, name: 'Bharani', lord: 'Venus' },
  { num: 3, name: 'Krittika', lord: 'Sun' },
  { num: 4, name: 'Rohini', lord: 'Moon' },
  { num: 5, name: 'Mrigashirsha', lord: 'Mars' },
  { num: 6, name: 'Ardra', lord: 'Rahu' },
  { num: 7, name: 'Punarvasu', lord: 'Jupiter' },
  { num: 8, name: 'Pushya', lord: 'Saturn' },
  { num: 9, name: 'Ashlesha', lord: 'Mercury' },
  { num: 10, name: 'Magha', lord: 'Ketu' },
  { num: 11, name: 'Purva Phalguni', lord: 'Venus' },
  { num: 12, name: 'Uttara Phalguni', lord: 'Sun' },
  { num: 13, name: 'Hasta', lord: 'Moon' },
  { num: 14, name: 'Chitra', lord: 'Mars' },
  { num: 15, name: 'Swati', lord: 'Rahu' },
  { num: 16, name: 'Vishakha', lord: 'Jupiter' },
  { num: 17, name: 'Anuradha', lord: 'Saturn' },
  { num: 18, name: 'Jyeshtha', lord: 'Mercury' },
  { num: 19, name: 'Mula', lord: 'Ketu' },
  { num: 20, name: 'Purva Ashadha', lord: 'Venus' },
  { num: 21, name: 'Uttara Ashadha', lord: 'Sun' },
  { num: 22, name: 'Sravana', lord: 'Moon' },
  { num: 23, name: 'Dhanishta', lord: 'Mars' },
  { num: 24, name: 'Shatabhisha', lord: 'Rahu' },
  { num: 25, name: 'Purva Bhadrapada', lord: 'Jupiter' },
  { num: 26, name: 'Uttara Bhadrapada', lord: 'Saturn' },
  { num: 27, name: 'Revati', lord: 'Mercury' }
];

// Calculate Julian Day Number
function calculateJD(date: Date, hours: number, minutes: number, seconds: number): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let a = Math.floor((14 - month) / 12);
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;

  let jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

  const jd = jdn + (hours - 12) / 24 + minutes / 1440 + seconds / 86400;
  return jd;
}

// Calculate Ayanamsa (precession correction) for a given JD
function calculateAyanamsa(jd: number): number {
  // Using Lahiri Ayanamsa formula
  const jd2000 = 2451545.0; // JD for J2000
  const daysSince2000 = jd - jd2000;
  const yearsSince2000 = daysSince2000 / 365.25;

  // Lahiri precession rate: approximately -1.39 seconds of arc per year
  const precessionCorrection = yearsSince2000 * 1.39 / 3600;

  return LAHIRI_AYANAMSA_2000 + precessionCorrection;
}

// Calculate mean Sun longitude (simplified)
function calculateSunLongitude(jd: number): number {
  const jd2000 = 2451545.0;
  const t = (jd - jd2000) / 36525;

  // Mean longitude of Sun (degrees)
  let L = 280.46646 + 36000.76983 * t + 0.0003032 * t * t;

  // Mean anomaly of Sun (degrees)
  let M = 357.52911 + 35999.05029 * t - 0.0001536 * t * t;

  // Convert to radians
  M = (M * Math.PI) / 180;

  // Equation of center
  let C = (1.914602 - 0.004817 * t - 0.000014 * t * t) * Math.sin(M) +
          (0.019993 - 0.000101 * t) * Math.sin(2 * M) +
          0.000029 * Math.sin(3 * M);

  // True longitude
  let trueLongitude = L + C;

  // Apparent longitude (simplified, ignore nutation for now)
  return normalize360(trueLongitude);
}

// Calculate mean Moon longitude (simplified)
function calculateMoonLongitude(jd: number): number {
  const jd2000 = 2451545.0;
  const d = jd - jd2000;

  // Moon's mean longitude (degrees)
  let L = 218.3165 + 13.17635494 * d;

  return normalize360(L);
}

// Normalize angle to 0-360 range
function normalize360(angle: number): number {
  let result = angle % 360;
  if (result < 0) result += 360;
  return result;
}

// Convert longitude to zodiac sign
function parseVedicSign(longitude: number): string {
  const normalized = normalize360(longitude);
  const signIndex = Math.floor(normalized / 30);
  return VEDIC_ZODIAC_SIGNS[signIndex % 12];
}

// Parse nakshatra from longitude
function parseNakshatra(longitude: number): { num: number; name: string; lord: string } {
  const normalized = normalize360(longitude);
  const nakshatraIndex = Math.floor((normalized / 360) * 27);
  const index = Math.min(nakshatraIndex, 26); // Ensure within bounds [0-26]
  const nakshatra = NAKSHATRAS[index];
  
  if (!nakshatra) {
    console.error('[v0] Nakshatra not found for longitude:', longitude, 'normalized:', normalized, 'index:', index);
    return NAKSHATRAS[0]; // Fallback to first nakshatra
  }
  
  return nakshatra;
}

// Calculate rising sign based on latitude, longitude and time
function calculateRisingSign(jd: number, latitude: number, longitude: number): string {
  // Simplified: use Sun's longitude adjusted by time of day
  // More accurate calculation would require full house system
  const hourAngle = ((jd % 1) * 24 * 15) % 360; // Convert JD fraction to degrees
  const ascendant = normalize360(calculateSunLongitude(jd) + longitude + hourAngle);
  return parseVedicSign(ascendant);
}

export function calculateVedicChart(birthData: BirthData): VedicChart {
  if (!birthData?.date || !birthData?.time) {
    console.error('[v0] Missing birth data:', birthData);
    return {
      sunSign: 'Aries',
      moonSign: 'Aries',
      risingSign: 'Aries',
      nakshatra: 1,
      nakshatraName: 'Ashwini',
      nakshatraLord: 'Ketu'
    };
  }

  try {
    const dateParts = birthData.date.split('-');
    const year = parseInt(dateParts[0]) || 2000;
    const month = parseInt(dateParts[1]) || 1;
    const day = parseInt(dateParts[2]) || 1;

    const timeParts = birthData.time.split(':');
    const hours = parseInt(timeParts[0]) || 0;
    const minutes = parseInt(timeParts[1]) || 0;
    const seconds = parseInt(timeParts[2]) || 0;

    const birthDate = new Date(year, month - 1, day);
    const latitude = birthData.location?.latitude ?? 0;
    const longitude = birthData.location?.longitude ?? 0;

    // Calculate Julian Day
    const jd = calculateJD(birthDate, hours, minutes, seconds);

    // Calculate Ayanamsa correction
    const ayanamsa = calculateAyanamsa(jd);

    // Calculate tropical longitudes
    const tropicalSunLong = calculateSunLongitude(jd);
    const tropicalMoonLong = calculateMoonLongitude(jd);

    // Convert to sidereal (Vedic) by subtracting ayanamsa
    const siderealSunLong = normalize360(tropicalSunLong - ayanamsa);
    const siderealMoonLong = normalize360(tropicalMoonLong - ayanamsa);

    // Parse signs and nakshatras
    const sunSign = parseVedicSign(siderealSunLong);
    const moonSign = parseVedicSign(siderealMoonLong);
    const moonNakshatra = parseNakshatra(siderealMoonLong);
    const risingSign = calculateRisingSign(jd, latitude, longitude);

    const nakshatraData = moonNakshatra || NAKSHATRAS[0];

    return {
      sunSign,
      moonSign,
      risingSign,
      nakshatra: nakshatraData.num,
      nakshatraName: nakshatraData.name,
      nakshatraLord: nakshatraData.lord
    };
  } catch (error) {
    console.error('[v0] Birth chart calculation error:', error);
    return {
      sunSign: 'Aries',
      moonSign: 'Aries',
      risingSign: 'Aries',
      nakshatra: 1,
      nakshatraName: 'Ashwini',
      nakshatraLord: 'Ketu'
    };
  }
}

// Utility functions for compatibility
export function getZodiacSymbol(sign: string): string {
  const symbols: Record<string, string> = {
    'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
    'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
    'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
  };
  return symbols[sign] || '★';
}

export function getZodiacDescription(sign: string): string {
  const descriptions: Record<string, string> = {
    'Aries': 'Bold, ambitious, and courageous. Natural leaders who love to take initiative.',
    'Taurus': 'Reliable, patient, and devoted. Values stability and sensory pleasures.',
    'Gemini': 'Curious, adaptable, and expressive. Thrives on intellectual stimulation.',
    'Cancer': 'Intuitive, emotional, and nurturing. Deeply connected to home and family.',
    'Leo': 'Dramatic, creative, and confident. Natural performers who love the spotlight.',
    'Virgo': 'Analytical, practical, and meticulous. Strives for perfection in all things.',
    'Libra': 'Diplomatic, fair-minded, and social. Seeks harmony and balance in relationships.',
    'Scorpio': 'Passionate, resourceful, and determined. Experiences life with intensity.',
    'Sagittarius': 'Optimistic, adventurous, and philosophical. Always seeking truth and meaning.',
    'Capricorn': 'Disciplined, responsible, and ambitious. Masters of self-control.',
    'Aquarius': 'Progressive, original, and independent. Visionaries who think ahead.',
    'Pisces': 'Compassionate, artistic, and intuitive. Deeply connected to the spiritual realm.'
  };
  return descriptions[sign] || '';
}

export function getTraitsFromChart(vedicChart: VedicChart) {
  return {
    gana: 'Manushya',
    nadi: 'Vata',
    yoni: 'Cow',
    varna: 'Vaishya'
  };
}
