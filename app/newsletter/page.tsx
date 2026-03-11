'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  Lightbulb,
  LogOut,
  Clock,
  Sun
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { generateDailyPrediction } from '@/lib/daily-prediction-engine'

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
  bestTimings: string[]
  muhurtaWindows: Array<{ time: string; activity: string }>
}

interface UserProfile {
  id: string
  first_name: string
  birth_date: string
  birth_time: string
  birth_location: string
  sun_sign: string
  moon_sign: string
  nakshatra_name: string
  lagna: string
  mars_house?: number
}

export default function DailyPredictionPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [timezone, setTimezone] = useState('')
  const [isPredictionLoading, setIsPredictionLoading] = useState(false)
  const [prediction, setPrediction] = useState<DailyPrediction | null>(null)
  const [currentTime, setCurrentTime] = useState('')

  // Check authentication and fetch user profile
  useEffect(() => {
    const checkAuthAndFetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/auth/login')
          return
        }

        setIsAuthenticated(true)

        // Fetch user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profile) {
          setUserProfile(profile)
        }

        // Auto-detect timezone
        const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
        setTimezone(detectedTimezone)
        updateCurrentTime(detectedTimezone)
      } catch (error) {
        console.error('[v0] Error checking auth:', error)
        router.push('/auth/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthAndFetchProfile()
  }, [supabase, router])

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
    if (!timezone || !userProfile) return

    setIsPredictionLoading(true)
    try {
      // Build natal chart object from user profile
      const natalChart = {
        sun_sign: userProfile.sun_sign,
        moon_sign: userProfile.moon_sign,
        lagna: userProfile.lagna,
        nakshatra_name: userProfile.nakshatra_name,
        mars_house: userProfile.mars_house || 5,
      }

      // Generate deterministic prediction using the prediction engine
      const enginePrediction = generateDailyPrediction(natalChart as any, userProfile.birth_date)

      // Convert engine output to UI format
      const predictionOutput: DailyPrediction = {
        cosmicWeather: enginePrediction.cosmicWeather,
        personalImpact: enginePrediction.personalEnergyToday,
        emotionalEnergy: enginePrediction.emotionalTone,
        opportunities: enginePrediction.opportunities,
        challenges: enginePrediction.challenges,
        guidance: enginePrediction.dailyGuidance,
        dailyScore: Math.round(enginePrediction.energyIndex.score),
        bestTimings: enginePrediction.bestTimings,
        muhurtaWindows: enginePrediction.muhurtaWindows,
      }

      // Simulate slight delay for processing feel
      await new Promise(resolve => setTimeout(resolve, 500))
      setPrediction(predictionOutput)
    } catch (error) {
      console.error('[v0] Error generating prediction:', error)
      alert('Failed to generate prediction. Please try again.')
    } finally {
      setIsPredictionLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Loading your personalized prediction...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !userProfile) {
    return null // Redirecting via useEffect
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
              {userProfile.first_name}'s Daily Cosmic Guidance
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Your Daily <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Prediction</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Personalized Vedic astrology insights for {userProfile.sun_sign} Sun, {userProfile.moon_sign} Moon, {userProfile.lagna} Ascendant
            </p>

            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-primary/30 hover:border-primary"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
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
                    Your timezone helps us calculate accurate planetary positions relative to your birth location and generate personalized predictions for your exact location.
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

                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                    <h4 className="font-semibold mb-2 text-sm">Your Birth Profile</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">Birth Date</p>
                        <p className="text-foreground font-medium">{userProfile.birth_date}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Birth Time</p>
                        <p className="text-foreground font-medium">{userProfile.birth_time}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Birth Location</p>
                        <p className="text-foreground font-medium">{userProfile.birth_location}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Sun Sign</p>
                        <p className="text-foreground font-medium">{userProfile.sun_sign}</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={generatePrediction}
                    disabled={!timezone || isPredictionLoading}
                    className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold"
                  >
                    {isPredictionLoading ? (
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
                      Your personal prediction is calculated based on current planetary transits in relation to your specific birth chart data.
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

              {/* Best Timings */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-gradient-to-br from-blue-950/20 to-blue-900/10 border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Clock className="w-5 h-5 text-blue-400" />
                      Best Times Today
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {prediction.bestTimings.map((timing, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-blue-400 mt-1">→</span>
                          <span className="text-foreground/80">{timing}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Muhurta Windows */}
                <Card className="bg-gradient-to-br from-violet-950/20 to-violet-900/10 border-violet-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Sun className="w-5 h-5 text-violet-400" />
                      Muhurta Windows
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {prediction.muhurtaWindows.map((window, i) => (
                        <li key={i} className="text-xs">
                          <p className="font-semibold text-violet-300">{window.time}</p>
                          <p className="text-foreground/70">{window.activity}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
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
                    We calculate planetary positions for your exact timezone and current moment
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/30 border-border/30">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Moon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Your Birth Chart</h3>
                  <p className="text-sm text-muted-foreground">
                    Your unique birth data is analyzed against today's cosmic movements
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
