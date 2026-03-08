// Nakshatra and Lagna calculations with traditional meanings

// Normalize degrees to [0, 360)
function norm360(d: number): number {
  return ((d % 360) + 360) % 360;
}

function toJulianDay(year: number, month: number, day: number, hour = 0, minute = 0, second = 0): number {
  const Y = month <= 2 ? year - 1 : year;
  const M = month <= 2 ? month + 12 : month;
  const ut = hour + minute / 60 + second / 3600;
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + day + ut / 24 + B - 1524.5;
}

function lahiriAyanamsha(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  return 23.85 + 0.013611 * T;
}

function gmst(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  return norm360(280.46061837 + 360.98564736629 * (jd - 2451545) + 0.000387933 * T * T - T * T * T / 38710000);
}

function lst(jd: number, lonDeg: number): number {
  return norm360(gmst(jd) + lonDeg);
}

function ascendantTropical(lstDeg: number, latDeg: number): number {
  const e = 23.4397 * (Math.PI / 180);
  const theta = lstDeg * (Math.PI / 180);
  const phi = latDeg * (Math.PI / 180);
  const y = -Math.cos(theta);
  const x = Math.sin(theta) * Math.cos(e) + Math.tan(phi) * Math.sin(e);
  let asc = Math.atan2(y, x) * (180 / Math.PI);
  return lstDeg >= 0 && lstDeg < 180 ? norm360(asc + 180) : norm360(asc);
}

function moonTropicalLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T + T * T * T / 538841 - T * T * T * T / 65194000;
  const M1 = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T + T * T * T / 69699 - T * T * T * T / 14712000;
  const M  = 357.5291092 + 35999.0502909 * T - 0.0001536 * T * T + T * T * T / 24490000;
  const F  = 93.2720950 + 483202.0175233 * T - 0.0036539 * T * T - T * T * T / 3526000 + T * T * T * T / 863310000;
  const D  = 297.8501921 + 445267.1114034 * T - 0.0018819 * T * T + T * T * T / 545868 - T * T * T * T / 113065000;
  const r = Math.PI / 180;
  const lon =
    6.288774 * Math.sin(M1*r) + 1.274027 * Math.sin((2*D-M1)*r) +
    0.658314 * Math.sin(2*D*r) + 0.213618 * Math.sin(2*M1*r) -
    0.185116 * Math.sin(M*r)  - 0.114332 * Math.sin(2*F*r) +
    0.058793 * Math.sin((2*D-2*M1)*r) + 0.057066 * Math.sin((2*D-M-M1)*r) +
    0.053322 * Math.sin((2*D+M1)*r)   + 0.045758 * Math.sin((2*D-M)*r) -
    0.040923 * Math.sin((M-M1)*r)     - 0.034720 * Math.sin(D*r) -
    0.030383 * Math.sin((M+M1)*r)     + 0.015327 * Math.sin((2*D-2*F)*r) -
    0.012528 * Math.sin((M1+2*F)*r)   + 0.010980 * Math.sin((M1-2*F)*r) +
    0.010675 * Math.sin((4*D-M1)*r)   + 0.010034 * Math.sin(3*M1*r) +
    0.008548 * Math.sin((4*D-2*M1)*r) - 0.007888 * Math.sin((2*D+M-M1)*r) -
    0.006766 * Math.sin((2*D+M)*r);
  return norm360(L + lon);
}

export interface NakshatraData {
  name: string;
  lord: string;
  symbol: string;
  quality: string;
  meaning: string;
}

export interface RashiData {
  english: string;
  meaning: string;
}

export interface NakshatraResult {
  name: string;
  pada: number;
  lord: string;
  symbol: string;
  quality: string;
  meaning: string;
  rashi: string;
  rashiEnglish: string;
  rashiMeaning: string;
  sidereal: number;
  degInRashi: number;
}

