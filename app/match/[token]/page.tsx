"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { StarField } from "@/components/star-field"
import { Heart, Lock, Sparkles } from "lucide-react"
import { calculateGunaMilan, type CompatibilityResult } from "@/lib/guna-milan"
import { SAMPLE_PROFILES } from "@/lib/sample-profiles"
import { getZodiacSymbol } from "@/lib/birth-chart"
import type { UserProfile } from "@/lib/types"
import Link from "next/link"

export default function SharedMatchPage() {
  const params = useParams()
  const [user1, setUser1] = useState<UserProfile | null>(null)
  const [user2, setUser2] = useState<UserProfile | null>(null)
  const [compatibility, setCompatibility] = useState<CompatibilityResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    try {
      // Decode the token to get user IDs
      const decoded = atob(params.token as string)
      const [user1Id, user2Id] = decoded.split(':')
      
      // Get profiles
      const profiles = JSON.parse(localStorage.getItem('profiles') || '[]')
      
      let profile1 = profiles.find((p: UserProfile) => p.id === user1Id)
      let profile2 = SAMPLE_PROFILES.find(p => p.id === user2Id)
      
      if (!profile2) {
        profile2 = profiles.find((p: UserProfile) => p.id === user2Id)
      }
      
      if (profile1 && profile2) {
        setUser1(profile1)
        setUser2(profile2)
        
        const result = calculateGunaMilan(
          { moonSign: profile1.vedicChart.moonSign, nakshatra: profile1.vedicChart.nakshatra },
          { moonSign: profile2.vedicChart.moonSign, nakshatra: profile2.vedicChart.nakshatra }
        )
        setCompatibility(result)
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    }
    setLoading(false)
  }, [params.token])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-8 h-8 text-primary" />
        </motion.div>
      </div>
    )
  }

  if (error || !user1 || !user2 || !compatibility) {
    return (
      <div className="min-h-screen bg-background relative">
        <StarField />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
          <Card className="bg-card/80 backdrop-blur border-border/50 max-w-md w-full">
            <CardContent className="p-8 text-center">
              <Lock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h1 className="text-2xl font-light mb-2">Match Not Found</h1>
              <p className="text-muted-foreground mb-6">
                This compatibility link may have expired or the profiles are no longer available.
              </p>
              <Button asChild>
                <Link href="/">Find Your Own Match</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative">
      <StarField />
      
      <div className="relative z-10 container max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link href="/" className="text-primary hover:text-primary/80 transition-colors text-sm tracking-wider uppercase">
            The AI Need
          </Link>
        </motion.div>

        {/* Shared Match Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-card/80 backdrop-blur border-border/50 overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 p-4 text-center border-b border-border/50">
              <span className="text-sm text-muted-foreground">Cosmic Compatibility</span>
            </div>
            
            <CardContent className="p-8">
              {/* Profiles */}
              <div className="flex items-center justify-center gap-8 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center text-2xl text-primary mb-2">
                    {user1.name.charAt(0)}
                  </div>
                  <h3 className="font-medium">{user1.name}</h3>
                  <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                    <span>{getZodiacSymbol(user1.vedicChart.moonSign)}</span>
                    <span>{user1.vedicChart.moonSign}</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center">
                  <Heart className="w-8 h-8 text-accent mb-2" />
                  <span className="text-xs text-muted-foreground">matched</span>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-accent/20 flex items-center justify-center text-2xl text-accent mb-2">
                    {user2.name.charAt(0)}
                  </div>
                  <h3 className="font-medium">{user2.name}</h3>
                  <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                    <span>{getZodiacSymbol(user2.vedicChart.moonSign)}</span>
                    <span>{user2.vedicChart.moonSign}</span>
                  </div>
                </div>
              </div>
              
              {/* Score */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className={`text-7xl font-light mb-2 ${getScoreColor(compatibility.percentage)}`}
                >
                  {compatibility.percentage}%
                </motion.div>
                <p className="text-xl text-muted-foreground">
                  {compatibility.compatibility}
                </p>
                <p className="text-sm text-primary/70 mt-2">
                  {compatibility.totalScore} of 36 Guna Points
                </p>
              </div>
              
              {/* Summary Bars */}
              <div className="space-y-3 mb-8">
                <SummaryBar label="Emotional" value={getEmotionalScore(compatibility)} />
                <SummaryBar label="Physical" value={getPhysicalScore(compatibility)} />
                <SummaryBar label="Spiritual" value={getSpiritualScore(compatibility)} />
              </div>
              
              {/* CTA */}
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Want to see the full compatibility breakdown?
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild>
                    <Link href="/onboarding">
                      Create Your Profile
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/">
                      Learn More
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-muted-foreground mt-8"
        >
          Compatibility calculated using traditional Vedic Guna Milan system
        </motion.p>
      </div>
    </div>
  )
}

function SummaryBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className={getScoreColor(value)}>{value}%</span>
      </div>
      <div className="h-2 bg-background rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className={`h-full rounded-full ${
            value >= 70 ? 'bg-green-400' : 
            value >= 40 ? 'bg-primary' : 'bg-orange-400'
          }`}
        />
      </div>
    </div>
  )
}

function getScoreColor(percentage: number): string {
  if (percentage >= 70) return 'text-green-400'
  if (percentage >= 40) return 'text-primary'
  return 'text-orange-400'
}

// Helper functions to extract category scores
function getEmotionalScore(compat: CompatibilityResult): number {
  const { bhakut, gana } = compat.breakdown
  return Math.round(((bhakut.score / bhakut.maxScore + gana.score / gana.maxScore) / 2) * 100)
}

function getPhysicalScore(compat: CompatibilityResult): number {
  const { yoni, nadi } = compat.breakdown
  return Math.round(((yoni.score / yoni.maxScore + nadi.score / nadi.maxScore) / 2) * 100)
}

function getSpiritualScore(compat: CompatibilityResult): number {
  const { varna, grahaMaitri, tara } = compat.breakdown
  return Math.round(((varna.score / varna.maxScore + grahaMaitri.score / grahaMaitri.maxScore + tara.score / tara.maxScore) / 3) * 100)
}
