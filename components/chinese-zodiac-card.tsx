import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getEnhancedAnimalData } from '@/lib/chinese-zodiac-enhanced'
import { Sparkles, Heart, Briefcase, TrendingUp, TrendingDown, Calendar, Target, Flower2 } from 'lucide-react'

interface ChineseZodiacCardProps {
  birthYear: number
}

export function ChineseZodiacCard({ birthYear }: ChineseZodiacCardProps) {
  const animal = getEnhancedAnimalData(birthYear)

  if (!animal) {
    return (
      <Card className="bg-gradient-to-br from-red-950/20 to-amber-950/20 border-amber-500/30">
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">Chinese zodiac information not available</p>
        </CardContent>
      </Card>
    )
  }

  const colorToStyle = (color: string) => {
    const colorMap: Record<string, string> = {
      Black: 'bg-black',
      Blue: 'bg-blue-500',
      Gold: 'bg-yellow-500',
      White: 'bg-white border border-border',
      Orange: 'bg-orange-500',
      Red: 'bg-red-500',
      Pink: 'bg-pink-500',
      Purple: 'bg-purple-500',
      Green: 'bg-green-500',
      Brown: 'bg-amber-700',
      Yellow: 'bg-yellow-400',
      Silver: 'bg-gray-300',
      Teal: 'bg-teal-500',
    }
    return colorMap[color] || 'bg-gray-400'
  }

  return (
    <Card className="bg-gradient-to-br from-red-950/20 to-amber-950/20 border-amber-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl">
          <span className="text-5xl">{animal.emoji}</span>
          <div>
            <div className="text-amber-400 text-sm font-normal">Chinese Zodiac</div>
            <div className="text-3xl font-bold">{animal.name}</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Personality Description */}
        <div className="bg-amber-950/30 rounded-lg p-4 border border-amber-500/20">
          <p className="text-sm leading-relaxed">{animal.personality}</p>
        </div>

        {/* Traits */}
        {animal.traits && animal.traits.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-400 mb-3">
              <Sparkles className="w-4 h-4" />
              Personality Traits
            </div>
            <div className="flex flex-wrap gap-2">
              {animal.traits.map((trait) => (
                <span
                  key={trait}
                  className="px-3 py-1.5 bg-amber-500/20 text-amber-300 rounded-full text-xs font-medium"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Strengths & Weaknesses */}
        {(animal.strengths || animal.weaknesses) && (
          <div className="grid md:grid-cols-2 gap-4">
            {animal.strengths && animal.strengths.length > 0 && (
              <div className="bg-green-950/30 rounded-lg p-4 border border-green-500/20">
                <div className="flex items-center gap-2 text-sm font-semibold text-green-400 mb-3">
                  <TrendingUp className="w-4 h-4" />
                  Strengths
                </div>
                <ul className="space-y-2">
                  {animal.strengths.map((strength) => (
                    <li key={strength} className="text-sm">✓ {strength}</li>
                  ))}
                </ul>
              </div>
            )}
            {animal.weaknesses && animal.weaknesses.length > 0 && (
              <div className="bg-red-950/30 rounded-lg p-4 border border-red-500/20">
                <div className="flex items-center gap-2 text-sm font-semibold text-red-400 mb-3">
                  <TrendingDown className="w-4 h-4" />
                  Challenges
                </div>
                <ul className="space-y-2">
                  {animal.weaknesses.map((weakness) => (
                    <li key={weakness} className="text-sm text-red-300">• {weakness}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Love Style */}
        <div className="bg-pink-950/30 rounded-lg p-4 border border-pink-500/20">
          <div className="flex items-center gap-2 text-sm font-semibold text-pink-400 mb-3">
            <Heart className="w-4 h-4" />
            In Love
          </div>
          <p className="text-sm leading-relaxed">{animal.loveStyle}</p>
        </div>

        {/* Lucky Things */}
        <div className="bg-amber-950/30 rounded-lg p-4 border border-amber-500/20 space-y-4">
          <div className="text-sm font-semibold text-amber-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Lucky Things
          </div>
          
          {/* Lucky Colors */}
          <div>
            <div className="text-xs text-muted-foreground mb-2">Lucky Colors</div>
            <div className="flex gap-2">
              {animal.luckyColors.map((color) => (
                <div key={color} className="flex flex-col items-center gap-1">
                  <div className={`w-10 h-10 rounded-full ${colorToStyle(color)}`} />
                  <div className="text-xs">{color}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Lucky Numbers */}
          <div>
            <div className="text-xs text-muted-foreground mb-2">Lucky Numbers</div>
            <div className="flex gap-2">
              {animal.luckyNumbers.map((num) => (
                <div
                  key={num}
                  className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm font-bold"
                >
                  {num}
                </div>
              ))}
            </div>
          </div>

          {/* Lucky Directions */}
          <div>
            <div className="text-xs text-muted-foreground mb-2">Lucky Directions</div>
            <div className="text-sm">{animal.luckyDirections.join(', ')}</div>
          </div>

          {/* Lucky Flowers */}
          <div className="flex items-start gap-2">
            <Flower2 className="w-4 h-4 text-amber-400 mt-0.5" />
            <div>
              <div className="text-xs text-muted-foreground">Lucky Flowers</div>
              <div className="text-sm">{animal.luckyFlowers.join(', ')}</div>
            </div>
          </div>

          {/* Lucky Months */}
          <div className="flex items-start gap-2">
            <Calendar className="w-4 h-4 text-amber-400 mt-0.5" />
            <div>
              <div className="text-xs text-muted-foreground">Lucky Months</div>
              <div className="text-sm">{animal.luckyMonths.join(', ')}</div>
            </div>
          </div>

          {/* Lucky Gems */}
          <div>
            <div className="text-xs text-muted-foreground mb-2">Lucky Gems</div>
            <div className="text-sm">{animal.luckyGems.join(', ')}</div>
          </div>
        </div>

        {/* Unlucky Things */}
        <div className="bg-red-950/30 rounded-lg p-4 border border-red-500/20 space-y-3">
          <div className="text-sm font-semibold text-red-400">Unlucky Things to Avoid</div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="text-muted-foreground mb-1">Numbers</div>
              <div>{animal.unluckyNumbers.join(', ')}</div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">Colors</div>
              <div>{animal.unluckyColors.join(', ')}</div>
            </div>
            <div className="col-span-2">
              <div className="text-muted-foreground mb-1">Directions</div>
              <div>{animal.unluckyDirections.join(', ')}</div>
            </div>
          </div>
        </div>

        {/* Ben Ming Nian */}
        <div className="bg-red-950/30 rounded-lg p-4 border border-red-500/20">
          <div className="text-sm font-semibold text-red-400 mb-2">🧧 Ben Ming Nian (Birth Year Protection)</div>
          <p className="text-xs leading-relaxed">{animal.benMingNian}</p>
        </div>

        {/* Career Recommendations */}
        <div className="space-y-4">
          <div className="bg-blue-950/30 rounded-lg p-4 border border-blue-500/20">
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-400 mb-3">
              <Briefcase className="w-4 h-4" />
              Best Careers
            </div>
            <div className="flex flex-wrap gap-2">
              {animal.bestCareers.map((career) => (
                <span
                  key={career}
                  className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-md text-xs"
                >
                  {career}
                </span>
              ))}
            </div>
          </div>
          
          <div className="bg-red-950/30 rounded-lg p-4 border border-red-500/20">
            <div className="text-sm font-semibold text-red-400 mb-3">Worst Careers</div>
            <div className="flex flex-wrap gap-2">
              {animal.worstCareers.map((career) => (
                <span
                  key={career}
                  className="px-2 py-1 bg-red-500/20 text-red-300 rounded-md text-xs"
                >
                  {career}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Health & Lifestyle */}
        <div className="bg-emerald-950/30 rounded-lg p-4 border border-emerald-500/20">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-400 mb-3">
            <Target className="w-4 h-4" />
            Health & Lifestyle Advice
          </div>
          <div className="space-y-2">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Focus Areas</div>
              <p className="text-sm">{animal.healthFocus}</p>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Recommendations</div>
              <p className="text-sm">{animal.healthRecommendations}</p>
            </div>
          </div>
        </div>

        {/* Compatibility */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-green-950/30 rounded-lg p-4 border border-green-500/20">
            <div className="text-sm font-semibold text-green-400 mb-3">❤️ Best Matches</div>
            <div className="space-y-2">
              {animal.bestMatches.map((match) => (
                <div key={match} className="text-sm">• {match}</div>
              ))}
            </div>
          </div>
          <div className="bg-red-950/30 rounded-lg p-4 border border-red-500/20">
            <div className="text-sm font-semibold text-red-400 mb-3">❌ Worst Matches</div>
            <div className="space-y-2">
              {animal.worstMatches.map((match) => (
                <div key={match} className="text-sm text-red-300">• {match}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Famous People */}
        <div className="bg-purple-950/30 rounded-lg p-4 border border-purple-500/20">
          <div className="text-sm font-semibold text-purple-400 mb-3">⭐ Famous {animal.name}s</div>
          <div className="flex flex-wrap gap-2">
            {animal.famousPeople.map((person) => (
              <span
                key={person}
                className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-md text-xs"
              >
                {person}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
