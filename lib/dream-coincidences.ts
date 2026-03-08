/**
 * 22 Dream Coincidences Engine
 * Maps dream keywords to archetypal coincidences across
 * astrological traditions, elements, and cosmic atmospheres.
 */

export interface DreamCoincidence {
  id: number
  name: string
  keywords: string[]
  element: 'Fire' | 'Earth' | 'Air' | 'Water' | 'Ether'
  atmosphere: string
  cosmicLink: string
  zodiacGlyph: string
  tradition: string
  color: string
  interpretation: string
}

export const DREAM_COINCIDENCES: DreamCoincidence[] = [
  {
    id: 1,
    name: 'The Burning Gate',
    keywords: ['fire', 'burn', 'flame', 'heat', 'volcano', 'lava', 'torch', 'candle', 'inferno', 'blaze'],
    element: 'Fire',
    atmosphere: 'A scorching threshold where the dreamer must pass through purifying fire to reach transformation.',
    cosmicLink: 'Mars conjunct Aries ascendant',
    zodiacGlyph: '\u2648',
    tradition: 'Western',
    color: '#e74c3c',
    interpretation: 'Your dream speaks of radical transformation. The burning gate is an ancient symbol of the soul crossing from one state of being to another. Fire in dreams strips away the false self, leaving only essential truth. This coincidence suggests you are at a major life threshold requiring courage.'
  },
  {
    id: 2,
    name: 'The Silver Mirror',
    keywords: ['mirror', 'reflection', 'glass', 'silver', 'face', 'double', 'twin', 'self', 'image', 'vanity'],
    element: 'Water',
    atmosphere: 'A still lunar pool reflects not appearance, but the hidden face of the unconscious mind.',
    cosmicLink: 'Moon in Cancer, 4th house',
    zodiacGlyph: '\u264B',
    tradition: 'Hellenistic',
    color: '#bdc3c7',
    interpretation: 'The silver mirror reveals what you have been avoiding in waking life. Reflections in dreams are the Moon showing you your shadow self. This coincidence indicates a period of deep introspection is needed. Trust what the mirror reveals, even if it is uncomfortable.'
  },
  {
    id: 3,
    name: 'The Serpent Path',
    keywords: ['snake', 'serpent', 'cobra', 'viper', 'slither', 'scales', 'kundalini', 'coil', 'python', 'asp'],
    element: 'Earth',
    atmosphere: 'A winding path through dense undergrowth where a great serpent guards hidden wisdom.',
    cosmicLink: 'Rahu in Ashlesha nakshatra',
    zodiacGlyph: '\u264F',
    tradition: 'Indian (Vedic)',
    color: '#27ae60',
    interpretation: 'The serpent is one of the most ancient dream symbols, representing kundalini energy, hidden knowledge, and the cycle of death and rebirth. This coincidence signals that dormant wisdom is awakening within you. Pay attention to what the serpent guards or reveals.'
  },
  {
    id: 4,
    name: 'The Ocean Descent',
    keywords: ['ocean', 'sea', 'water', 'dive', 'drown', 'swim', 'wave', 'deep', 'underwater', 'tide', 'flood'],
    element: 'Water',
    atmosphere: 'An infinite ocean stretching beyond sight, drawing the dreamer into its luminous depths.',
    cosmicLink: 'Neptune in Pisces, 12th house',
    zodiacGlyph: '\u2653',
    tradition: 'Mesopotamian',
    color: '#2980b9',
    interpretation: 'Descending into the ocean represents plunging into the collective unconscious. The depth you reach reflects how far you are willing to explore your emotional truth. This coincidence indicates powerful psychic sensitivity and a need to honor your intuitive gifts.'
  },
  {
    id: 5,
    name: 'The Stone Tower',
    keywords: ['tower', 'castle', 'building', 'tall', 'climb', 'fortress', 'wall', 'prison', 'ruin', 'collapse'],
    element: 'Earth',
    atmosphere: 'A towering structure of ancient stone, reaching into storm clouds, struck by silent lightning.',
    cosmicLink: 'Saturn in Capricorn, 10th house',
    zodiacGlyph: '\u2651',
    tradition: 'Western',
    color: '#7f8c8d',
    interpretation: 'Towers in dreams represent the structures you have built in life: career, identity, beliefs. A crumbling tower signals necessary destruction of what no longer serves you. A strong tower indicates solid foundations. This coincidence ties to Saturn lessons about patience and authentic ambition.'
  },
  {
    id: 6,
    name: 'The Celestial Bird',
    keywords: ['bird', 'fly', 'flying', 'eagle', 'hawk', 'crow', 'raven', 'feather', 'wing', 'nest', 'owl'],
    element: 'Air',
    atmosphere: 'A magnificent bird soars above the flat earth disc, tracing patterns among the zodiac constellations.',
    cosmicLink: 'Mercury in Gemini, 3rd house',
    zodiacGlyph: '\u264A',
    tradition: 'Egyptian',
    color: '#f39c12',
    interpretation: 'Birds are messengers between the earthly and celestial realms. The type of bird matters: eagles signal ambition, owls signal hidden wisdom, crows signal transformation. This coincidence indicates important messages are trying to reach you through signs and synchronicities.'
  },
  {
    id: 7,
    name: 'The Golden Seed',
    keywords: ['seed', 'plant', 'grow', 'garden', 'tree', 'root', 'flower', 'bloom', 'harvest', 'fruit', 'leaf'],
    element: 'Earth',
    atmosphere: 'A luminous seed buried in dark soil, glowing with potential, roots reaching toward the earth core.',
    cosmicLink: 'Venus in Taurus, 2nd house',
    zodiacGlyph: '\u2649',
    tradition: 'Celtic',
    color: '#f1c40f',
    interpretation: 'The golden seed represents latent potential waiting to manifest. Gardens in dreams reflect the state of your inner life. Lush growth indicates thriving creativity; barren soil suggests neglected talents. This coincidence urges you to nurture what you have planted and be patient with its timing.'
  },
  {
    id: 8,
    name: 'The Ancestor Hall',
    keywords: ['ancestor', 'grandparent', 'dead', 'death', 'ghost', 'spirit', 'funeral', 'grave', 'tomb', 'passed', 'skeleton'],
    element: 'Ether',
    atmosphere: 'A vast hall lit by eternal flames where the ancestors sit in silent council, waiting to be heard.',
    cosmicLink: 'Ketu in Mula nakshatra',
    zodiacGlyph: '\u2650',
    tradition: 'African (Dogon)',
    color: '#8e44ad',
    interpretation: 'Meeting ancestors in dreams is among the most sacred coincidences. The ancestors offer guidance that transcends individual experience. This coincidence indicates unresolved family patterns or inherited gifts seeking expression. Listen carefully to any words or gestures offered.'
  },
  {
    id: 9,
    name: 'The Shifting Ground',
    keywords: ['earthquake', 'ground', 'shake', 'fall', 'falling', 'crack', 'unstable', 'abyss', 'cliff', 'pit'],
    element: 'Earth',
    atmosphere: 'The earth beneath splits open, revealing crystalline caverns and rivers of light beneath the surface.',
    cosmicLink: 'Uranus in Taurus',
    zodiacGlyph: '\u2649',
    tradition: 'Mayan',
    color: '#d35400',
    interpretation: 'Unstable ground in dreams reflects foundational uncertainty in waking life. Falling dreams specifically indicate a loss of control or fear of failure. This coincidence signals that the ground must shake before new foundations can be laid. Embrace the instability as a necessary precursor to growth.'
  },
  {
    id: 10,
    name: 'The Crystal Cave',
    keywords: ['crystal', 'cave', 'gem', 'diamond', 'jewel', 'treasure', 'underground', 'mine', 'sparkle', 'quartz'],
    element: 'Earth',
    atmosphere: 'A hidden cavern deep within the earth disc, its walls blazing with a thousand crystal facets.',
    cosmicLink: 'Pluto in Scorpio, 8th house',
    zodiacGlyph: '\u264F',
    tradition: 'Tibetan',
    color: '#1abc9c',
    interpretation: 'Crystals and gems in dreams represent compressed wisdom and the treasures of the deep self. The cave is the womb of the earth, a place of rebirth. This coincidence suggests valuable insights are hidden in what you consider your darkest experiences.'
  },
  {
    id: 11,
    name: 'The Chariot of Stars',
    keywords: ['star', 'stars', 'sky', 'night', 'cosmos', 'galaxy', 'constellation', 'space', 'planet', 'asteroid', 'comet', 'meteor'],
    element: 'Ether',
    atmosphere: 'A chariot of woven starlight travels across the celestial dome, drawn by invisible cosmic forces.',
    cosmicLink: 'Jupiter in Sagittarius, 9th house',
    zodiacGlyph: '\u2650',
    tradition: 'Persian',
    color: '#3498db',
    interpretation: 'Traveling among the stars indicates an expansion of consciousness beyond ordinary limits. This coincidence aligns with Jupiter energy: philosophical growth, long journeys, and encounters with higher truth. Your soul is reaching for something greater than daily life can contain.'
  },
  {
    id: 12,
    name: 'The Maze of Voices',
    keywords: ['maze', 'labyrinth', 'lost', 'confused', 'voice', 'whisper', 'echo', 'shout', 'speak', 'call', 'sound'],
    element: 'Air',
    atmosphere: 'An ever-shifting labyrinth where invisible voices offer contradictory guidance at every turn.',
    cosmicLink: 'Mercury retrograde in 12th house',
    zodiacGlyph: '\u264D',
    tradition: 'Hellenistic',
    color: '#9b59b6',
    interpretation: 'Mazes and labyrinths reflect mental confusion or being overwhelmed by too many choices. Voices represent different aspects of your psyche competing for attention. This coincidence suggests stepping back from external noise and finding the single thread of inner truth that will guide you out.'
  },
  {
    id: 13,
    name: 'The Wounded Healer',
    keywords: ['wound', 'blood', 'hurt', 'pain', 'doctor', 'hospital', 'heal', 'medicine', 'sick', 'illness', 'injury', 'surgery'],
    element: 'Water',
    atmosphere: 'A figure bearing a glowing wound walks through a field of medicinal herbs under a compassionate moon.',
    cosmicLink: 'Chiron in Pisces',
    zodiacGlyph: '\u2653',
    tradition: 'Western',
    color: '#e67e22',
    interpretation: 'Wounds in dreams point to where your deepest healing gifts reside. The archetype of the Wounded Healer teaches that your most painful experiences become your greatest wisdom. This coincidence indicates a calling to help others through what you yourself have endured.'
  },
  {
    id: 14,
    name: 'The Iron Throne',
    keywords: ['king', 'queen', 'crown', 'throne', 'power', 'ruler', 'authority', 'command', 'reign', 'royal', 'palace'],
    element: 'Fire',
    atmosphere: 'A throne forged from celestial iron sits at the center of a great hall, radiating sovereign authority.',
    cosmicLink: 'Sun in Leo, 5th house',
    zodiacGlyph: '\u264C',
    tradition: 'Egyptian',
    color: '#c0392b',
    interpretation: 'Thrones and crowns in dreams speak to your relationship with personal power and authority. Sitting on the throne means you are ready to claim your sovereignty. Seeing someone else on it may indicate giving your power away. This coincidence urges you to own your leadership gifts.'
  },
  {
    id: 15,
    name: 'The Floating Temple',
    keywords: ['temple', 'church', 'mosque', 'shrine', 'prayer', 'worship', 'sacred', 'holy', 'ritual', 'altar', 'meditation'],
    element: 'Ether',
    atmosphere: 'A luminous temple floats above the earth disc, accessible only through focused intention and devotion.',
    cosmicLink: 'Jupiter in Pisces, 12th house',
    zodiacGlyph: '\u2653',
    tradition: 'Indian (Vedic)',
    color: '#f0e68c',
    interpretation: 'Sacred spaces in dreams represent your connection to the divine or to your highest self. A floating temple suggests spiritual aspirations that transcend material concerns. This coincidence indicates a deepening of spiritual practice and the opening of transcendent awareness.'
  },
  {
    id: 16,
    name: 'The Shadow Twin',
    keywords: ['shadow', 'dark', 'darkness', 'chase', 'run', 'flee', 'pursuer', 'stalker', 'follow', 'escape', 'hide'],
    element: 'Water',
    atmosphere: 'A dark figure follows the dreamer through twilight realms, always matching step for step, never quite catching.',
    cosmicLink: 'Pluto opposite Sun',
    zodiacGlyph: '\u264E',
    tradition: 'Hellenistic',
    color: '#2c3e50',
    interpretation: 'The shadow twin is the disowned part of yourself that appears when you refuse to acknowledge it consciously. Being chased in dreams is the most common dream theme, reflecting avoidance of difficult emotions or truths. This coincidence says: stop running. What you flee holds your power.'
  },
  {
    id: 17,
    name: 'The Desert Crossing',
    keywords: ['desert', 'sand', 'dry', 'thirst', 'hot', 'sun', 'oasis', 'camel', 'barren', 'empty', 'wasteland'],
    element: 'Fire',
    atmosphere: 'An endless desert under a blazing sun, where mirages shimmer and the only path forward is through.',
    cosmicLink: 'Mars in Aries, 1st house',
    zodiacGlyph: '\u2648',
    tradition: 'Islamic',
    color: '#e8b960',
    interpretation: 'Desert dreams speak of spiritual testing and the stripping away of all comfort. The desert forces you to discover what you truly need versus what you merely want. This coincidence indicates a period of voluntary or involuntary simplification that will reveal your essential nature.'
  },
  {
    id: 18,
    name: 'The River Crossing',
    keywords: ['river', 'bridge', 'cross', 'boat', 'stream', 'current', 'flow', 'bank', 'shore', 'raft', 'ferry'],
    element: 'Water',
    atmosphere: 'A great river divides two lands. A ferryboat waits at the shore under a canopy of weeping willows.',
    cosmicLink: 'Moon in Scorpio, 8th house',
    zodiacGlyph: '\u264F',
    tradition: 'Chinese',
    color: '#16a085',
    interpretation: 'Rivers in dreams represent the flow of life, emotions, and time. Crossing a river signifies a major life transition. The condition of the water tells you about your emotional state during this change. This coincidence marks a point of no return; once crossed, you cannot go back.'
  },
  {
    id: 19,
    name: 'The Weaving Loom',
    keywords: ['weave', 'thread', 'cloth', 'fabric', 'tapestry', 'sew', 'needle', 'string', 'knot', 'pattern', 'web', 'spider'],
    element: 'Air',
    atmosphere: 'An immense loom stretches across the sky, its threads made of fate-lines connecting all living beings.',
    cosmicLink: 'North Node in Gemini',
    zodiacGlyph: '\u264A',
    tradition: 'Celtic',
    color: '#a569bd',
    interpretation: 'The loom represents fate, destiny, and the interconnection of all events. Threads are the relationships and choices that weave the fabric of your life. This coincidence reminds you that every small decision creates the pattern of your larger destiny. You are both weaver and the woven.'
  },
  {
    id: 20,
    name: 'The Frozen Lake',
    keywords: ['ice', 'frozen', 'cold', 'snow', 'winter', 'freeze', 'glacier', 'frost', 'numb', 'chill', 'blizzard'],
    element: 'Water',
    atmosphere: 'A vast lake sealed under thick ice, its surface reflecting the aurora borealis in shimmering curtains.',
    cosmicLink: 'Saturn in Aquarius, 11th house',
    zodiacGlyph: '\u2652',
    tradition: 'Tibetan',
    color: '#85c1e9',
    interpretation: 'Ice and frozen landscapes represent emotions that have been suppressed or locked away. The frozen lake holds deep feeling beneath its surface, waiting for the thaw. This coincidence suggests that emotional warmth and vulnerability are needed to break through a period of isolation or numbness.'
  },
  {
    id: 21,
    name: 'The Naked Assembly',
    keywords: ['naked', 'nude', 'exposed', 'embarrass', 'shame', 'vulnerable', 'clothes', 'undress', 'public', 'stage', 'audience'],
    element: 'Air',
    atmosphere: 'Standing bare before a vast audience seated on concentric rings, all watching with inscrutable expressions.',
    cosmicLink: 'Venus in Libra, 7th house',
    zodiacGlyph: '\u264E',
    tradition: 'Western',
    color: '#f5b7b1',
    interpretation: 'Nakedness dreams reflect vulnerability, fear of judgment, or the desire to be seen as you truly are. The audience represents society or specific people whose opinion you value. This coincidence suggests it is time to show your authentic self, even at the risk of judgment. Authenticity is your liberation.'
  },
  {
    id: 22,
    name: 'The Cosmic Egg',
    keywords: ['egg', 'birth', 'baby', 'child', 'pregnant', 'create', 'new', 'begin', 'start', 'dawn', 'morning', 'sunrise', 'light'],
    element: 'Ether',
    atmosphere: 'A luminous egg floats at the center of the cosmos, cracking open to release spirals of creation light.',
    cosmicLink: 'Sun conjunct Moon (New Moon)',
    zodiacGlyph: '\u264B',
    tradition: 'Indian (Vedic)',
    color: '#fdebd0',
    interpretation: 'The cosmic egg is the primordial symbol of creation, containing all possibility within its shell. Birth and beginnings in dreams herald new chapters, creative projects, or spiritual rebirth. This coincidence signals that something entirely new is gestating within you. Give it time and protection.'
  }
]

