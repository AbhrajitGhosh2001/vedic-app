'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Sparkles, 
  Calendar, 
  Heart, 
  Moon, 
  Star,
  Zap,
  TrendingUp,
  AlertCircle,
  Target,
  Lightbulb
} from 'lucide-react'

const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Phoenix', label: 'Arizona (MST)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Asia/Kolkata', label: 'India (IST)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEDT)' },
  { value: 'Australia/Melbourne', label: 'Melbourne (AEDT)' },
]

interface DailyPrediction {
  cosmicWeather: string
  personalImpact: string
  emotionalEnergy: string
  opportunities: string[]
  challenges: string[]
  guidance: string
  dailyScore: number
}

export default function DailyPredictionPage() {
  const [timezone, setTimezone] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [prediction, setPrediction] = useState<DailyPrediction | null>(null)
  const [currentTime, setCurrentTime] = useState('')

  // Auto-detect user's timezone on mount
  useEffect(() => {
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    setTimezone(detectedTimezone)
    updateCurrentTime(detectedTimezone)
  }, [])

  // Update time whenever timezone changes
  useEffect(() => {
    if (timezone) {
      updateCurrentTime(timezone)
      const interval = setInterval(() => updateCurrentTime(timezone), 60000)
      return () => clearInterval(interval)
    }
  }, [timezone])

  const updateCurrentTime = (tz: string) => {
    try {
      const now = new Date()
      const timeStr = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }).format(now)
      setCurrentTime(timeStr)
    } catch (error) {
      console.error('[v0] Error formatting time:', error)
    }
  }

  const generatePrediction = async () => {
    if (!timezone) return

    setIsLoading(true)
    try {
      // Simulate API call to generate daily prediction
      // In a real implementation, this would call an endpoint with birth chart data
      const mockPrediction: DailyPrediction = {
        cosmicWeather: `Today's cosmic energy is uniquely shaped by the Moon transiting through a powerful phase in your timezone (${timezone.split('/')[1]}). The planetary alignment suggests a day of heightened intuition and emotional clarity. Mercury's favorable position indicates excellent communication opportunities, while Venus brings warmth to relationships.`,
        personalImpact: `For you personally, today's transits create a harmonious alignment with your natal chart. The current Moon position activates your emotional intelligence, making this an ideal time for important conversations and decision-making. Mars energy supports assertiveness in pursuing your goals, though patience may be required in the afternoon.`,
        emotionalEnergy: `Your emotional landscape today is tender yet resilient. The Moon's current Nakshatra suggests introspection and intuitive wisdom. You may find yourself drawn to spiritual practices or meaningful connections. Allow yourself to feel deeply while maintaining healthy boundaries. Trust your instincts—they're particularly sharp today.`,
        opportunities: [
          'Communication breakthroughs with important people',
          'Creative projects gaining momentum',
          'Financial decisions favoring your growth',
          'Spiritual or meditative practices proving beneficial',
          'Healing old emotional wounds through forgiveness'
        ],
        challenges: [
          'Potential scattered energy in the morning—ground yourself',
          'Others may project their emotions onto you—maintain boundaries',
          'Avoid major financial commitments without consulting trusted advisors',
          'Mercury retrograde shadow may cause minor miscommunications',
          'Energy dips mid-afternoon—take a mindful break'
        ],
        guidance: `Make this a day of intentional presence. Start with a grounding practice (meditation, journaling, or time in nature). Schedule important communications for mid-morning when mental clarity peaks. In relationships, lead with empathy. For decisions: sleep on major choices. In the evening, reflect on what today taught you. This day is preparing you for significant growth ahead.`,
        dailyScore: Math.floor(Math.random() * 3) + 7 // 7-9 range for demo
      }

      // Simulate slight delay for API feel
      await new Promise(resolve => setTimeout(resolve, 800))
      setPrediction(mockPrediction)
    } catch (error) {
      console.error('[v0] Error generating prediction:', error)
      alert('Failed to generate prediction. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Section */}
      <section className="relative overflow-hidden py-16 px-4 border-b border-primary/20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-primary/15 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Daily Cosmic Guidance
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Your Daily <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Prediction</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Personalized Vedic astrology insights based on your timezone and today's cosmic weather
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {!prediction ? (
            // Timezone Selector
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-gradient-to-br from-card/50 to-card/25 border-primary/30 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Select Your Timezone
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground">
                    Your timezone helps us calculate accurate planetary positions and generate personalized predictions for your location.
                  </p>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-foreground">Timezone</label>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger className="h-12 bg-background/50 border-primary/30 focus:border-primary">
                        <SelectValue placeholder="Select your timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIMEZONES.map((tz) => (
                          <SelectItem key={tz.value} value={tz.value}>
                            {tz.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {currentTime && (
                      <p className="text-xs text-muted-foreground">
                        Current time: <span className="text-primary font-semibold">{currentTime}</span>
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={generatePrediction}
                    disabled={!timezone || isLoading}
                    className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold"
                  >
                    {isLoading ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                        Generating Prediction...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Get Your Daily Prediction
                      </>
                    )}
                  </Button>

                  <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
                    <p className="text-sm text-muted-foreground flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      Your personal prediction is calculated based on current planetary transits in relation to your birth chart. For best results, ensure your birth information is accurate in your profile.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            // Prediction Display
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Daily Score */}
              <Card className="bg-gradient-to-r from-primary/20 to-accent/20 border-primary/30">
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground mb-2">Today's Cosmic Energy Score</p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-6xl font-bold text-primary">{prediction.dailyScore}</span>
                    <div className="flex flex-col items-start">
                      <div className="flex gap-1">
                        {[...Array(10)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${i < prediction.dailyScore ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Out of 10</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cosmic Weather */}
              <Card className="bg-gradient-to-br from-blue-950/20 to-blue-900/10 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Moon className="w-5 h-5 text-blue-400" />
                    Cosmic Weather
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80 leading-relaxed">{prediction.cosmicWeather}</p>
                </CardContent>
              </Card>

              {/* Personal Impact */}
              <Card className="bg-gradient-to-br from-purple-950/20 to-purple-900/10 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Heart className="w-5 h-5 text-purple-400" />
                    How Today Affects You
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80 leading-relaxed">{prediction.personalImpact}</p>
                </CardContent>
              </Card>

              {/* Emotional Energy */}
              <Card className="bg-gradient-to-br from-pink-950/20 to-pink-900/10 border-pink-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Heart className="w-5 h-5 text-pink-400" />
                    Emotional Energy Today
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80 leading-relaxed">{prediction.emotionalEnergy}</p>
                </CardContent>
              </Card>

              {/* Opportunities & Challenges */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Opportunities */}
                <Card className="bg-gradient-to-br from-green-950/20 to-green-900/10 border-green-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      Opportunities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {prediction.opportunities.map((opp, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                          <span className="text-green-400 font-bold text-lg">✓</span>
                          <span className="text-foreground/80">{opp}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Challenges */}
                <Card className="bg-gradient-to-br from-orange-950/20 to-orange-900/10 border-orange-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <AlertCircle className="w-5 h-5 text-orange-400" />
                      Challenges to Navigate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {prediction.challenges.map((challenge, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                          <span className="text-orange-400 font-bold text-lg">→</span>
                          <span className="text-foreground/80">{challenge}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Guidance */}
              <Card className="bg-gradient-to-br from-accent/20 to-accent/10 border-accent/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Target className="w-5 h-5 text-accent" />
                    Guidance for Today
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80 leading-relaxed">{prediction.guidance}</p>
                </CardContent>
              </Card>

              {/* Get New Prediction */}
              <Button
                onClick={() => setPrediction(null)}
                variant="outline"
                className="w-full h-12 border-primary/30 hover:border-primary"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Get Another Prediction
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 px-4 bg-gradient-to-b from-background to-primary/5 border-t border-primary/20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-8 text-center">How Daily Predictions Work</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-card/30 border-border/30">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Real-Time Transits</h3>
                  <p className="text-sm text-muted-foreground">
                    We calculate planetary positions for your exact timezone and time
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/30 border-border/30">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Moon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Personal Chart Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Your birth chart data is analyzed against today's cosmic movements
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/30 border-border/30">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Personalized Insights</h3>
                  <p className="text-sm text-muted-foreground">
                    You receive unique guidance based on your astrological profile
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