const NAKSHATRA_DATA: NakshatraData[] = [
  { name: "Ashwini",            lord: "Ketu",    symbol: "Horse's head",       quality: "Swift, pioneering",   meaning: "Born healers and initiators. Quick-minded, adventurous, and blessed with vitality. Natural leaders who start things with great enthusiasm." },
  { name: "Bharani",            lord: "Venus",   symbol: "Yoni",               quality: "Fierce, transforming", meaning: "Carry the weight of creation and destruction. Disciplined, determined, and deeply truthful. Struggle and perseverance lead to greatness." },
  { name: "Krittika",           lord: "Sun",     symbol: "Flame / Razor",      quality: "Sharp, purifying",    meaning: "Sharp intellect and fierce willpower. Natural commanders who cut through illusion. Deeply principled with a burning drive for achievement." },
  { name: "Rohini",             lord: "Moon",    symbol: "Chariot / Ox cart",  quality: "Fertile, sensual",    meaning: "Deeply magnetic and creative. Lovers of beauty, nature, and comfort. Highly fertile minds that manifest desires into material reality." },
  { name: "Mrigashira",         lord: "Mars",    symbol: "Deer's head",        quality: "Searching, gentle",   meaning: "Eternally searching souls — curious, restless, and sensitive. Gifted communicators who seek beauty and truth in all things." },
  { name: "Ardra",              lord: "Rahu",    symbol: "Teardrop / Diamond", quality: "Stormy, transforming", meaning: "Born in the eye of the storm. Intense, intellectual, and emotionally raw. Destruction paves the way for profound renewal." },
  { name: "Punarvasu",          lord: "Jupiter", symbol: "Quiver of arrows",   quality: "Renewing, optimistic", meaning: "Return and renewal. Optimistic, philosophical, and deeply resilient — they bounce back from adversity with grace and wisdom." },
  { name: "Pushya",             lord: "Saturn",  symbol: "Cow's udder / Lotus", quality: "Nourishing, spiritual", meaning: "The most auspicious nakshatra. Deeply nurturing, disciplined, and spiritually inclined. Natural caretakers and community pillars." },
  { name: "Ashlesha",           lord: "Mercury", symbol: "Coiled serpent",     quality: "Penetrating, mystical", meaning: "Serpentine wisdom and sharp perception. Deeply intuitive and psychologically penetrating. Must guard against manipulation." },
  { name: "Magha",              lord: "Ketu",    symbol: "Royal throne",       quality: "Regal, ancestral",    meaning: "Born to lead. Connected to ancestors and past lives. Dignified, ambitious, and commanding — natural royalty in any setting." },
  { name: "Purva Phalguni",     lord: "Venus",   symbol: "Front legs of a bed", quality: "Pleasurable, creative", meaning: "Lovers of life, art, and romance. Charismatic and creative with a gift for enjoyment. Thrive in leisure, beauty, and performance." },
  { name: "Uttara Phalguni",    lord: "Sun",     symbol: "Back legs of a bed", quality: "Generous, purposeful", meaning: "Unions and service. Warm, generous, and socially gifted. Excel in partnerships and find purpose through helping others." },
  { name: "Hasta",              lord: "Moon",    symbol: "Open hand",          quality: "Skillful, witty",     meaning: "Clever hands and quick minds. Highly skilled, industrious, and resourceful. Masters of craft, healing, and subtle persuasion." },
  { name: "Chitra",             lord: "Mars",    symbol: "Bright jewel / Pearl", quality: "Artistic, dynamic",  meaning: "Brilliant architects of form and beauty. Charismatic, perfectionistic, and visually gifted. See the cosmos as a work of art." },
  { name: "Swati",              lord: "Rahu",    symbol: "Coral / Sword / Sprout", quality: "Independent, flexible", meaning: "The wind — free, adaptable, and self-sufficient. Excel in trade and diplomacy. Seek independence above all else." },
  { name: "Vishakha",           lord: "Jupiter", symbol: "Archway / Potter's wheel", quality: "Goal-oriented, intense", meaning: "Relentless goal-seekers. Intense focus, ambition, and the patience to wait for the right moment to strike." },
  { name: "Anuradha",           lord: "Saturn",  symbol: "Lotus / Staff",      quality: "Devoted, organized",  meaning: "Deep capacity for friendship and devotion. Organized, disciplined, and spiritually sensitive. Thrive through loyalty and cooperation." },
  { name: "Jyeshtha",           lord: "Mercury", symbol: "Circular amulet / Umbrella", quality: "Protective, elder", meaning: "The chief among stars. Protective, responsible, and often burdened by leadership. Immense inner power earned through suffering." },
  { name: "Mula",               lord: "Ketu",    symbol: "Tied roots / Lion's tail", quality: "Investigative, rootless", meaning: "Seekers of ultimate truth. Dig to the very root of existence — often dismantling what no longer serves to find what is real." },
  { name: "Purva Ashadha",      lord: "Venus",   symbol: "Elephant tusk / Fan", quality: "Invincible, proud",  meaning: "Undefeated and proud. Persuasive, energetic, and philosophically bold. Carry an invisible shield of early victory." },
  { name: "Uttara Ashadha",     lord: "Sun",     symbol: "Elephant tusk / Plank", quality: "Virtuous, universal", meaning: "Final and universal victory — achieved through virtue, not force. Patient, principled, and deeply ethical leaders." },
  { name: "Shravana",           lord: "Moon",    symbol: "Ear / Three footprints", quality: "Listening, learned", meaning: "Born listeners and learners. Deeply connected to sound, knowledge, and tradition. Excel as teachers, counselors, and scholars." },
  { name: "Dhanishtha",         lord: "Mars",    symbol: "Drum / Flute",       quality: "Wealthy, musical",    meaning: "Abundant and rhythmic. Attuned to cosmic rhythm and deeply social. Wealth and fame come through group endeavors and music." },
  { name: "Shatabhisha",        lord: "Rahu",    symbol: "Empty circle / 1000 stars", quality: "Healing, solitary", meaning: "The healer of a hundred physicians. Solitary, mysterious, and deeply scientific. Drawn to hidden knowledge and alternative healing." },
  { name: "Purva Bhadrapada",   lord: "Jupiter", symbol: "Sword / Front of funeral cot", quality: "Fiery, transforming", meaning: "Fierce idealists willing to sacrifice everything for a higher cause. Passionate, eccentric, and capable of radical transformation." },
  { name: "Uttara Bhadrapada",  lord: "Saturn",  symbol: "Back of funeral cot / Twins", quality: "Wise, restrained", meaning: "The serpent of wisdom. Deeply calm, compassionate, and spiritually mature. Often achieve great wisdom through renunciation." },
  { name: "Revati",             lord: "Mercury", symbol: "Fish / Drum",        quality: "Nourishing, completing", meaning: "The final journey home. Deeply compassionate, creative, and spiritually gifted. Natural guides who help others cross safely." },
];