/**
 * Matches dream text against the 22 coincidences.
 * Returns all matching coincidences sorted by relevance (number of keyword hits).
 */
export function interpretDream(dreamText: string): { coincidence: DreamCoincidence; hits: number }[] {
  const lower = dreamText.toLowerCase()
  const words = lower.split(/\W+/).filter(Boolean)

  const results: { coincidence: DreamCoincidence; hits: number }[] = []

  for (const c of DREAM_COINCIDENCES) {
    let hits = 0
    for (const kw of c.keywords) {
      // Check both full-text contains and individual word matches
      if (lower.includes(kw)) {
        hits++
      } else {
        // Check if any word starts with the keyword (partial match)
        for (const w of words) {
          if (w.startsWith(kw) || kw.startsWith(w)) {
            hits += 0.5
            break
          }
        }
      }
    }
    if (hits > 0) {
      results.push({ coincidence: c, hits })
    }
  }

  results.sort((a, b) => b.hits - a.hits)
  return results
}

/** Returns the 12 zodiac glyphs positioned around a circle */
export const ZODIAC_RING = [
  { glyph: '\u2648', name: 'Aries', angle: 0 },
  { glyph: '\u2649', name: 'Taurus', angle: 30 },
  { glyph: '\u264A', name: 'Gemini', angle: 60 },
  { glyph: '\u264B', name: 'Cancer', angle: 90 },
  { glyph: '\u264C', name: 'Leo', angle: 120 },
  { glyph: '\u264D', name: 'Virgo', angle: 150 },
  { glyph: '\u264E', name: 'Libra', angle: 180 },
  { glyph: '\u264F', name: 'Scorpio', angle: 210 },
  { glyph: '\u2650', name: 'Sagittarius', angle: 240 },
  { glyph: '\u2651', name: 'Capricorn', angle: 270 },
  { glyph: '\u2652', name: 'Aquarius', angle: 300 },
  { glyph: '\u2653', name: 'Pisces', angle: 330 },
]

/** Maps elements to colours */
export const ELEMENT_COLORS: Record<string, string> = {
  Fire: '#e74c3c',
  Earth: '#27ae60',
  Air: '#3498db',
  Water: '#2980b9',
  Ether: '#8e44ad',
}

/** Maps traditions to ring indices (0 = innermost) */
export const TRADITION_RINGS: Record<string, number> = {
  'Western': 0,
  'Hellenistic': 1,
  'Indian (Vedic)': 2,
  'Egyptian': 3,
  'Chinese': 4,
  'Persian': 5,
  'Islamic': 6,
  'Celtic': 7,
  'Mayan': 8,
  'African (Dogon)': 9,
  'Tibetan': 10,
  'Mesopotamian': 11,
}
