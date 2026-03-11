"use client"

import React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { StarField } from "@/components/star-field"
import { ChevronDown, Calendar, Clock, MapPin, Heart, Briefcase, Brain, Sparkles, Timer, Users, Flame, Target, Hash, Type } from "lucide-react"
import { generateChartInsights, type ChartInsights } from "@/lib/astrology-insights"
import { createClient } from "@/lib/supabase/client"
import { ChartWheel } from "@/components/chart-wheel"
import * as numerology from "@/lib/numerology"
import { ChineseZodiacCard } from "@/components/chinese-zodiac-card"
import { calculateLagnaAndMoonNakshatra, type NakshatraResult } from "@/lib/nakshatra-lagna"

const zodiacSymbols: Record<string, string> = {
  'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
  'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
  'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
}

const strengthColors: Record<string, string> = {
  'exalted': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'own': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'friendly': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'neutral': 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  'enemy': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'debilitated': 'bg-red-500/20 text-red-300 border-red-500/30'
}

const strengthLabels: Record<string, string> = {
  'exalted': 'Exalted',
  'own': 'Own Sign',
  'friendly': 'Friendly',
  'neutral': 'Neutral',
  'enemy': 'Enemy Sign',
  'debilitated': 'Debilitated'
}

function SectionWrapper({ 
  children, 
  title, 
  icon: Icon, 
  defaultOpen = false 
}: { 
  children: React.ReactNode
  title: string
  icon: React.ElementType
  defaultOpen?: boolean 
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <motion.div
          className="w-full cursor-pointer"
          whileHover={{ scale: 1.005 }}
          whileTap={{ scale: 0.995 }}
        >
          <Card className="bg-card/50 border-border/50 backdrop-blur-sm hover:bg-card/70 transition-all">
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-lg font-medium">{title}</CardTitle>
              </div>
              <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </CardHeader>
          </Card>
        </motion.div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-2"
        >
          {children}
        </motion.div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function QuoteCard({ quote }: { quote: string }) {
  return (
    <div className="relative p-6 rounded-xl bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 border border-primary/20">
      <div className="absolute top-2 left-4 text-4xl text-primary/30">"</div>
      <p className="text-lg italic text-foreground/90 pl-6">{quote}</p>
      <div className="absolute bottom-2 right-4 text-4xl text-primary/30">"</div>
    </div>
  )
}

export default function ProfileInsightsPage() {
  const [insights, setInsights] = useState<ChartInsights | null>(null)
  const [loading, setLoading] = useState(true)
  const [numerologyData, setNumerologyData] = useState<any>(null)
  const [birthYear, setBirthYear] = useState<number | null>(null)
  const [lagnaAndMoon, setLagnaAndMoon] = useState<{ lagna: NakshatraResult; moon: NakshatraResult } | null>(null)

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (profile) {
          try {
            // Extract birth year if available
            if (profile.birth_date) {
              const year = new Date(profile.birth_date).getFullYear()
              setBirthYear(year)
            }

            // Calculate Lagna and Moon Nakshatra
            if (profile.birth_date && profile.birth_time && profile.birth_location) {
              try {
                const [year, month, day] = profile.birth_date.split('-').map(Number)
                const [hour, minute, second] = (profile.birth_time + ':0').split(':').map(Number)
                // Default UTC offset for now (user would need to provide timezone)
                const utcOffset = 0
                
                const result = calculateLagnaAndMoonNakshatra({
                  year,
                  month,
                  day,
                  hour: hour || 12,
                  minute: minute || 0,
                  second: second || 0,
                  lat: profile.birth_location_latitude || 0,
                  lon: profile.birth_location_longitude || 0,
                  utcOffset
                })
                
                setLagnaAndMoon({
                  lagna: result.lagna,
                  moon: result.moon
                })
              } catch (err) {
                console.error('[v0] Error calculating lagna and moon nakshatra:', err)
              }
            }

            // Generate insights even with partial data - use defaults if needed
            const chartInsights = await generateChartInsights(
              profile.birth_date || '1990-01-01',
              profile.birth_time || '12:00',
              profile.birth_location || 'Unknown',
              profile.moon_sign || 'Taurus',
              profile.sun_sign || 'Aries',
              profile.rising_sign || 'Leo',
              profile.nakshatra || 1
            )
            setInsights(chartInsights)

            // Calculate numerology if we have name and birth date
            if (profile.first_name && profile.birth_date) {
              const fullName = `${profile.first_name} ${profile.last_name || ''}`
              const moolAnk = numerology.calculateMoolAnk(profile.birth_date)
              const lifePath = numerology.calculateLifePath(profile.birth_date)
              const destinyNumber = numerology.calculateDestinyNumber(fullName)
              const personalityNumber = numerology.calculatePersonalityNumber(fullName)
              const soulUrge = numerology.calculateSoulUrge(fullName)
              const maturityNumber = numerology.calculateMaturityNumber(moolAnk, destinyNumber)
              const personalYear = numerology.calculatePersonalYear(profile.birth_date)
              const cornerstone = numerology.getCornerstone(profile.first_name)
              const capstone = numerology.getCapstone(profile.last_name || profile.first_name)
              const balance = numerology.analyzeBalance(fullName)

              setNumerologyData({
                moolAnk,
                lifePath,
                destinyNumber,
                personalityNumber,
                soulUrge,
                maturityNumber,
                personalYear,
                cornerstone,
                capstone,
                balance,
                fullName
              })
            }
          } catch (err) {
            console.error("[v0] Error generating insights:", err)
          }
        }
      }
      setLoading(false)
    }
    loadProfile()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Calculating your cosmic blueprint...</p>
        </div>
      </div>
    )
  }

  if (!insights || !insights.birthDetails) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h2 className="text-2xl font-bold mb-4">Complete Your Profile</h2>
          <p className="text-muted-foreground mb-6">
            To see your cosmic insights, please complete the onboarding process with your birth date, time, and location.
          </p>
          <a 
            href="/onboarding" 
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Complete Onboarding
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative">
      <StarField />
      
      <div className="relative z-10 container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Your Cosmic Blueprint
          </h1>
          <p className="text-muted-foreground text-lg">A deep dive into who you really are</p>
        </motion.div>

        {/* Birth Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-br from-card via-card/80 to-card/60 border-primary/20">
            <CardContent className="p-6">
              <div className="flex flex-wrap justify-center gap-6 md:gap-12">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>{insights.birthDetails.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>{insights.birthDetails.time}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>{insights.birthDetails.location}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Chart Wheel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <ChartWheel 
            lagna={insights.coreIdentity.lagna.sign}
            planets={insights.planetaryPlacements}
          />
        </motion.div>

        {/* Chinese Zodiac */}
        {birthYear && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-8"
          >
            <ChineseZodiacCard birthYear={birthYear} />
          </motion.div>
        )}

        <div className="space-y-4">
          {/* Core Identity */}
          <SectionWrapper title="Core Identity - The Big Three" icon={Sparkles} defaultOpen={true}>
            <div className="space-y-6">
              {/* Lagna */}
              <Card className="bg-card/30 border-border/30">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{zodiacSymbols[insights.coreIdentity.lagna.sign]}</span>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Lagna (Ascendant): {insights.coreIdentity.lagna.sign}
                      </CardTitle>
                      <p className="text-primary font-medium">"{insights.coreIdentity.lagna.tagline}"</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {insights.coreIdentity.lagna.description.map((para, i) => (
                    <p key={i} className="text-foreground/80 leading-relaxed">{para}</p>
                  ))}
                </CardContent>
              </Card>

              {/* Sun Sign */}
              <Card className="bg-card/30 border-border/30">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{zodiacSymbols[insights.coreIdentity.sunSign.sign]}</span>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Sun Sign: {insights.coreIdentity.sunSign.sign}
                      </CardTitle>
                      <p className="text-primary font-medium">"{insights.coreIdentity.sunSign.tagline}"</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {insights.coreIdentity.sunSign.description.map((para, i) => (
                    <p key={i} className="text-foreground/80 leading-relaxed">{para}</p>
                  ))}
                </CardContent>
              </Card>

              {/* Moon Sign */}
              <Card className="bg-card/30 border-border/30">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{zodiacSymbols[insights.coreIdentity.moonSign.sign]}</span>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Moon Sign: {insights.coreIdentity.moonSign.sign}
                      </CardTitle>
                      <p className="text-primary font-medium">"{insights.coreIdentity.moonSign.tagline}"</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {insights.coreIdentity.moonSign.description.map((para, i) => (
                    <p key={i} className="text-foreground/80 leading-relaxed">{para}</p>
                  ))}
                </CardContent>
              </Card>
            </div>
          </SectionWrapper>

          {/* Planetary Placements */}
          <SectionWrapper title="Planetary Placements" icon={Target}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {insights.planetaryPlacements.map((planet, i) => (
                <Card key={i} className="bg-card/30 border-border/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-lg">{planet.planet}</h4>
                      <Badge className={strengthColors[planet.strength]}>
                        {strengthLabels[planet.strength]}
                      </Badge>
                    </div>
                    <p className="text-primary text-sm mb-2">
                      {zodiacSymbols[planet.sign]} {planet.sign} • House {planet.house}
                    </p>
                    <Progress 
                      value={
                        planet.strength === 'exalted' ? 100 :
                        planet.strength === 'own' ? 85 :
                        planet.strength === 'friendly' ? 70 :
                        planet.strength === 'neutral' ? 50 :
                        planet.strength === 'enemy' ? 30 : 15
                      } 
                      className="h-1 mb-3"
                    />
                    <p className="text-sm text-foreground/70">{planet.interpretation}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </SectionWrapper>

          {/* Ascendant & Moon Nakshatra */}
          {lagnaAndMoon && (
            <SectionWrapper title="Ascendant & Moon Nakshatra" icon={Sparkles}>
              <div className="space-y-6">
                {/* Lagna/Ascendant Nakshatra */}
                <Card className="bg-card/30 border-border/30">
                  <CardHeader>
                    <CardTitle className="text-xl mb-4">Ascendant Nakshatra (Lagna)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-muted-foreground text-sm mb-1">Nakshatra</p>
                        <p className="font-bold text-lg">{lagnaAndMoon.lagna.name} — Pada {lagnaAndMoon.lagna.pada}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm mb-1">Lord</p>
                        <Badge className="bg-primary/20 text-primary">{lagnaAndMoon.lagna.lord}</Badge>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm mb-1">Symbol</p>
                        <p className="font-semibold text-sm">{lagnaAndMoon.lagna.symbol}</p>
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <p className="text-muted-foreground text-sm mb-1">Rashi</p>
                        <p className="font-semibold">{lagnaAndMoon.lagna.rashi} · {lagnaAndMoon.lagna.rashiEnglish}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm mb-1">Quality</p>
                        <p className="text-sm italic text-primary/90">{lagnaAndMoon.lagna.quality}</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-border/30">
                      <p className="text-foreground/80 leading-relaxed">{lagnaAndMoon.lagna.meaning}</p>
                    </div>
                    <div className="pt-2 text-sm text-muted-foreground italic">
                      <p>{lagnaAndMoon.lagna.rashiMeaning}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Moon Nakshatra */}
                <Card className="bg-card/30 border-border/30">
                  <CardHeader>
                    <CardTitle className="text-xl mb-4">Moon Nakshatra</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-muted-foreground text-sm mb-1">Nakshatra</p>
                        <p className="font-bold text-lg">{lagnaAndMoon.moon.name} — Pada {lagnaAndMoon.moon.pada}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm mb-1">Lord</p>
                        <Badge className="bg-accent/20 text-accent">{lagnaAndMoon.moon.lord}</Badge>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm mb-1">Symbol</p>
                        <p className="font-semibold text-sm">{lagnaAndMoon.moon.symbol}</p>
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <p className="text-muted-foreground text-sm mb-1">Rashi</p>
                        <p className="font-semibold">{lagnaAndMoon.moon.rashi} · {lagnaAndMoon.moon.rashiEnglish}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm mb-1">Quality</p>
                        <p className="text-sm italic text-accent/90">{lagnaAndMoon.moon.quality}</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-border/30">
                      <p className="text-foreground/80 leading-relaxed">{lagnaAndMoon.moon.meaning}</p>
                    </div>
                    <div className="pt-2 text-sm text-muted-foreground italic">
                      <p>{lagnaAndMoon.moon.rashiMeaning}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Emotional Blueprint Section */}
                <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Heart className="w-5 h-5 text-accent" />
                      Emotional Blueprint
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground/80 leading-relaxed">
                      Your Moon sign ({lagnaAndMoon.moon.rashi}) combined with your Nakshatra ({lagnaAndMoon.moon.name}) creates your unique emotional fingerprint. This is where your true instincts live - away from the mask you show the world.
                    </p>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-accent mb-2">Emotional Nature</h4>
                        <p className="text-foreground/70">
                          Your {lagnaAndMoon.moon.rashi} Moon makes you someone who processes feelings through {lagnaAndMoon.moon.quality}. You find emotional security in {lagnaAndMoon.moon.meaning.split('.')[0].toLowerCase()}, and your instinctive responses guide you more than logic alone.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-accent mb-2">Intuition & Inner Motivations</h4>
                        <p className="text-foreground/70">
                          The {lagnaAndMoon.moon.name} nakshatra gives your Moon its specific coloring. Your intuition is strongest when you {lagnaAndMoon.moon.quality.toLowerCase()}. You're drawn to situations and people that trigger your {lagnaAndMoon.moon.symbol} energy.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-accent mb-2">Emotional Needs</h4>
                        <p className="text-foreground/70">
                          To feel emotionally fulfilled, you need {lagnaAndMoon.moon.meaning.toLowerCase()}. Your past conditioning (including childhood patterns) has shaped these needs. Understanding this helps you honor your emotional complexity rather than fight it.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Ascendant Deep Dive */}
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Ascendant Energy & Life Approach
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground/80 leading-relaxed">
                      Your Ascendant ({lagnaAndMoon.lagna.rashi}) in {lagnaAndMoon.lagna.name} nakshatra determines how you show up in the world and approach life's challenges.
                    </p>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-primary mb-2">Outward Personality</h4>
                        <p className="text-foreground/70">
                          People see you as someone embodying {lagnaAndMoon.lagna.quality}. Your natural approach to life involves {lagnaAndMoon.lagna.meaning.split('.')[0].toLowerCase()}. This is the energy you project before anyone knows your deeper layers.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary mb-2">Life Orientation</h4>
                        <p className="text-foreground/70">
                          With your {lagnaAndMoon.lagna.name} Ascendant, your fundamental approach to life is guided by the {lagnaAndMoon.lagna.symbol} energy. You're learning lessons through experiencing {lagnaAndMoon.lagna.quality.toLowerCase()} situations and finding your unique expression within that archetype.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary mb-2">Natural Strengths</h4>
                        <p className="text-foreground/70">
                          Your greatest gifts in this lifetime center around {lagnaAndMoon.lagna.meaning.toLowerCase()}. You naturally attract situations that develop these strengths. Leaning into your Ascendant's nature, rather than fighting it, opens many doors.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Planetary Influences Section */}
                <Card className="bg-card/30 border-border/30">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Flame className="w-5 h-5 text-orange-400" />
                      Planetary Forces Shaping Your Life
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-foreground/80 leading-relaxed">
                      Each planet in your chart carries a specific energy and intention. Their placements determine your natural drives, talents, and life themes.
                    </p>
                    <div className="space-y-4">
                      {insights.planetaryPlacements.slice(0, 7).map((planet, i) => (
                        <div key={i} className="p-4 rounded-lg bg-card/40 border border-border/20">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold capitalize">{planet.planet}</h4>
                            <Badge className={strengthColors[planet.strength]}>
                              {strengthLabels[planet.strength]}
                            </Badge>
                          </div>
                          <p className="text-sm text-foreground/70 mb-2">
                            <span className="font-medium">{planet.sign}</span> in House {planet.house}
                          </p>
                          <p className="text-foreground/80 leading-relaxed">{planet.interpretation}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Mars Energy & Manglik Dosha */}
                <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Flame className="w-5 h-5 text-red-400" />
                      Mars Energy & Passion Intensity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground/80 leading-relaxed">
                      Mars represents your drive, passion, and assertiveness. In Vedic astrology, Mars in certain houses (1st, 2nd, 4th, 7th, 8th, 12th) creates Manglik Dosha—a powerful influence on relationships and life intensity.
                    </p>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-red-300 mb-2">Mars Influence</h4>
                        <p className="text-foreground/70">
                          Your Mars placement suggests {insights.planetaryPlacements.find(p => p.planet === 'Mars')?.interpretation || 'strong willpower and determination'}. This energy fuels your passion, ambition, and competitive drive. Harness it constructively and you're unstoppable; suppressed, it becomes frustration.
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                        <p className="text-sm text-foreground/80">
                          <span className="font-semibold text-red-300">Note:</span> If Mars is in house 1, 2, 4, 7, 8, or 12, you may be Manglik. This intensifies passion and relationship dynamics but also indicates deep transformative capacity through love.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Navamsha (D9) Destiny Layer */}
                <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Target className="w-5 h-5 text-purple-400" />
                      Your Deeper Destiny (Navamsha)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground/80 leading-relaxed">
                      The Navamsha chart (D9) is the microscopic view of your soul's evolution and karmic maturity. While your birth chart shows the "promise," Navamsha reveals the "fruit"—how deep and lasting your relationships truly become.
                    </p>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-purple-300 mb-2">Navamsha Lagna (Your Soul Orientation)</h4>
                        <p className="text-foreground/70">
                          This layer shows your soul's maturity and the deeper version of who you're becoming. It represents your refined, evolved self—the wisdom you're integrating across lifetimes.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-300 mb-2">Relationship Depth & Longevity</h4>
                        <p className="text-foreground/70">
                          Your Navamsha strongly influences marriage longevity and depth. A strong Venus and 7th lord here indicates soulmate potential—partnerships that transcend this lifetime. Weak placements suggest relationships serve karmic learning rather than permanence.
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                        <p className="text-sm text-foreground/80">
                          <span className="font-semibold text-purple-300">Key Truth:</span> The Navamsha reveals whether a connection is temporary growth or eternal bond. Use it to understand not just WHO you attract, but WHAT that relationship teaches your soul.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Personal Summary & Synthesis */}
                <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-accent/30">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Users className="w-5 h-5 text-accent" />
                      Your Cosmic Blueprint: Synthesis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground/80 leading-relaxed">
                      You are a unique constellation of energies. Your Ascendant is your life mission; your Moon is your emotional truth; your planetary placements are your karmic toolkit. Together, they tell a story of who you came here to become.
                    </p>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                        <h4 className="font-semibold text-accent mb-2">Your Natural Talents</h4>
                        <p className="text-foreground/70">
                          {lagnaAndMoon.lagna.meaning} combined with your {lagnaAndMoon.moon.rashi} emotional nature creates someone uniquely skilled at {lagnaAndMoon.lagna.quality.toLowerCase()}. Your talents are not random—they're your soul's fingerprint designed for this lifetime's lessons.
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                        <h4 className="font-semibold text-accent mb-2">Your Psychological Landscape</h4>
                        <p className="text-foreground/70">
                          You navigate the world as a {lagnaAndMoon.lagna.name} Ascendant (outwardly), yet feel deeply through your {lagnaAndMoon.moon.name} Moon (inwardly). This can create internal tension if you suppress your emotional nature or vice versa. Integration is key—be the warrior outside, the mystic inside.
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                        <h4 className="font-semibold text-accent mb-2">Your Karmic Growth Areas</h4>
                        <p className="text-foreground/70">
                          Saturn in your chart points to lifelong mastery areas. Mars teaches assertiveness. Venus teaches surrender. These aren't problems—they're your soul's curriculum. Lean into them rather than avoid them, and you unlock your greatest power.
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                        <h4 className="font-semibold text-accent mb-2">Your Life Direction</h4>
                        <p className="text-foreground/70">
                          You are here to master the lessons encoded in your Ascendant, to honor the depth in your Moon, and to express the full spectrum of your planetary gifts. Every relationship, every failure, every success—all of it's steering you toward your highest self. Trust the timing of your life.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </SectionWrapper>
          )}

          {/* Love & Relationships */}
          <SectionWrapper title="Love & Relationships" icon={Heart}>
            <Card className="bg-card/30 border-border/30">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h4 className="font-bold text-lg mb-3 text-primary">Attraction Themes</h4>
                  <div className="flex flex-wrap gap-2">
                    {insights.loveAndRelationships.attractionThemes.map((theme, i) => (
                      <Badge key={i} variant="outline" className="bg-accent/10">{theme}</Badge>
                    ))}
                  </div>
                </div>

                <QuoteCard quote={insights.loveAndRelationships.venusAnalysis} />

                <div>
                  <h4 className="font-bold text-lg mb-3 text-primary">7th House Analysis</h4>
                  <p className="text-foreground/80">{insights.loveAndRelationships.seventhHouse}</p>
                </div>

                <div>
                  <h4 className="font-bold text-lg mb-3 text-primary">Your Attachment Style</h4>
                  <p className="text-foreground/80">{insights.loveAndRelationships.attachmentStyle}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-lg mb-3 text-red-400">Red Flags You Attract</h4>
                    <ul className="space-y-2">
                      {insights.loveAndRelationships.redFlags.map((flag, i) => (
                        <li key={i} className="flex items-start gap-2 text-foreground/80">
                          <span className="text-red-400 mt-1">•</span>
                          {flag}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-3 text-emerald-400">Soulmate Traits</h4>
                    <ul className="space-y-2">
                      {insights.loveAndRelationships.soulmateTraits.map((trait, i) => (
                        <li key={i} className="flex items-start gap-2 text-foreground/80">
                          <span className="text-emerald-400 mt-1">•</span>
                          {trait}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </SectionWrapper>

          {/* Marriage & Timing */}
          <SectionWrapper title="Marriage & Timing" icon={Timer}>
            <Card className="bg-card/30 border-border/30">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h4 className="font-bold text-lg mb-4 text-primary">Timeline</h4>
                  <div className="space-y-3">
                    {insights.marriageAndTiming.karmicPeriods.map((period, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                        <span className="font-mono text-orange-300">{period.period}</span>
                        <span className="text-foreground/80">{period.warning}</span>
                      </div>
                    ))}
                    {insights.marriageAndTiming.primeWindows.map((window, i) => (
                      <div 
                        key={i} 
                        className={`flex items-center gap-4 p-3 rounded-lg ${
                          window.highlight 
                            ? 'bg-emerald-500/10 border border-emerald-500/20' 
                            : 'bg-card/50 border border-border/30'
                        }`}
                      >
                        <span className={`font-mono ${window.highlight ? 'text-emerald-300' : 'text-foreground/60'}`}>
                          {window.period}
                        </span>
                        <span className="text-foreground/80">
                          {window.highlight ? 'Prime commitment window' : 'Favorable for relationships'}
                        </span>
                        {window.highlight && <Badge className="bg-emerald-500/20 text-emerald-300">Highlighted</Badge>}
                      </div>
                    ))}
                  </div>
                </div>

                <QuoteCard quote={insights.marriageAndTiming.partnerProfile} />

                <div>
                  <h4 className="font-bold text-lg mb-3 text-primary">Dasha Periods</h4>
                  <ul className="space-y-2">
                    {insights.marriageAndTiming.dashaPeriods.map((period, i) => (
                      <li key={i} className="flex items-start gap-2 text-foreground/80">
                        <span className="text-primary mt-1">•</span>
                        {period}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </SectionWrapper>

          {/* Career & Purpose */}
          <SectionWrapper title="Career & Life Purpose" icon={Briefcase}>
            <Card className="bg-card/30 border-border/30">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h4 className="font-bold text-lg mb-3 text-primary">10th House Analysis</h4>
                  <p className="text-foreground/80">{insights.careerAndPurpose.tenthHouseAnalysis}</p>
                </div>

                <div>
                  <h4 className="font-bold text-lg mb-3 text-primary">Best Career Fields</h4>
                  <div className="flex flex-wrap gap-2">
                    {insights.careerAndPurpose.bestCareerFields.map((field, i) => (
                      <Badge key={i} className="bg-primary/10 text-primary border-primary/20">{field}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-lg mb-4 text-primary">Career Timeline</h4>
                  <div className="space-y-3">
                    {insights.careerAndPurpose.careerTimeline.map((item, i) => (
                      <div key={i} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 p-3 rounded-lg bg-card/50 border border-border/30">
                        <span className="font-mono text-primary shrink-0">{item.period}</span>
                        <span className="text-foreground/80">{item.description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-lg mb-3 text-primary">Money Houses Analysis</h4>
                  <p className="text-foreground/80">{insights.careerAndPurpose.moneyHousesAnalysis}</p>
                </div>
              </CardContent>
            </Card>
          </SectionWrapper>

          {/* Personality Deep Dive */}
          <SectionWrapper title="Personality Deep Dive" icon={Brain}>
            <Card className="bg-card/30 border-border/30">
              <CardContent className="p-6 space-y-6">
                <p className="text-muted-foreground italic">The brutally honest section...</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-lg mb-3 text-primary">Core Contradictions</h4>
                    <ul className="space-y-2">
                      {insights.personalityDeepDive.coreContradictions.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-foreground/80">
                          <span className="text-accent mt-1">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-3 text-primary">Emotional Patterns</h4>
                    <ul className="space-y-2">
                      {insights.personalityDeepDive.emotionalPatterns.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-foreground/80">
                          <span className="text-accent mt-1">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-3 text-red-400">What Triggers You</h4>
                    <ul className="space-y-2">
                      {insights.personalityDeepDive.triggers.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-foreground/80">
                          <span className="text-red-400 mt-1">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-3 text-primary">Behavioral Tendencies</h4>
                    <ul className="space-y-2">
                      {insights.personalityDeepDive.behavioralTendencies.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-foreground/80">
                          <span className="text-primary mt-1">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </SectionWrapper>

          {/* Karmic Lessons */}
          <SectionWrapper title="Karmic Lessons" icon={Sparkles}>
            <Card className="bg-card/30 border-border/30">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h4 className="font-bold text-lg mb-3 text-primary">Current Life Lessons</h4>
                  <div className="flex flex-wrap gap-2">
                    {insights.karmicLessons.currentLessons.map((lesson, i) => (
                      <Badge key={i} variant="outline" className="bg-accent/10 py-2">{lesson}</Badge>
                    ))}
                  </div>
                </div>

                <QuoteCard quote={insights.karmicLessons.learningThisLifetime} />

                <div>
                  <h4 className="font-bold text-lg mb-3 text-primary">Past Life Influences</h4>
                  <p className="text-foreground/80">{insights.karmicLessons.pastLifeInfluences}</p>
                </div>

                <div>
                  <h4 className="font-bold text-lg mb-3 text-primary">Soul Evolution Path</h4>
                  <p className="text-foreground/80">{insights.karmicLessons.soulEvolutionPath}</p>
                </div>
              </CardContent>
            </Card>
          </SectionWrapper>

          {/* Why People Get Obsessed */}
          <SectionWrapper title="Why People Get Obsessed" icon={Flame}>
            <Card className="bg-card/30 border-border/30">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h4 className="font-bold text-lg mb-3 text-primary">Your Magnetic Qualities</h4>
                  <div className="flex flex-wrap gap-2">
                    {insights.magneticQualities.qualities.map((quality, i) => (
                      <Badge key={i} className="bg-accent/10 text-accent border-accent/20 py-2">{quality}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-lg mb-3 text-primary">How You Affect Others</h4>
                  <p className="text-foreground/80">{insights.magneticQualities.howTheyAffectOthers}</p>
                </div>

                <QuoteCard quote={insights.magneticQualities.oneThatGotAwayEnergy} />
              </CardContent>
            </Card>
          </SectionWrapper>

          {/* Timing & Predictions */}
          <SectionWrapper title="Timing & Predictions" icon={Timer}>
            <Card className="bg-card/30 border-border/30">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h4 className="font-bold text-lg mb-3 text-primary">Current Dasha</h4>
                  <p className="text-foreground/80">{insights.timingPredictions.currentDasha}</p>
                </div>

                <div>
                  <h4 className="font-bold text-lg mb-3 text-primary">Upcoming Transits</h4>
                  <ul className="space-y-2">
                    {insights.timingPredictions.upcomingTransits.map((transit, i) => (
                      <li key={i} className="flex items-start gap-2 text-foreground/80">
                        <span className="text-primary mt-1">•</span>
                        {transit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-lg mb-4 text-primary">Best Years For...</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {insights.timingPredictions.bestYearsFor.map((item, i) => (
                      <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-card/50 border border-border/30">
                        <span className="text-foreground/80">{item.category}</span>
                        <span className="font-mono text-primary">{item.years}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-lg mb-3 text-orange-400">Years to Watch</h4>
                  <div className="space-y-2">
                    {insights.timingPredictions.yearsToWatch.map((year, i) => (
                      <div key={i} className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-foreground/80">
                        {year}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </SectionWrapper>

          {/* Compatibility Insights */}
          <SectionWrapper title="Compatibility Insights" icon={Users}>
            <Card className="bg-card/30 border-border/30">
              <CardContent className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-lg mb-3 text-emerald-400">Best Matches</h4>
                    <ul className="space-y-2">
                      {insights.compatibilityInsights.bestMatches.map((match, i) => (
                        <li key={i} className="flex items-start gap-2 text-foreground/80">
                          <span className="text-emerald-400 mt-1">•</span>
                          {match}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-3 text-orange-400">Challenging Matches</h4>
                    <ul className="space-y-2">
                      {insights.compatibilityInsights.challengingMatches.map((match, i) => (
                        <li key={i} className="flex items-start gap-2 text-foreground/80">
                          <span className="text-orange-400 mt-1">•</span>
                          {match}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-lg mb-3 text-primary">Element Affinity</h4>
                  <div className="flex flex-wrap gap-2">
                    {insights.compatibilityInsights.elementAffinity.map((element, i) => (
                      <Badge key={i} variant="outline" className="bg-primary/10 py-2">{element}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </SectionWrapper>

          {/* Numerology & Destiny Numbers */}
          {numerologyData && (
            <SectionWrapper title="Numerology & Destiny Numbers" icon={Hash}>
              <Card className="bg-card/30 border-border/30">
                <CardContent className="p-6 space-y-8">
                  {/* Mool Ank and Life Path - Side by Side */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Mool Ank */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/30">
                      <div className="text-center mb-4">
                        <div className="text-6xl font-bold text-primary mb-2">{numerologyData.moolAnk}</div>
                        <h4 className="text-xl font-bold text-primary">Mool Ank</h4>
                        <p className="text-sm text-muted-foreground">Birth Day Number</p>
                      </div>
                      <div className="space-y-3 text-sm">
                        <p className="text-foreground/80">Your natural birth day talents and instant personality</p>
                        {numerology.numberMeanings[numerologyData.moolAnk] && (
                          <>
                            <div>
                              <span className="text-primary font-semibold">Traits: </span>
                              <span className="text-foreground/80">{numerology.numberMeanings[numerologyData.moolAnk].traits}</span>
                            </div>
                            <div>
                              <span className="text-emerald-400 font-semibold">Strengths: </span>
                              <span className="text-foreground/80">{numerology.numberMeanings[numerologyData.moolAnk].strengths}</span>
                            </div>
                            <div>
                              <span className="text-orange-400 font-semibold">Love Style: </span>
                              <span className="text-foreground/80">{numerology.numberMeanings[numerologyData.moolAnk].love}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Life Path */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-accent/20 to-primary/10 border border-accent/30">
                      <div className="text-center mb-4">
                        <div className="text-6xl font-bold text-accent mb-2">{numerologyData.lifePath}</div>
                        <h4 className="text-xl font-bold text-accent">Life Path</h4>
                        <p className="text-sm text-muted-foreground">Complete Life Journey</p>
                      </div>
                      <div className="space-y-3 text-sm">
                        <p className="text-foreground/80">Your overall destiny and long-term life purpose</p>
                        {numerology.numberMeanings[numerologyData.lifePath] && (
                          <>
                            <div>
                              <span className="text-accent font-semibold">Traits: </span>
                              <span className="text-foreground/80">{numerology.numberMeanings[numerologyData.lifePath].traits}</span>
                            </div>
                            <div>
                              <span className="text-emerald-400 font-semibold">Career Path: </span>
                              <span className="text-foreground/80">{numerology.numberMeanings[numerologyData.lifePath].career}</span>
                            </div>
                            <div>
                              <span className="text-orange-400 font-semibold">Challenges: </span>
                              <span className="text-foreground/80">{numerology.numberMeanings[numerologyData.lifePath].challenges}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Combined Insight */}
                  <QuoteCard 
                    quote={`Your birth day energy (${numerologyData.moolAnk}) shows your natural instincts, while your life path (${numerologyData.lifePath}) reveals where you're destined to go. Together, they create your unique cosmic blueprint.`}
                  />

                  {/* Other Core Numbers */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-card/50 border border-border/50">
                      <div className="text-3xl font-bold text-center text-primary mb-2">{numerologyData.destinyNumber}</div>
                      <h5 className="font-semibold text-center mb-1">Destiny Number</h5>
                      <p className="text-xs text-center text-muted-foreground">Your natural talents</p>
                    </div>
                    <div className="p-4 rounded-lg bg-card/50 border border-border/50">
                      <div className="text-3xl font-bold text-center text-primary mb-2">{numerologyData.personalityNumber}</div>
                      <h5 className="font-semibold text-center mb-1">Personality</h5>
                      <p className="text-xs text-center text-muted-foreground">How others see you</p>
                    </div>
                    <div className="p-4 rounded-lg bg-card/50 border border-border/50">
                      <div className="text-3xl font-bold text-center text-primary mb-2">{numerologyData.soulUrge}</div>
                      <h5 className="font-semibold text-center mb-1">Soul Urge</h5>
                      <p className="text-xs text-center text-muted-foreground">What motivates you</p>
                    </div>
                  </div>

                  {/* Maturity & Personal Year */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-card/50 border border-border/50">
                      <div className="text-4xl font-bold text-center text-primary mb-2">{numerologyData.maturityNumber}</div>
                      <h5 className="font-semibold text-center mb-1">Maturity Number</h5>
                      <p className="text-xs text-center text-muted-foreground mb-3">Who you become through life</p>
                      {numerology.numberMeanings[numerologyData.maturityNumber] && (
                        <p className="text-sm text-center text-foreground/70">{numerology.numberMeanings[numerologyData.maturityNumber].traits}</p>
                      )}
                    </div>
                    <div className="p-4 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30">
                      <div className="text-4xl font-bold text-center text-primary mb-2">{numerologyData.personalYear}</div>
                      <h5 className="font-semibold text-center mb-1">Personal Year {new Date().getFullYear()}</h5>
                      <p className="text-xs text-center text-muted-foreground">Your year theme</p>
                    </div>
                  </div>

                  {/* Lucky Elements */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-lg text-primary">Lucky Elements (Based on Mool Ank {numerologyData.moolAnk})</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-semibold mb-2 text-muted-foreground">Lucky Numbers</p>
                        <div className="flex flex-wrap gap-2">
                          {numerology.getLuckyNumbers(numerologyData.moolAnk).map((num, i) => (
                            <Badge key={i} variant="outline" className="bg-primary/10">{num}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-2 text-muted-foreground">Lucky Days</p>
                        <div className="flex flex-wrap gap-2">
                          {numerology.getLuckyDays(numerologyData.moolAnk).map((day, i) => (
                            <Badge key={i} variant="outline" className="bg-emerald-500/10 text-emerald-300">{day}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-2 text-muted-foreground">Lucky Colors</p>
                        <div className="flex flex-wrap gap-2">
                          {numerology.getLuckyColors(numerologyData.moolAnk).map((color, i) => (
                            <Badge key={i} variant="outline" className="bg-accent/10 text-accent">{color}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </SectionWrapper>
          )}

          {/* Letterology Analysis */}
          {numerologyData && (
            <SectionWrapper title="Letterology & Name Analysis" icon={Type}>
              <Card className="bg-card/30 border-border/30">
                <CardContent className="p-6 space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-primary mb-2">{numerologyData.fullName}</h3>
                    <p className="text-muted-foreground">Your name carries powerful vibrations</p>
                  </div>

                  {/* Cornerstone & Capstone */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/30">
                      <div className="text-center mb-4">
                        <div className="text-6xl font-bold text-primary mb-2">{numerologyData.cornerstone}</div>
                        <h4 className="text-xl font-bold">Cornerstone</h4>
                        <p className="text-sm text-muted-foreground">First Letter - Your Approach</p>
                      </div>
                      <p className="text-center text-foreground/80">{numerology.cornerstoneMeanings[numerologyData.cornerstone]}</p>
                    </div>

                    <div className="p-6 rounded-xl bg-gradient-to-br from-accent/20 to-primary/10 border border-accent/30">
                      <div className="text-center mb-4">
                        <div className="text-6xl font-bold text-accent mb-2">{numerologyData.capstone}</div>
                        <h4 className="text-xl font-bold">Capstone</h4>
                        <p className="text-sm text-muted-foreground">Last Letter - How You Finish</p>
                      </div>
                      <p className="text-center text-foreground/80">{numerology.capstoneMeanings[numerologyData.capstone]}</p>
                    </div>
                  </div>

                  {/* Vowel/Consonant Balance */}
                  <div className="p-6 rounded-xl bg-card/50 border border-border/50">
                    <h4 className="text-lg font-bold mb-4 text-center">Vowel & Consonant Balance</h4>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary">{numerologyData.balance.vowels}</div>
                        <p className="text-sm text-muted-foreground">Vowels</p>
                        <p className="text-xs text-foreground/60">Expressive</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-accent">{numerologyData.balance.consonants}</div>
                        <p className="text-sm text-muted-foreground">Consonants</p>
                        <p className="text-xs text-foreground/60">Practical</p>
                      </div>
                      <div className="text-center">
                        <Badge variant="outline" className="mt-2 bg-primary/10 text-lg">{numerologyData.balance.type}</Badge>
                      </div>
                    </div>
                    <p className="text-center text-sm text-foreground/80">
                      {numerologyData.balance.type === 'Vowel-Dominant' && 'You\'re expressive, outgoing, and emotional - a natural communicator with strong intuition.'}
                      {numerologyData.balance.type === 'Consonant-Dominant' && 'You\'re practical, grounded, and action-oriented - a realistic thinker who gets things done.'}
                      {numerologyData.balance.type === 'Balanced' && 'You have a well-rounded personality, balancing expression with action, intuition with logic.'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </SectionWrapper>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 text-muted-foreground"
        >
          <p>Your cosmic blueprint is unique. Use this knowledge for growth, not limitation.</p>
        </motion.div>
      </div>
    </div>
  )
}
