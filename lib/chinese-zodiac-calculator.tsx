// ==================== CHINESE ZODIAC - ASTROLOGICALLY PERFECT ====================
// Based on Solar Terms (Lichun), 60-Year Cycle, Four Pillars
// For React v0 + Supabase Integration

import React, { useState, useCallback } from 'react';

// ==================== CONSTANTS ====================

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
];

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
];

// Solar Terms - Month starts on these dates (Lichun = Feb 4)
// This defines when each lunar month begins in the Western calendar
const SOLAR_TERMS = [
  { month: 1, name: 'Xiaohan', date: 5, earthlyBranch: 'Rat' }, // Small Cold - Jan 5
  { month: 2, name: 'Lichun', date: 4, earthlyBranch: 'Tiger' }, // Start of Spring - Feb 4 ⭐ CRITICAL
  { month: 3, name: 'Jingzhe', date: 5, earthlyBranch: 'Rabbit' }, // Awakening of Insects - Mar 5
  { month: 4, name: 'Qingming', date: 4, earthlyBranch: 'Dragon' }, // Pure Brightness - Apr 4
  { month: 5, name: 'Lixia', date: 5, earthlyBranch: 'Snake' }, // Start of Summer - May 5
  { month: 6, name: 'Mangzhong', date: 5, earthlyBranch: 'Horse' }, // Grain in Ear - Jun 5
  { month: 7, name: 'Xiaoshu', date: 6, earthlyBranch: 'Goat' }, // Small Heat - Jul 6
  { month: 8, name: 'Liqiu', date: 7, earthlyBranch: 'Monkey' }, // Start of Autumn - Aug 7
  { month: 9, name: 'Bailu', date: 7, earthlyBranch: 'Rooster' }, // White Dew - Sep 7
  { month: 10, name: 'Lidong', date: 7, earthlyBranch: 'Dog' }, // Start of Winter - Oct 7
  { month: 11, name: 'Xiaoxue', date: 7, earthlyBranch: 'Pig' }, // Small Snow - Nov 7
  { month: 12, name: 'Dongzhi', date: 21, earthlyBranch: 'Rat' } // Winter Solstice - Dec 21
];

// Base year for 60-year cycle calculation (1900 = Rat/Metal)
const CHINESE_EPOCH_YEAR = 1900;
const FIRST_STEM_INDEX = 0; // 1900 was Metal (index 0)
const FIRST_BRANCH_INDEX = 0; // 1900 was Rat (index 0)

// ==================== HELPER FUNCTIONS ====================

/**
 * Determine the Chinese Lunar Month based on Solar Terms
 * The month changes on the Solar Term date, not the Western calendar month
 */
function getLunarMonthFromDate(date: Date): {
  lunarMonth: number;
  solarTermName: string;
  boundaryDate: Date;
} {
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();

  // Find the solar term for the current month
  const currentTermIndex = month - 1;
  const currentTerm = SOLAR_TERMS[currentTermIndex];
  const nextTermIndex = (currentTermIndex + 1) % 12;
  const nextTerm = SOLAR_TERMS[nextTermIndex];

  // Check if we've crossed the solar term boundary for the current month
  if (day >= currentTerm.date) {
    // We're in the month of the current term
    return {
      lunarMonth: currentTermIndex + 1,
      solarTermName: currentTerm.name,
      boundaryDate: new Date(date.getFullYear(), currentTerm.date - 1)
    };
  } else {
    // We're still in the previous month
    const prevTermIndex = (currentTermIndex - 1 + 12) % 12;
    const prevTerm = SOLAR_TERMS[prevTermIndex];
    return {
      lunarMonth: prevTermIndex + 1,
      solarTermName: prevTerm.name,
      boundaryDate: new Date(date.getFullYear(), prevTerm.date - 1)
    };
  }
}

/**
 * Get the Chinese Zodiac Year (Stem + Branch)
 * Accounts for Lichun boundary: If born before Feb 4, use previous year's zodiac
 */
