import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getEnhancedAnimalData, getCompatibilityExplanation } from '@/lib/chinese-zodiac-enhanced'
import { getChineseZodiacCompatibility } from '@/lib/chinese-zodiac'
import { Heart, Star } from 'lucide-react'

interface ChineseZodiacCompatibilityProps {
  birthYear1: number
  birthYear2: number
  user1Name?: string
  user2Name?: string
}

export function ChineseZodiacCompatibility({
  birthYear1,
  birthYear2,
  user1Name = 'User 1',
  user2Name = 'User 2'
}: ChineseZodiacCompatibilityProps) {
  const animal1 = getEnhancedAnimalData(birthYear1)
  const animal2 = getEnhancedAnimalData(birthYear2)
  const compatibility = getChineseZodiacCompatibility(birthYear1, birthYear2)
  const explanation = getCompatibilityExplanation(animal1.name, animal2.name)
  
  const isGoodMatch = animal1.bestMatches.includes(animal2.name)
  const isBadMatch = animal1.worstMatches.includes(animal2.name)
  
  const matchType = isGoodMatch ? 'Excellent Match' : isBadMatch ? 'Challenging Match' : 'Neutral Match'
  const matchColor = isGoodMatch ? 'text-green-400' : isBadMatch ? 'text-red-400' : 'text-amber-400'
  const borderColor = isGoodMatch ? 'border-green-500/30' : isBadMatch ? 'border-red-500/30' : 'border-amber-500/30'
  const bgGradient = isGoodMatch 
    ? 'from-green-950/20 to-emerald-950/20' 
    : isBadMatch 
    ? 'from-red-950/20 to-rose-950/20' 
    : 'from-amber-950/20 to-yellow-950/20'

  const renderStars = (count: number) => {
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < count
                ? 'fill-amber-400 text-amber-400'
                : 'fill-transparent text-muted-foreground'
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <Card className={`bg-gradient-to-br ${bgGradient} border ${borderColor}`}>
      <CardHeader>
        <CardTitle className="text-center">
          <div className="text-2xl text-amber-400">🎆 Chinese Zodiac Compatibility 🎆</div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Header with Animals */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-5xl">{animal1.emoji}</span>
            <div>
              <div className="text-sm text-muted-foreground">{user1Name}</div>
              <div className="font-bold text-lg">{animal1.name}</div>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <Heart className={`w-8 h-8 ${matchColor}`} />
            {renderStars(compatibility)}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">{user2Name}</div>
              <div className="font-bold text-lg">{animal2.name}</div>
            </div>
            <span className="text-5xl">{animal2.emoji}</span>
          </div>
        </div>

        {/* Match Type */}
        <div className="text-center p-6 rounded-xl bg-black/30 border border-white/10">
          <div className={`text-2xl font-bold ${matchColor}`}>{matchType}</div>
          <div className="text-sm text-muted-foreground mt-1">
            {compatibility}/5 Compatibility Rating
          </div>
        </div>

        {/* Compatibility Explanation */}
        {explanation && explanation !== 'Compatibility information not available.' && (
          <div className="bg-black/30 rounded-lg p-4 border border-white/10">
            <div className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Why This Pairing {isGoodMatch ? 'Works' : isBadMatch ? 'Struggles' : 'Can Work'}
            </div>
            <p className="text-sm leading-relaxed">{explanation}</p>
          </div>
        )}

        {/* Traits Comparison */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-card/50 rounded-lg p-4 border border-border/50">
            <div className="text-sm font-semibold text-amber-400 mb-2">{animal1.name} Traits</div>
            <div className="flex flex-wrap gap-1.5">
              {animal1.traits.slice(0, 4).map((trait) => (
                <span
                  key={trait}
                  className="px-2 py-1 bg-amber-500/20 text-amber-300 rounded-md text-xs"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-card/50 rounded-lg p-4 border border-border/50">
            <div className="text-sm font-semibold text-amber-400 mb-2">{animal2.name} Traits</div>
            <div className="flex flex-wrap gap-1.5">
              {animal2.traits.slice(0, 4).map((trait) => (
                <span
                  key={trait}
                  className="px-2 py-1 bg-amber-500/20 text-amber-300 rounded-md text-xs"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Love Styles */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-pink-400 flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Love Styles
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-pink-950/30 rounded-lg p-3 border border-pink-500/20">
              <div className="text-xs text-muted-foreground mb-1">{animal1.name}</div>
              <p className="text-xs leading-relaxed">{animal1.loveStyle}</p>
            </div>
            <div className="bg-pink-950/30 rounded-lg p-3 border border-pink-500/20">
              <div className="text-xs text-muted-foreground mb-1">{animal2.name}</div>
              <p className="text-xs leading-relaxed">{animal2.loveStyle}</p>
            </div>
          </div>
        </div>

        {/* Relationship Advice */}
        <div className="bg-blue-950/30 rounded-lg p-4 border border-blue-500/20">
          <div className="text-sm font-semibold text-blue-400 mb-2">💡 Relationship Insight</div>
          <p className="text-sm leading-relaxed">
            {isGoodMatch 
              ? `${animal1.name} and ${animal2.name} have natural chemistry and understanding. This pairing tends to bring out the best in both partners, creating a harmonious and supportive relationship. Your complementary traits make you a strong team.`
              : isBadMatch
              ? `${animal1.name} and ${animal2.name} face fundamental differences that require extra effort and understanding. While challenging, this pairing can grow through learning to appreciate each other's unique perspectives. Communication and patience are key.`
              : `${animal1.name} and ${animal2.name} have a balanced dynamic. Neither naturally aligned nor conflicting, this relationship's success depends on mutual effort, respect, and willingness to understand each other's differences.`
            }
          </p>
        </div>

        {/* Who They're Each Best With */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-card/50 rounded-lg p-4 border border-border/50">
            <div className="text-xs text-muted-foreground mb-2">{animal1.name} is most compatible with:</div>
            <div className="space-y-1">
              {animal1.bestMatches.map((match) => (
                <div key={match} className="flex items-center gap-1 text-sm">
                  <span className="text-green-400">✓</span>
                  <span className={match === animal2.name ? 'font-bold text-green-400' : ''}>{match}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-card/50 rounded-lg p-4 border border-border/50">
            <div className="text-xs text-muted-foreground mb-2">{animal2.name} is most compatible with:</div>
            <div className="space-y-1">
              {animal2.bestMatches.map((match) => (
                <div key={match} className="flex items-center gap-1 text-sm">
                  <span className="text-green-400">✓</span>
                  <span className={match === animal1.name ? 'font-bold text-green-400' : ''}>{match}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What to Watch Out For */}
        {isBadMatch && (
          <div className="bg-red-950/30 rounded-lg p-4 border border-red-500/20">
            <div className="text-sm font-semibold text-red-400 mb-2">⚠️ Potential Challenges</div>
            <ul className="space-y-2 text-sm">
              <li>• Different communication styles may lead to misunderstandings</li>
              <li>• Respect each other's fundamental differences in approach to life</li>
              <li>• Focus on shared values rather than conflicting traits</li>
              <li>• Practice patience and active listening</li>
            </ul>
          </div>
        )}

        {/* Strengths of This Pairing */}
        {isGoodMatch && (
          <div className="bg-green-950/30 rounded-lg p-4 border border-green-500/20">
            <div className="text-sm font-semibold text-green-400 mb-2">✨ Strengths of This Pairing</div>
            <ul className="space-y-2 text-sm">
              <li>• Natural understanding and empathy for each other</li>
              <li>• Complementary strengths that create balance</li>
              <li>• Shared values and life goals</li>
              <li>• Easy communication and mutual respect</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
