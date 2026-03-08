// ==================== ENHANCED CHINESE ZODIAC COMPLETE SYSTEM ====================
// With full detailed profiles including lucky/unlucky things, compatibility explanations,
// career recommendations, health advice, and famous people

export interface EnhancedChineseAnimal {
  name: string
  emoji: string
  years: number[]
  personality: string
  traits: string[]
  strengths?: string[]
  weaknesses?: string[]
  
  // Lucky and Unlucky Things
  luckyNumbers: number[]
  luckyColors: string[]
  luckyDirections: string[]
  luckyFlowers: string[]
  luckyMonths: string[]
  unluckyNumbers: number[]
  unluckyColors: string[]
  unluckyDirections: string[]
  luckyGems: string[]
  benMingNian: string
  
  // Love & Compatibility
  loveStyle: string
  bestMatches: string[]
  worstMatches: string[]
  compatibilityDetails: Record<string, string>
  
  // Career
  bestCareers: string[]
  worstCareers: string[]
  
  // Health & Lifestyle
  healthFocus: string
  healthRecommendations: string
  
  // Famous People
  famousPeople: string[]
}

const ENHANCED_ANIMALS: Record<number, EnhancedChineseAnimal> = {
  0: { // RAT
    name: 'Rat',
    emoji: '🐀',
    years: [1900, 1912, 1924, 1936, 1948, 1960, 1972, 1984, 1996, 2008, 2020],
    personality: 'Rats are intelligent, quick-thinking, and resourceful. They are naturally curious and adaptable, able to navigate through life with charm and charisma. Rats are known for their ability to be successful in most endeavors but can sometimes be overly critical and anxious.',
    traits: ['Intelligent', 'Quick-thinking', 'Resourceful', 'Charming', 'Curious', 'Adaptable'],
    
    luckyNumbers: [2, 3],
    luckyColors: ['Black', 'Blue', 'Gold'],
    luckyDirections: ['North', 'West'],
    luckyFlowers: ['Lily', 'African Violet'],
    luckyMonths: ['April', 'December'],
    unluckyNumbers: [5, 9],
    unluckyColors: ['Red', 'Pink'],
    unluckyDirections: ['South', 'East'],
    luckyGems: ['Sapphire', 'Pearl'],
    benMingNian: 'During your Year of the Rat, wear black, blue, or gold clothing or jewelry to ward off misfortune and bring good luck.',
    
    loveStyle: 'Rats are affectionate and passionate in love, though they can be overly possessive and jealous. They value loyalty above all else and expect the same devotion they give. Once committed, Rats make devoted and protective partners.',
    bestMatches: ['Dragon', 'Monkey', 'Ox'],
    worstMatches: ['Horse', 'Goat', 'Rooster'],
    compatibilityDetails: {
      'Dragon': 'Explosive chemistry! Dragon is attracted to Rat\'s cleverness, while Rat admires Dragon\'s confidence and power. Together they create a dynamic, exciting partnership filled with mutual respect and admiration.',
      'Monkey': 'A playful and intellectually stimulating match. Both are clever and quick-witted, leading to constant laughter and mental engagement. They understand each other\'s need for stimulation and adventure.',
      'Ox': 'An unexpected but solid pairing. Ox\'s stability grounds Rat\'s anxious nature, while Rat brings lightness and humor to Ox\'s serious demeanor.',
      'Horse': 'These two have fundamentally different energy levels and life philosophies. Horse needs constant movement and freedom, which makes Rat\'s cautious, planned approach feel suffocating.',
      'Goat': 'Goat\'s emotional neediness clashes with Rat\'s practical nature. Rat grows impatient with Goat\'s indecision and finds Goat\'s dependency draining.',
      'Rooster': 'Rooster\'s bluntness hurts sensitive Rat, while Rat\'s scheming nature offends honest Rooster. Neither understands the other\'s motivations.'
    },
    
    bestCareers: ['CEO / Executive', 'Entrepreneur', 'Salesperson / Marketing', 'Writer / Journalist', 'Accountant / Financial Advisor', 'Strategist / Consultant', 'Diplomat / Negotiator'],
    worstCareers: ['Military Officer (too rigid)', 'Laborer (too repetitive)', 'Therapist (too emotionally demanding)', 'Teacher (lack of patience)', 'Farmer (too slow-paced)'],
    
    healthFocus: 'Mental health, stress management, anxiety',
    healthRecommendations: 'Practice mindfulness, maintain consistent sleep schedule, engage in social activities to combat loneliness',
    
    famousPeople: ['George Washington (1732)', 'Benjamin Franklin (1706)', 'Leonardo da Vinci (1452)', 'Shakespeare (1564)', 'Marlon Brando (1924)', 'Prince Charles (1948)', 'Gwyneth Paltrow (1972)']
  },
  
  1: { // OX
    name: 'Ox',
    emoji: '🐄',
    years: [1901, 1913, 1925, 1937, 1949, 1961, 1973, 1985, 1997, 2009, 2021],
    personality: 'Oxen are hardworking, dependable, and grounded. They are known for their patience, sincerity, and straightforward nature. Oxen are natural leaders who earn respect through their consistent effort and integrity. However, they can be stubborn and slow to adapt to change.',
    traits: ['Hardworking', 'Dependable', 'Patient', 'Sincere', 'Methodical', 'Straightforward'],
    
    luckyNumbers: [1, 4],
    luckyColors: ['Blue', 'White'],
    luckyDirections: ['East', 'North'],
    luckyFlowers: ['Tulip', 'Peony'],
    luckyMonths: ['January', 'November'],
    unluckyNumbers: [5, 6],
    unluckyColors: ['Red', 'Green'],
    unluckyDirections: ['South', 'West'],
    luckyGems: ['Ruby', 'Jade'],
    benMingNian: 'During your Year of the Ox, wear blue or white clothing or jewelry to protect yourself from bad luck and misfortune.',
    
    loveStyle: 'Oxen are loyal and devoted partners who value long-term stability and commitment. They are not quick to fall in love but once committed, they are steadfast and protective. Oxen can be rigid and emotionally reserved, which may make them seem cold, but they care deeply for their loved ones.',
    bestMatches: ['Rat', 'Snake', 'Rooster'],
    worstMatches: ['Goat', 'Horse', 'Dog'],
    compatibilityDetails: {
      'Rat': 'A perfectly complementary pair. Rat brings spontaneity and humor to Ox\'s serious nature, while Ox provides the stability Rat craves.',
      'Snake': 'An elegant and harmonious match. Both are calm, thoughtful, and value loyalty and trust. They communicate quietly but deeply.',
      'Rooster': 'Complementary energies create a strong bond. Both are honest, hardworking, and principled. Rooster\'s confidence balances Ox\'s self-doubt.',
      'Goat': 'Fundamental incompatibility. Ox\'s rigid, practical approach clashes with Goat\'s emotional, creative nature.',
      'Horse': 'Ox wants stability and routine; Horse wants freedom and adventure. Their different pace makes this relationship exhausting.',
      'Dog': 'Despite both being loyal, their loyalty takes different forms. Dog is emotionally expressive while Ox is reserved.'
    },
    
    bestCareers: ['Manager / Supervisor', 'Engineer', 'Architect', 'Accountant', 'Farmer / Agricultural specialist', 'Judge / Lawyer', 'Tradesperson / Craftsperson'],
    worstCareers: ['Entertainer (too unpredictable)', 'Artist (too subjective)', 'Salesperson (too much change)', 'Politician (too compromising)', 'Pilot (too risk-taking)'],
    
    healthFocus: 'Weight management, flexibility, mental stimulation',
    healthRecommendations: 'Establish consistent exercise routine, try new activities, maintain social connections, avoid stagnation',
    
    famousPeople: ['Vincent van Gogh (1853)', 'Walt Disney (1901)', 'Barack Obama (1961)', 'Meghan Markle (1981)', 'Oprah Winfrey (1954)', 'Bill Gates (1955)']
  },
  
  2: { // TIGER
    name: 'Tiger',
    emoji: '🐅',
    years: [1902, 1914, 1926, 1938, 1950, 1962, 1974, 1986, 1998, 2010, 2022],
    personality: 'Tigers are courageous, energetic, and passionate. They are natural leaders with strong personalities and an infectious enthusiasm for life. Tigers are unpredictable and can be temperamental, but their warmth and generosity make them beloved by those around them.',
    traits: ['Courageous', 'Energetic', 'Passionate', 'Charismatic', 'Generous', 'Confident'],
    
    luckyNumbers: [1, 3, 4],
    luckyColors: ['Orange', 'Red', 'Blue'],
    luckyDirections: ['East', 'South'],
    luckyFlowers: ['Crocus', 'Heliotrope'],
    luckyMonths: ['February', 'May', 'July'],
    unluckyNumbers: [6, 7, 8],
    unluckyColors: ['Brown', 'White'],
    unluckyDirections: ['West', 'North'],
    luckyGems: ['Amber', 'Coral'],
    benMingNian: 'During your Year of the Tiger, wear orange, red, or blue clothing or jewelry to ward off misfortune and attract positive energy.',
    
    loveStyle: 'Tigers are passionate, affectionate, and intensely loyal in love. They love with their whole heart and expect the same in return. Tigers can be jealous and possessive, but their warmth and protectiveness make them excellent partners for those who appreciate their intensity.',
    bestMatches: ['Horse', 'Dog', 'Pig'],
    worstMatches: ['Monkey', 'Snake', 'Rooster'],
    compatibilityDetails: {
      'Horse': 'A dynamic, exciting match filled with energy and adventure. Both love freedom, excitement, and new experiences. Neither tries to control the other.',
      'Dog': 'A loyal and protective pair. Both are courageous and principled with strong moral codes. Together they face life\'s challenges as a united team.',
      'Pig': 'A tender, passionate match. Pig\'s gentle nature softens Tiger\'s aggressive edges, while Tiger\'s strength protects sensitive Pig.',
      'Monkey': 'Clash of wills and egos. Monkey\'s tricks and scheming irritate straightforward Tiger. Both are energetic but direct their energy differently.',
      'Snake': 'Mutual incomprehension. Tiger finds Snake\'s mysterious, calculating nature cold and untrustworthy.',
      'Rooster': 'Constant criticism and conflict. Rooster\'s blunt honesty wounds sensitive Tiger.'
    },
    
    bestCareers: ['CEO / Entrepreneur', 'Soldier / Military Officer', 'Athlete / Sports Coach', 'Actor / Performer', 'Surgeon / Doctor', 'Pilot', 'Sales Director', 'Detective / Investigator'],
    worstCareers: ['Accountant (too detailed)', 'Researcher (too slow)', 'Secretary (too routine)', 'Librarian (too quiet)', 'Bank Teller (too boring)'],
    
    healthFocus: 'Stress management, heart health, energy channeling',
    healthRecommendations: 'Engage in vigorous sports, practice anger management, maintain regular health checkups, avoid excessive stimulants',
    
    famousPeople: ['Marilyn Monroe (1926)', 'Martin Luther King Jr. (1929)', 'Stevie Wonder (1950)', 'Tiger Woods (1975)', 'Angelina Jolie (1975)', 'Lady Gaga (1986)']
  },
  
  3: { // RABBIT
    name: 'Rabbit',
    emoji: '🐰',
    years: [1903, 1915, 1927, 1939, 1951, 1963, 1975, 1987, 1999, 2011, 2023],
    personality: 'Rabbits are gentle, artistic, and sensitive souls. They are known for their grace, elegance, and refined taste. Rabbits are intuitive and empathetic, picking up on others\' emotions easily. They prefer peace and harmony, avoiding confrontation whenever possible.',
    traits: ['Gentle', 'Artistic', 'Sensitive', 'Graceful', 'Empathetic', 'Refined'],
    
    luckyNumbers: [3, 4, 6],
    luckyColors: ['Pink', 'Red', 'Purple'],
    luckyDirections: ['East', 'North'],
    luckyFlowers: ['Plantain Lily', 'Snapdragon'],
    luckyMonths: ['March', 'August'],
    unluckyNumbers: [1, 7, 8],
    unluckyColors: ['Black', 'White'],
    unluckyDirections: ['South', 'West'],
    luckyGems: ['Emerald', 'Jade'],
    benMingNian: 'During your Year of the Rabbit, wear pink, red, or purple clothing or jewelry to protect yourself from bad luck and misfortune.',
    
    loveStyle: 'Rabbits are tender, romantic, and deeply emotional in love. They seek security and emotional intimacy, valuing a partner who makes them feel safe and understood. Rabbits can be insecure and need constant reassurance. Once they feel secure, they become devoted, loyal partners.',
    bestMatches: ['Goat', 'Pig', 'Dog'],
    worstMatches: ['Rooster', 'Snake', 'Dragon'],
    compatibilityDetails: {
      'Goat': 'A perfect match of gentle souls. Both are sensitive, artistic, and emotionally intuitive. They understand each other\'s need for peace.',
      'Pig': 'A tender, loving match. Pig\'s generous nature provides Rabbit with the security it needs.',
      'Dog': 'A secure, protective pairing. Dog\'s loyalty makes Rabbit feel safe, allowing Rabbit to open up emotionally.',
      'Rooster': 'Rooster\'s bluntness wounds sensitive Rabbit, while Rabbit\'s passivity frustrates action-oriented Rooster.',
      'Snake': 'Snake\'s manipulative nature doesn\'t align with Rabbit\'s need for safety and honesty.',
      'Dragon': 'Dragon\'s intensity and need for dominance overwhelm sensitive Rabbit.'
    },
    
    bestCareers: ['Artist / Designer', 'Teacher / Educator', 'Counselor / Therapist', 'Writer / Poet', 'Veterinarian / Animal Care', 'Hairdresser / Beautician', 'Diplomat / Mediator', 'Florist / Gardener'],
    worstCareers: ['Soldier / Military (too aggressive)', 'Surgeon (too stressful)', 'Lawyer (too confrontational)', 'Stockbroker (too competitive)', 'Police Officer (too dangerous)'],
    
    healthFocus: 'Mental health, anxiety management, digestive health',
    healthRecommendations: 'Practice yoga or meditation, spend time in nature, maintain supportive relationships, avoid stressful situations when possible',
    
    famousPeople: ['Albert Einstein (1879)', 'Queen Victoria (1819)', 'Frank Sinatra (1915)', 'Johnny Depp (1963)', 'Britney Spears (1981)', 'Harry Styles (1994)']
  },
  
  4: { // DRAGON
    name: 'Dragon',
    emoji: '🐉',
    years: [1904, 1916, 1928, 1940, 1952, 1964, 1976, 1988, 2000, 2012, 2024],
    personality: 'Dragons are the most charismatic and ambitious of all zodiac animals. They are natural leaders with magnetic personalities that draw others to them. Dragons are energetic, confident, and dream big. They are idealistic and believe they can achieve anything they set their mind to.',
    traits: ['Charismatic', 'Ambitious', 'Confident', 'Idealistic', 'Magnetic', 'Visionary'],
    
    luckyNumbers: [1, 6, 7],
    luckyColors: ['Gold', 'Red', 'Purple'],
    luckyDirections: ['East', 'South'],
    luckyFlowers: ['Bleeding-heart flower', 'Larkspur'],
    luckyMonths: ['April', 'July', 'November'],
    unluckyNumbers: [3, 8, 9],
    unluckyColors: ['Green', 'White'],
    unluckyDirections: ['North', 'West'],
    luckyGems: ['Pearl', 'Sapphire'],
    benMingNian: 'During your Year of the Dragon, wear gold, red, or purple clothing or jewelry to ward off bad luck and attract prosperity.',
    
    loveStyle: 'Dragons are passionate and intense in love, viewing romance as an adventure. They seek a partner who matches their ambition and energy. Dragons are generous and devoted to those they love, but they expect admiration and loyalty in return.',
    bestMatches: ['Rat', 'Monkey', 'Rooster'],
    worstMatches: ['Dog', 'Ox', 'Rabbit'],
    compatibilityDetails: {
      'Rat': 'A dynamic power couple. Rat is drawn to Dragon\'s charisma, while Dragon appreciates Rat\'s clever support. Together they create an unstoppable team.',
      'Monkey': 'An exciting, fun-loving match filled with laughter and adventure. Both are intelligent, playful, and enjoy stimulation.',
      'Rooster': 'A respected, complementary pairing. Rooster\'s honesty appeals to Dragon, while Dragon\'s vision inspires Rooster.',
      'Dog': 'Fundamental incompatibility. Dog\'s loyalty clashes with Dragon\'s need for freedom. Dog views Dragon as arrogant.',
      'Ox': 'Ox\'s steady approach clashes with Dragon\'s ambitious nature. Ox finds Dragon wasteful and reckless.',
      'Rabbit': 'Rabbit is intimidated by Dragon\'s intensity. Dragon finds Rabbit\'s passivity frustrating and boring.'
    },
    
    bestCareers: ['CEO / Entrepreneur', 'Politician / Public Figure', 'Entertainer / Performer', 'Inventor / Innovator', 'Financial Advisor / Investment Banker', 'Marketing Director', 'Architect / Urban Planner', 'Film Director / Producer'],
    worstCareers: ['Accountant (too detail-oriented)', 'Laborer (too repetitive)', 'Librarian (too quiet)', 'Secretary (too subordinate)', 'Researcher (too slow)'],
    
    healthFocus: 'Stress management, heart health, work-life balance',
    healthRecommendations: 'Engage in competitive sports, practice relaxation techniques, ensure adequate sleep, learn to delegate, take regular vacations',
    
    famousPeople: ['Pelé (1940)', 'Salvador Dalí (1904)', 'Bruce Lee (1940)', 'Martin Sheen (1940)', 'Elon Musk (1971)']
  },
  
  5: { // SNAKE
    name: 'Snake',
    emoji: '🐍',
    years: [1905, 1917, 1929, 1941, 1953, 1965, 1977, 1989, 2001, 2013, 2025],
    personality: 'Snakes are wise, mysterious, and analytical. They are natural philosophers who observe and understand the world deeply. Snakes are sophisticated, graceful, and possess an innate elegance. They are secretive and private, keeping their true feelings hidden.',
    traits: ['Wise', 'Mysterious', 'Analytical', 'Sophisticated', 'Elegant', 'Intuitive'],
    
    luckyNumbers: [1, 8],
    luckyColors: ['Red', 'Black'],
    luckyDirections: ['West', 'South'],
    luckyFlowers: ['Camelia', 'Orchid'],
    luckyMonths: ['March', 'September', 'November'],
    unluckyNumbers: [0, 5],
    unluckyColors: ['Pink', 'Purple'],
    unluckyDirections: ['East'],
    luckyGems: ['Ruby', 'Topaz'],
    benMingNian: 'During your Year of the Snake, wear red or black clothing or jewelry to keep away misfortune and attract protection and luck.',
    
    loveStyle: 'Snakes are passionate and sensual in love, though their partners may not realize it at first. Snakes are delicate in their affections but grow into loyal, devoted marriage partners. They demand the same loyalty they give and become suspicious if their partner shows signs of wandering.',
    bestMatches: ['Ox', 'Rooster', 'Monkey'],
    worstMatches: ['Pig', 'Tiger'],
    compatibilityDetails: {
      'Ox': 'An elegant, harmonious match. Both are calm, thoughtful, and value stability. Snake appreciates Ox\'s dependability.',
      'Rooster': 'Opposites that truly attract. Snake is cool and mysterious while Rooster is hot-headed and direct.',
      'Monkey': 'An intellectually stimulating match. Both are highly intelligent. Monkey\'s quick cleverness complements Snake\'s deeper analysis.',
      'Pig': 'Constant wounding and conflict. Snake and Pig never truly hear each other\'s concerns and find each other incomprehensible.',
      'Tiger': 'Fundamental incomprehension. Tiger\'s confidence clashes with Snake\'s mysterious nature.'
    },
    
    bestCareers: ['Investment Advisor / Financial Analyst', 'Artist / Designer', 'Stylist / Fashion Consultant', 'Social Media Influencer / Marketer', 'Psychologist / Therapist', 'Writer / Poet', 'Occultist / Spiritual Guide', 'Museum Curator / Antique Dealer'],
    worstCareers: ['Attorney / Lawyer (too combative)', 'Police Officer (too aggressive)', 'Researcher (too transparent)', 'Doctor / Surgeon (too hands-on)', 'Analyst / Statistician (too rigid)'],
    
    healthFocus: 'Physical activity, emotional expression, stress management',
    healthRecommendations: 'Mix movement into daily routine, practice activities like painting or writing, avoid excessive isolation, express emotions openly',
    
    famousPeople: ['Pierce Brosnan (1953)', 'Kanye West (1977)', 'J.K. Rowling (1965)', 'Taylor Swift (1989)', 'Billie Eilish (2001)', 'Bob Dylan (1941)', 'John F. Kennedy (1917)']
  },
  
  6: { // HORSE
    name: 'Horse',
    emoji: '🐴',
    years: [1906, 1918, 1930, 1942, 1954, 1966, 1978, 1990, 2002, 2014, 2026],
    personality: 'Horses are energetic, free-spirited, and love freedom above all else. They are social, warm-hearted, and naturally popular. Horses have infectious enthusiasm and inspire those around them. They are optimistic and straightforward, disliking pretense or deception.',
    traits: ['Energetic', 'Free-spirited', 'Social', 'Warm-hearted', 'Optimistic', 'Straightforward'],
    
    luckyNumbers: [3, 4, 9],
    luckyColors: ['Yellow', 'Purple', 'Green'],
    luckyDirections: ['South', 'East'],
    luckyFlowers: ['Celandine', 'Marigold'],
    luckyMonths: ['June', 'July', 'December'],
    unluckyNumbers: [1, 6, 7],
    unluckyColors: ['Blue', 'White'],
    unluckyDirections: ['North', 'West'],
    luckyGems: ['Tourmaline', 'Opal'],
    benMingNian: 'During your Year of the Horse, wear yellow, purple, or green clothing or jewelry to ward off misfortune and attract positive energy and luck.',
    
    loveStyle: 'Horses are passionate, romantic, and openly affectionate in love. They love freely and expect the same openness in return. Horses value independence highly and need a partner who doesn\'t try to cage them. They are loyal to those they love but can be hot-tempered and impulsive.',
    bestMatches: ['Tiger', 'Dog', 'Goat'],
    worstMatches: ['Rat', 'Ox', 'Rabbit'],
    compatibilityDetails: {
      'Tiger': 'A dynamic, exciting match filled with energy and adventure. Both love freedom and new experiences. Neither tries to control the other.',
      'Dog': 'Loyal and protective pairing. Both are courageous and honest. Dog admires Horse\'s freedom and confidence.',
      'Goat': 'Complementary, harmonious match. Goat\'s gentle nature brings softness to Horse\'s intensity.',
      'Rat': 'Fundamental incompatibility. Horse\'s need for freedom clashes with Rat\'s desire for security.',
      'Ox': 'Ox\'s stability conflicts with Horse\'s need for freedom. Ox\'s jealousy suffocates free-spirited Horse.',
      'Rabbit': 'Rabbit\'s gentle nature is overwhelmed by Horse\'s intensity and need for constant stimulation.'
    },
    
    bestCareers: ['Athlete / Sports Professional', 'Entertainer / Performer', 'Sales Director / Marketing Manager', 'Travel Agent / Tour Guide', 'Journalist / Reporter', 'Photographer / Adventurer', 'Event Planner', 'Outdoor Instructor'],
    worstCareers: ['Accountant (too detailed)', 'Researcher (too slow)', 'Librarian (too quiet)', 'Analyst (too rigid)', 'Farmer (too sedentary)'],
    
    healthFocus: 'Stress management, consistent exercise, mental stimulation',
    healthRecommendations: 'Engage in regular vigorous activities, travel frequently, maintain social connections, avoid restrictive environments, practice outdoor activities',
    
    famousPeople: ['Aretha Franklin (1942)', 'Nelson Mandela (1918)', 'James Dean (1931)', 'Ella Fitzgerald (1917)', 'Serena Williams (1981)', 'Snoop Dogg (1971)']
  },
  
  7: { // GOAT
    name: 'Goat',
    emoji: '🐑',
    years: [1907, 1919, 1931, 1943, 1955, 1967, 1979, 1991, 2003, 2015, 2027],
    personality: 'Goats are gentle, creative, and artistic souls. They are introverted and prefer peaceful environments where they can pursue their creative interests. Goats are sensitive, compassionate, and deeply empathetic. They are intuitive and artistic, often producing beautiful work.',
    traits: ['Gentle', 'Creative', 'Artistic', 'Sensitive', 'Compassionate', 'Empathetic'],
    
    luckyNumbers: [3, 4, 9],
    luckyColors: ['Brown', 'Red', 'Purple'],
    luckyDirections: ['East', 'South'],
    luckyFlowers: ['Carnation', 'Primrose'],
    luckyMonths: ['May', 'July', 'September'],
    unluckyNumbers: [6, 7, 8],
    unluckyColors: ['Blue', 'Green'],
    unluckyDirections: ['North', 'West'],
    luckyGems: ['Agate', 'Tourmaline'],
    benMingNian: 'During your Year of the Goat, wear brown, red, or purple clothing or jewelry to protect yourself from misfortune and attract positive energy.',
    
    loveStyle: 'Goats are tender, romantic, and emotionally dependent in love. They seek partners who make them feel safe, secure, and appreciated. Goats are deeply loyal once committed and will sacrifice much for their partners. They need constant reassurance and emotional support.',
    bestMatches: ['Rabbit', 'Horse', 'Pig'],
    worstMatches: ['Ox', 'Dog', 'Tiger'],
    compatibilityDetails: {
      'Rabbit': 'A perfect match of gentle, sensitive souls. Both are artistic and emotionally intuitive. Together they create beauty and comfort.',
      'Horse': 'Complementary, harmonious pairing. Horse brings excitement to Goat\'s life, while Goat brings softness to Horse\'s intensity.',
      'Pig': 'A tender, loving match. Pig\'s generous nature provides Goat with the security it desperately needs.',
      'Ox': 'Fundamental incompatibility. Ox\'s rigid approach clashes with Goat\'s emotional, creative nature.',
      'Dog': 'Despite both being loyal, their loyalties manifest differently. Dog\'s directness overwhelms sensitive Goat.',
      'Tiger': 'Tiger\'s intensity frightens gentle Goat. Goat can\'t match Tiger\'s pace, making Goat feel inadequate.'
    },
    
    bestCareers: ['Artist / Designer', 'Writer / Poet', 'Teacher / Educator', 'Counselor / Therapist', 'Hairdresser / Beauty Specialist', 'Florist / Gardener', 'Musician / Performer', 'Illustrator / Animator'],
    worstCareers: ['CEO / Executive (too much pressure)', 'Soldier / Military (too aggressive)', 'Lawyer / Judge (too confrontational)', 'Surgeon (too stressful)', 'Stockbroker (too competitive)'],
    
    healthFocus: 'Mental health, anxiety management, emotional wellbeing',
    healthRecommendations: 'Practice creative activities, maintain supportive relationships, practice meditation or yoga, avoid stressful situations, spend time in nature',
    
    famousPeople: ['Muhammad Ali (1942)', 'Frida Kahlo (1907)', 'Andy Warhol (1928)', 'Barbara Streisand (1942)', 'Kurt Cobain (1967)']
  },
  
  8: { // MONKEY
    name: 'Monkey',
    emoji: '🐵',
    years: [1908, 1920, 1932, 1944, 1956, 1968, 1980, 1992, 2004, 2016, 2028],
    personality: 'Monkeys are playful, mischievous, and cleverly witty. They are highly intelligent and inventive, able to solve problems creatively. Monkeys are social, outgoing, and entertaining, making them popular in social circles. They love fun and stimulation and can\'t stand boredom.',
    traits: ['Playful', 'Mischievous', 'Witty', 'Intelligent', 'Inventive', 'Social'],
    
    luckyNumbers: [1, 7, 8],
    luckyColors: ['White', 'Gold', 'Blue'],
    luckyDirections: ['North', 'West'],
    luckyFlowers: ['Passion Flower', 'Morning Glory'],
    luckyMonths: ['April', 'August', 'December'],
    unluckyNumbers: [2, 5, 9],
    unluckyColors: ['Red', 'Green'],
    unluckyDirections: ['South', 'East'],
    luckyGems: ['Crystal', 'Quartz'],
    benMingNian: 'During your Year of the Monkey, wear white, gold, or blue clothing or jewelry to ward off misfortune and attract good luck and prosperity.',
    
    loveStyle: 'Monkeys are playful, charming, and fun-loving in relationships. They are not naturally inclined toward commitment but value freedom and constant stimulation. Monkeys can be flirtatious and unfaithful, easily tempted by new attractions. However, with the right partner, Monkeys can be devoted and loving.',
    bestMatches: ['Rat', 'Dragon', 'Snake'],
    worstMatches: ['Tiger', 'Pig'],
    compatibilityDetails: {
      'Rat': 'A playful, intellectually stimulating match. Both are clever and quick-witted, entertaining each other constantly.',
      'Dragon': 'An exciting, fun-loving match filled with laughter and adventure. Both are intelligent and playful.',
      'Snake': 'An intellectually dynamic match. Monkey\'s quick cleverness complements Snake\'s deep analysis.',
      'Tiger': 'Clash of wills and egos. Monkey\'s tricks irritate straightforward Tiger.',
      'Pig': 'Incompatible energy and values. Monkey\'s tricks and manipulation hurt honest, sincere Pig.'
    },
    
    bestCareers: ['Entrepreneur / Business Owner', 'Salesman / Marketer', 'Entertainer / Performer', 'Programmer / Coder', 'Inventor / Engineer', 'Public Relations Specialist', 'Teacher / Lecturer', 'Translator / Linguist'],
    worstCareers: ['Accountant (too routine)', 'Researcher (too slow)', 'Analyst (too detailed)', 'Secretary (too subordinate)', 'Librarian (too quiet)'],
    
    healthFocus: 'Stress management, consistent exercise, mental health',
    healthRecommendations: 'Engage in physical activities and mental challenges, practice relaxation techniques, maintain regular sleep schedule, avoid excessive stimulants',
    
    famousPeople: ['Coco Chanel (1910)', 'Julius Caesar', 'Christopher Reeve (1952)', 'Miley Cyrus (1992)', 'Christina Aguilera (1980)']
  },
  
  9: { // ROOSTER
    name: 'Rooster',
    emoji: '🐓',
    years: [1909, 1921, 1933, 1945, 1957, 1969, 1981, 1993, 2005, 2017, 2029],
    personality: 'Roosters are honest, observant, and hardworking. They are courageous, straightforward, and speak their truth without filter. Roosters are detail-oriented and responsible, often taking on leadership roles. They are passionate about their beliefs and stand firm in their convictions.',
    traits: ['Honest', 'Observant', 'Hardworking', 'Courageous', 'Straightforward', 'Responsible'],
    
    luckyNumbers: [5, 7, 8],
    luckyColors: ['Red', 'Purple', 'Gold'],
    luckyDirections: ['South', 'East'],
    luckyFlowers: ['Gladiolus', 'Cockscomb'],
    luckyMonths: ['May', 'June', 'November'],
    unluckyNumbers: [1, 3, 9],
    unluckyColors: ['Blue', 'Green'],
    unluckyDirections: ['North', 'West'],
    luckyGems: ['Ruby', 'Garnet'],
    benMingNian: 'During your Year of the Rooster, wear red, purple, or gold clothing or jewelry to protect yourself from misfortune and attract good fortune.',
    
    loveStyle: 'Roosters are passionate and devoted in love, though their blunt honesty can hurt sensitive partners. They are loyal and expect the same loyalty in return. Roosters can be critical and judgmental, expecting their partners to meet high standards. They show love through hard work and dedication.',
    bestMatches: ['Ox', 'Snake', 'Dragon'],
    worstMatches: ['Rabbit', 'Dog'],
    compatibilityDetails: {
      'Ox': 'Complementary, strong bond. Both are honest, hardworking, and principled. Rooster\'s confidence balances Ox\'s self-doubt.',
      'Snake': 'Opposites that truly attract. Snake is cool and mysterious while Rooster is hot-headed and direct.',
      'Dragon': 'A respected, complementary pairing. Rooster\'s honesty appeals to Dragon, while Dragon\'s confidence inspires Rooster.',
      'Rabbit': 'Rooster\'s bluntness wounds sensitive Rabbit, while Rabbit\'s passivity frustrates action-oriented Rooster.',
      'Dog': 'Mutual misunderstanding and criticism. Rooster\'s bluntness hurts sincere Dog.'
    },
    
    bestCareers: ['Manager / Supervisor', 'Teacher / Educator', 'Engineer / Technician', 'Administrator / Organizer', 'Accountant / Auditor', 'Investigator / Detective', 'Judge / Arbitrator', 'Military Officer'],
    worstCareers: ['Entertainer (too frivolous)', 'Artist (too subjective)', 'Politician (too much compromising)', 'Sales (too much deception)', 'Diplomat (too much tact required)'],
    
    healthFocus: 'Stress management, relaxation, perfectionism management',
    healthRecommendations: 'Practice relaxation techniques, engage in physical exercise, learn to delegate, practice patience and acceptance, avoid excessive stimulants',
    
    famousPeople: ['Peter Sellers (1925)', 'Roger Federer (1981)', 'Dolly Parton (1946)', 'Whoopi Goldberg (1955)']
  },
  
  10: { // DOG
    name: 'Dog',
    emoji: '🐕',
    years: [1910, 1922, 1934, 1946, 1958, 1970, 1982, 1994, 2006, 2018, 2030],
    personality: 'Dogs are loyal, honest, and faithful souls. They are deeply principled with strong moral codes. Dogs are protective, sincere, and reliable, earning the trust of those around them. They are intuitive and can sense others\' true nature. However, Dogs can be cynical, anxious, judgmental, and sometimes overly moralistic.',
    traits: ['Loyal', 'Honest', 'Faithful', 'Protective', 'Sincere', 'Intuitive'],
    
    luckyNumbers: [3, 4, 9],
    luckyColors: ['Red', 'Purple', 'Green'],
    luckyDirections: ['East', 'South'],
    luckyFlowers: ['Rose', 'Daisy'],
    luckyMonths: ['February', 'March', 'July'],
    unluckyNumbers: [1, 6, 7],
    unluckyColors: ['Blue', 'White'],
    unluckyDirections: ['North', 'West'],
    luckyGems: ['Jade', 'Diamond'],
    benMingNian: 'During your Year of the Dog, wear red, purple, or green clothing or jewelry to ward off misfortune and protect yourself from bad luck.',
    
    loveStyle: 'Dogs are loyal, protective, and deeply committed in love. They are honest and sincere, expecting the same from partners. Dogs can be jealous and possessive but only because they care deeply. They value trust above all and struggle when their loyalty is questioned.',
    bestMatches: ['Tiger', 'Rabbit', 'Horse'],
    worstMatches: ['Dragon', 'Goat', 'Rooster'],
    compatibilityDetails: {
      'Tiger': 'A loyal and protective pairing. Both are courageous and principled. Together they face life\'s challenges as a united team.',
      'Rabbit': 'A secure, protective pairing. Dog\'s loyalty makes Rabbit feel safe, allowing Rabbit to open up emotionally.',
      'Horse': 'Loyal and honest match. Both are courageous with strong moral codes. Dog admires Horse\'s freedom.',
      'Dragon': 'Fundamental incompatibility. Dog\'s loyalty clashes with Dragon\'s need for freedom.',
      'Goat': 'Dog\'s emotional directness overwhelms sensitive Goat, while Goat\'s neediness frustrates independent Dog.',
      'Rooster': 'Mutual misunderstanding. Rooster\'s bluntness hurts sincere Dog.'
    },
    
    bestCareers: ['Police Officer / Detective', 'Soldier / Military Officer', 'Teacher / Educator', 'Judge / Lawyer', 'Social Worker / Counselor', 'Security Officer', 'Firefighter', 'Doctor / Nurse'],
    worstCareers: ['Politician (too much compromise)', 'Salesman (too much deception)', 'Entertainer (too much fakeness)', 'Diplomat (too much tact)', 'Undercover Agent (too much deception)'],
    
    healthFocus: 'Anxiety management, stress reduction, relaxation',
    healthRecommendations: 'Engage in regular physical exercise, practice relaxation techniques, maintain strong social connections, learn to trust and let go, practice meditation',
    
    famousPeople: ['Winston Churchill (1874)', 'Michael Jackson (1958)', 'Madonna (1958)', 'Brigitte Bardot (1934)', 'Donald Trump (1946)', 'Sylvester Stallone (1946)']
  },
  
  11: { // PIG
    name: 'Pig',
    emoji: '🐷',
    years: [1911, 1923, 1935, 1947, 1959, 1971, 1983, 1995, 2007, 2019, 2031],
    personality: 'Pigs are generous, sincere, and compassionate souls. They are kind-hearted and genuinely care about others\' wellbeing. Pigs are diligent and hardworking, taking their responsibilities seriously. They are honest and straightforward, sometimes to a fault. Pigs are loyal friends and devoted family members.',
    traits: ['Generous', 'Sincere', 'Compassionate', 'Kind-hearted', 'Diligent', 'Loyal'],
    
    luckyNumbers: [2, 5, 8],
    luckyColors: ['Yellow', 'Brown', 'Black'],
    luckyDirections: ['North', 'East'],
    luckyFlowers: ['Pomegranate', 'Hydrangea'],
    luckyMonths: ['March', 'September', 'December'],
    unluckyNumbers: [1, 7, 9],
    unluckyColors: ['Red', 'Green'],
    unluckyDirections: ['South', 'West'],
    luckyGems: ['Agate', 'Obsidian'],
    benMingNian: 'During your Year of the Pig, wear yellow, brown, or black clothing or jewelry to protect yourself from bad luck and misfortune.',
    
    loveStyle: 'Pigs are tender, faithful, and deeply devoted in love. They seek meaningful connections and value emotional intimacy. Pigs are forgiving and patient, willing to work through difficulties. They love with their whole heart and expect the same sincerity in return.',
    bestMatches: ['Rabbit', 'Goat', 'Tiger'],
    worstMatches: ['Snake', 'Monkey', 'Rooster'],
    compatibilityDetails: {
      'Rabbit': 'A tender, loving match. Pig\'s generous nature provides Rabbit with the security it needs.',
      'Goat': 'A tender, loving match. Pig\'s generous nature provides Goat with the security it desperately needs.',
      'Tiger': 'A tender, passionate match. Pig\'s gentle nature softens Tiger\'s aggressive edges.',
      'Snake': 'Constant wounding and conflict. Snake and Pig never hear each other\'s real concerns.',
      'Monkey': 'Incompatible values. Monkey\'s tricks and manipulation hurt honest, sincere Pig.',
      'Rooster': 'Incompatible perspectives. Rooster\'s criticism hurts sensitive Pig.'
    },
    
    bestCareers: ['Social Worker / Counselor', 'Teacher / Educator', 'Nurse / Doctor', 'Non-profit Worker / Activist', 'Veterinarian / Animal Care', 'Therapist / Psychologist', 'Caregiver', 'Humanitarian Worker'],
    worstCareers: ['CEO / Executive (too much pressure)', 'Lawyer / Judge (too combative)', 'Politician (too much compromise)', 'Salesman / Marketer (too much deception)', 'Stockbroker (too competitive)'],
    
    healthFocus: 'Weight management, digestive health, healthy habits',
    healthRecommendations: 'Practice regular exercise, maintain balanced diet, avoid overindulgence, practice mindful eating, engage in stress-management activities',
    
    famousPeople: ['Luciano Pavarotti (1935)', 'Humphrey Bogart (1899)', 'Hillary Clinton (1947)', 'Elton John (1947)']
  }
}

// ==================== HELPER FUNCTIONS ====================

export function getEnhancedAnimalData(birthYear: number): EnhancedChineseAnimal {
  const remainder = (birthYear - 1900) % 12
  return ENHANCED_ANIMALS[remainder]
}

export function getCompatibilityExplanation(animal1: string, animal2: string): string {
  const animalData = Object.values(ENHANCED_ANIMALS).find(a => a.name === animal1)
  if (!animalData) return 'Compatibility information not available.'
  
  return animalData.compatibilityDetails[animal2] || 'Compatibility information not available.'
}

export function getAnimalByName(name: string): EnhancedChineseAnimal | null {
  return Object.values(ENHANCED_ANIMALS).find(a => a.name === name) || null
}