function getChineseYearPillar(date: Date): {
  yearNumber: number;
  chineseYear: string;
  heavenlyStem: typeof HEAVENLY_STEMS[0];
  earthlyBranch: typeof EARTHLY_BRANCHES[0];
  fullName: string;
  description: string;
} {
  let year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // CRITICAL: Lichun Boundary Check
  // If before Feb 4 (Solar Term), use previous Chinese year
  if (month === 1 || (month === 2 && day < 4)) {
    year -= 1;
  }

  // Calculate position in 60-year cycle
  const cyclePosition = (year - CHINESE_EPOCH_YEAR) % 60;
  const stemIndex = cyclePosition % 10;
  const branchIndex = cyclePosition % 12;

  const stem = HEAVENLY_STEMS[stemIndex];
  const branch = EARTHLY_BRANCHES[branchIndex];

  return {
    yearNumber: year,
    chineseYear: `${year} (${cyclePosition + 1}/60)`,
    heavenlyStem: stem,
    earthlyBranch: branch,
    fullName: `${stem.stem} ${branch.animal}`,
    description: `You are a ${stem.yinYang} ${stem.stem} ${branch.animal}`
  };
}

/**
 * Get the Chinese Zodiac Month (based on Solar Terms)
 * The month pillar shows which lunar month the person was born in
 */
function getChineseMonthPillar(date: Date): {
  lunarMonth: number;
  solarTermName: string;
  heavenlyStem: typeof HEAVENLY_STEMS[0];
  earthlyBranch: typeof EARTHLY_BRANCHES[0];
  fullName: string;
  boundaryDate: Date;
} {
  const lunarData = getLunarMonthFromDate(date);
  
  // The month pillar stem follows a pattern based on the year's stem
  // This requires knowing the year's stem first
  const year = date.getFullYear();
  let actualYear = year;
  
  // Adjust for Lichun boundary
  if (date.getMonth() + 1 === 1 || (date.getMonth() + 1 === 2 && date.getDate() < 4)) {
    actualYear -= 1;
  }

  const yearCyclePosition = (actualYear - CHINESE_EPOCH_YEAR) % 60;
  const yearStemIndex = yearCyclePosition % 10;

  // Month stem follows a fixed pattern:
  // Rat month (1) is determined by: (yearStem * 2 + lunarMonth) % 10
  // This is based on the Jia-Zi system
  const monthStemOffset = (yearStemIndex * 2 + (lunarData.lunarMonth - 1)) % 10;
  const monthStemIndex = monthStemOffset;
  
  const monthBranchIndex = (lunarData.lunarMonth - 1) % 12;

  const stem = HEAVENLY_STEMS[monthStemIndex];
  const branch = EARTHLY_BRANCHES[monthBranchIndex];

  return {
    lunarMonth: lunarData.lunarMonth,
    solarTermName: lunarData.solarTermName,
    heavenlyStem: stem,
    earthlyBranch: branch,
    fullName: `${stem.stem} ${branch.animal}`,
    boundaryDate: lunarData.boundaryDate
  };
}

/**
 * Get the full Four Pillars (Year, Month, Day, Hour)
 * For this component, we focus on Year and Month
 * Day and Hour require more complex calculations
 */
interface FourPillarsResult {
  year: ReturnType<typeof getChineseYearPillar>;
  month: ReturnType<typeof getChineseMonthPillar>;
  zodiacProfile: {
    fullName: string;
    element: string;
    animal: string;
    yinYang: string;
    compatibility: string;
  };
}