const RASHI_DATA: Record<string, RashiData> = {
  "Mesha":     { english: "Aries",       meaning: "Courageous, impulsive, and pioneering. A fire sign ruled by Mars — assertive, competitive, and born to lead." },
  "Vrishabha": { english: "Taurus",      meaning: "Patient, sensual, and deeply grounded. Ruled by Venus — lovers of beauty, stability, and material comfort." },
  "Mithuna":   { english: "Gemini",      meaning: "Curious, communicative, and adaptable. Ruled by Mercury — quick-witted, dual-natured, and socially gifted." },
  "Karka":     { english: "Cancer",      meaning: "Nurturing, emotional, and intuitive. Ruled by the Moon — deeply empathetic, home-oriented, and protective." },
  "Simha":     { english: "Leo",         meaning: "Confident, creative, and regal. Ruled by the Sun — natural performers who command attention and inspire loyalty." },
  "Kanya":     { english: "Virgo",       meaning: "Analytical, discerning, and service-oriented. Ruled by Mercury — detail-focused perfectionists with healing gifts." },
  "Tula":      { english: "Libra",       meaning: "Harmonious, diplomatic, and beauty-seeking. Ruled by Venus — natural mediators who thrive in partnership." },
  "Vrischika": { english: "Scorpio",     meaning: "Intense, transformative, and psychically attuned. Ruled by Mars/Ketu — deeply probing and magnetically powerful." },
  "Dhanu":     { english: "Sagittarius", meaning: "Philosophical, expansive, and truth-seeking. Ruled by Jupiter — optimistic adventurers and natural teachers." },
  "Makara":    { english: "Capricorn",   meaning: "Disciplined, ambitious, and pragmatic. Ruled by Saturn — patient builders who achieve through sustained effort." },
  "Kumbha":    { english: "Aquarius",    meaning: "Innovative, humanitarian, and unconventional. Ruled by Saturn/Rahu — visionary reformers ahead of their time." },
  "Meena":     { english: "Pisces",      meaning: "Compassionate, dreamy, and spiritually open. Ruled by Jupiter/Ketu — deeply empathetic souls with psychic sensitivity." },
};

const RASHIS = ["Mesha","Vrishabha","Mithuna","Karka","Simha","Kanya","Tula","Vrischika","Dhanu","Makara","Kumbha","Meena"];

function getNakshatra(tropicalLon: number, ayanamsha: number): NakshatraResult {
  const sidereal = norm360(tropicalLon - ayanamsha);
  const nIdx = Math.floor(sidereal / (360 / 27));
  const pada = Math.floor((sidereal % (360 / 27)) / (360 / 108)) + 1;
  const rashiIdx = Math.floor(sidereal / 30);
  const rashi = RASHIS[rashiIdx];
  const nakshatraInfo = NAKSHATRA_DATA[nIdx];
  const rashiInfo = RASHI_DATA[rashi] || { english: "Unknown", meaning: "" };
  
  return {
    name: nakshatraInfo.name,
    pada,
    lord: nakshatraInfo.lord,
    symbol: nakshatraInfo.symbol,
    quality: nakshatraInfo.quality,
    meaning: nakshatraInfo.meaning,
    rashi,
    rashiEnglish: rashiInfo.english,
    rashiMeaning: rashiInfo.meaning,
    sidereal,
    degInRashi: sidereal % 30,
  };
}

export function calculateLagnaAndMoonNakshatra(birthData: {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  lat: number;
  lon: number;
  utcOffset: number;
}): {
  jd: number;
  ayanamsha: number;
  lagna: NakshatraResult;
  moon: NakshatraResult;
} {
  const utcHour = birthData.hour - birthData.utcOffset;
  const jd = toJulianDay(birthData.year, birthData.month, birthData.day, utcHour, birthData.minute, birthData.second);
  const ayanamsha = lahiriAyanamsha(jd);
  const localST = lst(jd, birthData.lon);
  const ascTropical = ascendantTropical(localST, birthData.lat);
  const lagna = getNakshatra(ascTropical, ayanamsha);
  const moonTropical = moonTropicalLongitude(jd);
  const moon = getNakshatra(moonTropical, ayanamsha);
  
  return { jd, ayanamsha, lagna, moon };
}