function getFourPillars(isoDateString: string): FourPillarsResult {
  const date = new Date(isoDateString);

  const yearPillar = getChineseYearPillar(date);
  const monthPillar = getChineseMonthPillar(date);

  // Create comprehensive zodiac profile
  const zodiacProfile = {
    fullName: yearPillar.fullName,
    element: yearPillar.heavenlyStem.stem,
    animal: yearPillar.earthlyBranch.animal,
    yinYang: `${yearPillar.heavenlyStem.yinYang} ${yearPillar.earthlyBranch.yinYang}`,
    compatibility: getZodiacCompatibility(yearPillar.earthlyBranch.animal)
  };

  return {
    year: yearPillar,
    month: monthPillar,
    zodiacProfile
  };
}

/**
 * Get zodiac compatibility information
 */
function getZodiacCompatibility(animal: string): string {
  const compatibilityMap: Record<string, string> = {
    'Rat': 'Compatible with: Ox, Dragon, Monkey | Avoid: Horse, Sheep, Rooster',
    'Ox': 'Compatible with: Rat, Snake, Rooster | Avoid: Sheep, Horse, Dog',
    'Tiger': 'Compatible with: Rabbit, Horse, Dog, Pig | Avoid: Monkey, Snake, Rooster',
    'Rabbit': 'Compatible with: Goat, Pig, Dog | Avoid: Rooster, Snake, Dragon',
    'Dragon': 'Compatible with: Rat, Monkey, Rooster | Avoid: Dog, Ox, Rabbit',
    'Snake': 'Compatible with: Ox, Rooster, Monkey | Avoid: Tiger, Pig, Dog',
    'Horse': 'Compatible with: Tiger, Goat, Dog | Avoid: Rat, Ox, Rabbit',
    'Goat': 'Compatible with: Rabbit, Horse, Pig | Avoid: Ox, Dog, Tiger',
    'Monkey': 'Compatible with: Rat, Dragon, Snake | Avoid: Tiger, Snake, Pig',
    'Rooster': 'Compatible with: Ox, Snake, Dragon | Avoid: Rabbit, Dog, Rooster',
    'Dog': 'Compatible with: Tiger, Rabbit, Horse | Avoid: Dragon, Goat, Rooster',
    'Pig': 'Compatible with: Rabbit, Goat, Tiger | Avoid: Snake, Monkey, Rooster'
  };

  return compatibilityMap[animal] || 'Compatibility data unavailable';
}

// ==================== REACT COMPONENT ====================

interface ChineseZodiacData {
  birthDate: string;
  yearPillar: FourPillarsResult['year'];
  monthPillar: FourPillarsResult['month'];
  zodiacProfile: FourPillarsResult['zodiacProfile'];
  rawData: FourPillarsResult;
}

export default function ChineseZodiacCalculator() {
  const [birthDate, setBirthDate] = useState<string>('');
  const [zodiacData, setZodiacData] = useState<ChineseZodiacData | null>(null);
  const [error, setError] = useState<string>('');

  const handleCalculate = useCallback(() => {
    try {
      if (!birthDate) {
        setError('Please select a birth date');
        return;
      }

      const result = getFourPillars(birthDate);

      setZodiacData({
        birthDate,
        yearPillar: result.year,
        monthPillar: result.month,
        zodiacProfile: result.zodiacProfile,
        rawData: result
      });

      setError('');
    } catch (err) {
      setError('Invalid date. Please use YYYY-MM-DD format.');
      setZodiacData(null);
    }
  }, [birthDate]);

  // Prepare data for Supabase
  const getSupabasePayload = () => {
    if (!zodiacData) return null;

    return {
      birth_date: zodiacData.birthDate,
      chinese_zodiac_animal: zodiacData.zodiacProfile.animal,
      chinese_zodiac_element: zodiacData.zodiacProfile.element,
      year_pillar_stem: zodiacData.yearPillar.heavenlyStem.stem,
      year_pillar_branch: zodiacData.yearPillar.earthlyBranch.animal,
      month_pillar_stem: zodiacData.monthPillar.heavenlyStem.stem,
      month_pillar_branch: zodiacData.monthPillar.earthlyBranch.animal,
      zodiac_full_name: zodiacData.zodiacProfile.fullName,
      zodiac_yin_yang: zodiacData.zodiacProfile.yinYang,
      zodiac_compatibility: zodiacData.zodiacProfile.compatibility,
      lichun_adjusted: zodiacData.yearPillar.yearNumber !== new Date(zodiacData.birthDate).getFullYear(),
      lunar_month: zodiacData.monthPillar.lunarMonth,
      solar_term: zodiacData.monthPillar.solarTermName
    };
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '30px', borderRadius: '12px', marginBottom: '30px' }}>
        <h1 style={{ margin: '0 0 10px 0' }}>🐉 Chinese Zodiac Calculator 🐉</h1>
        <p style={{ margin: '0', opacity: 0.9 }}>Astrologically Perfect • Lichun Boundary • 60-Year Cycle</p>
      </div>

      <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
        <h3>Enter Your Birth Date</h3>
        <p style={{ fontSize: '14px', color: '#666' }}>⭐ Important: Zodiac changes on Feb 4 (Lichun). If born before this date, you belong to the previous year's zodiac.</p>
        
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            border: '2px solid #667eea',
            borderRadius: '6px',
            marginBottom: '15px'
          }}
        />

        <button
          onClick={handleCalculate}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Calculate My Zodiac
        </button>

        {error && <div style={{ color: '#d32f2f', marginTop: '10px', padding: '10px', background: '#ffebee', borderRadius: '6px' }}>{error}</div>}
      </div>

      {zodiacData && (
        <div style={{ background: 'white', border: '2px solid #667eea', borderRadius: '10px', padding: '20px' }}>
          <h2 style={{ color: '#667eea', marginTop: '0' }}>Your Chinese Zodiac Profile</h2>

          {/* Year Pillar */}
          <div style={{ background: '#f0f0f0', padding: '15px', borderRadius: '8px', marginBottom: '20px', borderLeft: '4px solid #667eea' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#667eea' }}>🌟 Year Pillar</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>Heavenly Stem</p>
                <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold', color: zodiacData.yearPillar.heavenlyStem.color }}>
                  {zodiacData.yearPillar.heavenlyStem.yinYang} {zodiacData.yearPillar.heavenlyStem.stem}
                </p>
              </div>
              <div>
                <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>Earthly Branch</p>
                <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold' }}>
                  {zodiacData.yearPillar.earthlyBranch.animal} {zodiacData.yearPillar.earthlyBranch.chineseChar}
                </p>
              </div>
            </div>
            <p style={{ margin: '15px 0 0 0', padding: '10px', background: 'white', borderRadius: '6px', fontSize: '14px' }}>
              <strong>Full Name:</strong> {zodiacData.yearPillar.fullName}
            </p>
            <p style={{ margin: '10px 0 0 0', padding: '10px', background: 'white', borderRadius: '6px', fontSize: '14px' }}>
              <strong>Chinese Year:</strong> {zodiacData.yearPillar.chineseYear}
            </p>
            {zodiacData.yearPillar.yearNumber !== new Date(zodiacData.birthDate).getFullYear() && (
              <p style={{ margin: '10px 0 0 0', padding: '10px', background: '#fff3cd', borderRadius: '6px', fontSize: '13px', color: '#856404' }}>
                ⭐ <strong>Lichun Adjustment:</strong> You were born before Feb 4, so you belong to the {zodiacData.yearPillar.yearNumber} zodiac year, not {new Date(zodiacData.birthDate).getFullYear()}.
              </p>
            )}
          </div>

          {/* Month Pillar */}
          <div style={{ background: '#f0f0f0', padding: '15px', borderRadius: '8px', marginBottom: '20px', borderLeft: '4px solid #764ba2' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#764ba2' }}>📅 Month Pillar</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>Heavenly Stem</p>
                <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold', color: zodiacData.monthPillar.heavenlyStem.color }}>
                  {zodiacData.monthPillar.heavenlyStem.yinYang} {zodiacData.monthPillar.heavenlyStem.stem}
                </p>
              </div>
              <div>
                <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>Earthly Branch</p>
                <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold' }}>
                  {zodiacData.monthPillar.earthlyBranch.animal} {zodiacData.monthPillar.earthlyBranch.chineseChar}
                </p>
              </div>
            </div>
            <p style={{ margin: '15px 0 0 0', padding: '10px', background: 'white', borderRadius: '6px', fontSize: '14px' }}>
              <strong>Lunar Month:</strong> Month {zodiacData.monthPillar.lunarMonth}
            </p>
            <p style={{ margin: '10px 0 0 0', padding: '10px', background: 'white', borderRadius: '6px', fontSize: '14px' }}>
              <strong>Solar Term:</strong> {zodiacData.monthPillar.solarTermName}
            </p>
          </div>

          {/* Zodiac Profile */}
          <div style={{ background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#667eea' }}>🌐 Your Zodiac Identity</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ padding: '10px', background: 'white', borderRadius: '6px' }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>Full Name</p>
                <p style={{ margin: '0', fontSize: '16px', fontWeight: 'bold' }}>{zodiacData.zodiacProfile.fullName}</p>
              </div>
              <div style={{ padding: '10px', background: 'white', borderRadius: '6px' }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>Element</p>
                <p style={{ margin: '0', fontSize: '16px', fontWeight: 'bold' }}>{zodiacData.zodiacProfile.element}</p>
              </div>
              <div style={{ padding: '10px', background: 'white', borderRadius: '6px' }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>Animal</p>
                <p style={{ margin: '0', fontSize: '16px', fontWeight: 'bold' }}>{zodiacData.zodiacProfile.animal}</p>
              </div>
              <div style={{ padding: '10px', background: 'white', borderRadius: '6px' }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>Yin/Yang</p>
                <p style={{ margin: '0', fontSize: '16px', fontWeight: 'bold' }}>{zodiacData.zodiacProfile.yinYang}</p>
              </div>
            </div>
            <div style={{ marginTop: '15px', padding: '10px', background: 'white', borderRadius: '6px' }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>Compatibility</p>
              <p style={{ margin: '0', fontSize: '13px', lineHeight: '1.6' }}>{zodiacData.zodiacProfile.compatibility}</p>
            </div>
          </div>

          {/* Supabase Integration */}
          <div style={{ background: '#e8f5e9', padding: '15px', borderRadius: '8px', marginBottom: '20px', borderLeft: '4px solid #4caf50' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#2e7d32' }}>💾 Supabase Payload</h3>
            <pre style={{
              background: 'white',
              padding: '10px',
              borderRadius: '6px',
              fontSize: '12px',
              overflow: 'auto',
              maxHeight: '300px'
            }}>
              {JSON.stringify(getSupabasePayload(), null, 2)}
            </pre>
            <button
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(getSupabasePayload(), null, 2));
                alert('Payload copied to clipboard!');
              }}
              style={{
                marginTop: '10px',
                padding: '8px 15px',
                background: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Copy Payload
            </button>
          </div>

          {/* Raw Data (for debugging) */}
          <details style={{ background: '#f5f5f5', padding: '15px', borderRadius: '8px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold', color: '#667eea' }}>📊 Raw Data (Debug)</summary>
            <pre style={{
              background: 'white',
              padding: '10px',
              borderRadius: '6px',
              fontSize: '11px',
              marginTop: '10px',
              overflow: 'auto',
              maxHeight: '250px'
            }}>
              {JSON.stringify(zodiacData.rawData, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}

// ==================== EXPORT FOR EXTERNAL USE ====================

export {
  getFourPillars,
  getChineseYearPillar,
  getChineseMonthPillar,
  getLunarMonthFromDate,
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  SOLAR_TERMS
};
