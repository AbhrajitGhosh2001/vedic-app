'use client'

import React from "react"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StarField } from '@/components/star-field'
import { ArrowLeft, Heart, Flame, Brain, Sparkles, AlertTriangle, Users, Target, MessageCircle } from 'lucide-react'
import { generateDeepCompatibility, type DeepCompatibilityAnalysis } from '@/lib/compatibility-engine'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import { ChineseZodiacCompatibility } from '@/components/chinese-zodiac-compatibility'

export default function DeepCompatibilityPage({ params }: { params: { user1: string; user2: string } }) {
  const router = useRouter()
  const [user1Data, setUser1Data] = useState<any>(null)
  const [user2Data, setUser2Data] = useState<any>(null)
  const [analysis, setAnalysis] = useState<DeepCompatibilityAnalysis | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()
      
      // Fetch both user profiles
      const [profile1, profile2] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', params.user1).single(),
        supabase.from('profiles').select('*').eq('id', params.user2).single()
      ])

      if (profile1.data && profile2.data) {
        setUser1Data(profile1.data)
        setUser2Data(profile2.data)
        
        // Generate deep compatibility analysis
        const compatAnalysis = await generateDeepCompatibility(profile1.data, profile2.data)
        setAnalysis(compatAnalysis)
      }
      
      setLoading(false)
    }
    
    loadData()
  }, [params])

  if (loading || !user1Data || !user2Data || !analysis) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">✨</div>
          <p className="text-muted-foreground">Analyzing cosmic compatibility...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative">
      <StarField />
      
      <div className="relative z-10 container max-w-5xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Header - Both Profiles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-[1fr,auto,1fr] gap-6 mb-12 items-center"
        >
          <ProfileCard profile={user1Data} />
          <Heart className="w-12 h-12 text-accent hidden md:block" />
          <ProfileCard profile={user2Data} />
        </motion.div>

        {/* Overall Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-br from-primary/20 to-accent/10 border-primary/30">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-light mb-4 text-primary uppercase tracking-wider">
                Cosmic Compatibility Match
              </h2>
              <div className="text-7xl font-bold text-primary mb-2">{analysis.overallScore}%</div>
              <p className="text-xl text-muted-foreground mb-6">{analysis.connectionType}</p>
              
              <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="p-4 rounded-lg bg-background/50">
                  <div className="text-sm text-muted-foreground mb-1">Vedic Guna Milan</div>
                  <div className="text-2xl font-bold text-primary">
                    {analysis.gunaMilan ? `${analysis.gunaMilan.totalScore}/36` : 'N/A'}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-background/50">
                  <div className="text-sm text-muted-foreground mb-1">Numerology Harmony</div>
                  <div className="text-2xl font-bold text-primary">{analysis.numerologyComparison.overallHarmony}%</div>
                </div>
                <div className="p-4 rounded-lg bg-background/50">
                  <div className="text-sm text-muted-foreground mb-1">Element Balance</div>
                  <div className="text-2xl font-bold text-primary">{analysis.overallScore}%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Love Styles Comparison */}
        <Section icon={Heart} title="Love Styles: How You Approach Relationships" delay={0.3}>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card className="bg-card/50 border-primary/30">
              <CardContent className="p-6">
                <h4 className="font-bold text-lg mb-3 text-primary">{user1Data.first_name}'s Energy</h4>
                <ul className="space-y-2 text-sm">
                  {analysis.sections.loveStyles.user1Traits.map((trait, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-foreground/80">{trait}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-accent/30">
              <CardContent className="p-6">
                <h4 className="font-bold text-lg mb-3 text-accent">{user2Data.first_name}'s Energy</h4>
                <ul className="space-y-2 text-sm">
                  {analysis.sections.loveStyles.user2Traits.map((trait, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span className="text-foreground/80">{trait}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-primary/10 border-primary/30">
            <CardContent className="p-6">
              <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                What Happens When You Interact
              </h4>
              <p className="text-foreground/80">{analysis.sections.loveStyles.dynamicDescription}</p>
            </CardContent>
          </Card>
        </Section>

        {/* Why There's Attraction */}
        <Section icon={Flame} title="Why You're Attracted (The Initial Spark)" delay={0.4}>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-accent/20 to-primary/10 border-accent/30">
              <CardContent className="p-6">
                <h4 className="font-bold text-lg mb-4 text-accent">What {user2Data.first_name} Sees In You</h4>
                <ul className="space-y-3">
                  {analysis.sections.attraction.whatHeSeesInYou.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-accent">→</span>
                      <span className="text-foreground/80">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/20 to-accent/10 border-primary/30">
              <CardContent className="p-6">
                <h4 className="font-bold text-lg mb-4 text-primary">What You See In {user2Data.first_name}</h4>
                <ul className="space-y-3">
                  {analysis.sections.attraction.whatYouSeeInHim.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-primary">→</span>
                      <span className="text-foreground/80">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card/50 border-border/30 mt-6">
            <CardContent className="p-6">
              <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Initial Chemistry
              </h4>
              <p className="text-foreground/80">{analysis.sections.attraction.initialChemistry}</p>
            </CardContent>
          </Card>
        </Section>

        {/* Where It Starts Cracking */}
        <Section icon={AlertTriangle} title="Where It Starts Cracking (The Real Tea)" delay={0.5}>
          <Card className="bg-orange-500/10 border-orange-500/30 mb-6">
            <CardContent className="p-6">
              <h4 className="font-bold text-lg mb-4 text-orange-400">Friction Points</h4>
              {analysis.sections.clashes.frictionPoints.length > 0 ? (
                <ul className="space-y-2">
                  {analysis.sections.clashes.frictionPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-orange-400 mt-1">⚡</span>
                      <span className="text-foreground/80">{point}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-foreground/80 text-sm">Minimal friction - you naturally flow together</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/30">
            <CardContent className="p-6">
              <h4 className="font-bold text-lg mb-3 text-primary">Emotional Labor Balance</h4>
              <p className="text-foreground/80 text-sm">{analysis.sections.clashes.emotionalLabor}</p>
            </CardContent>
          </Card>
        </Section>

        {/* Numerology Deep Dive */}
        <Section icon={Brain} title="Numerology Compatibility Breakdown" delay={0.6}>
          <div className="grid md:grid-cols-3 gap-4">
            <CompatibilityMetric
              title="Mool Ank Match"
              score={analysis.numerologyComparison.moolAnkMatch.score}
              description={analysis.numerologyComparison.moolAnkMatch.description}
            />
            <CompatibilityMetric
              title="Life Path Match"
              score={analysis.numerologyComparison.lifePathMatch.score}
              description={analysis.numerologyComparison.lifePathMatch.description}
            />
            <CompatibilityMetric
              title="Destiny Match"
              score={analysis.numerologyComparison.destinyMatch.score}
              description={analysis.numerologyComparison.destinyMatch.description}
            />
          </div>
        </Section>

        {/* Ideal Match Profiles */}
        <Section icon={Users} title="Who Actually Suits Each of You" delay={0.7}>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-card/50 border-border/30">
              <CardContent className="p-6">
                <h4 className="font-bold text-lg mb-4 text-primary">Ideal Match for {user1Data.first_name}</h4>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="font-semibold mb-2 text-muted-foreground">Compatible Numbers:</p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.sections.idealMatch1.compatibleNumbers.map((num, i) => (
                        <Badge key={i} variant="outline" className="bg-primary/10">{num}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold mb-2 text-muted-foreground">Qualities to Look For:</p>
                    <ul className="space-y-1">
                      {analysis.sections.idealMatch1.qualities.map((quality, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-primary">✓</span>
                          <span className="text-foreground/80">{quality}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/30">
              <CardContent className="p-6">
                <h4 className="font-bold text-lg mb-4 text-accent">Ideal Match for {user2Data.first_name}</h4>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="font-semibold mb-2 text-muted-foreground">Compatible Numbers:</p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.sections.idealMatch2.compatibleNumbers.map((num, i) => (
                        <Badge key={i} variant="outline" className="bg-accent/10">{num}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold mb-2 text-muted-foreground">Qualities to Look For:</p>
                    <ul className="space-y-1">
                      {analysis.sections.idealMatch2.qualities.map((quality, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-accent">✓</span>
                          <span className="text-foreground/80">{quality}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* Vedic Deep Dive */}
        <Section icon={Sparkles} title="Vedic Deep Dive: Graha Maitri & Marital Destiny" delay={0.65}>
          {/* Graha Maitri */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card className="bg-gradient-to-br from-primary/15 to-primary/5 border-primary/30">
              <CardContent className="p-6">
                <h4 className="font-bold text-lg mb-3 text-primary flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Planetary Compatibility (Graha Maitri)
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{user1Data.first_name}'s Planetary Lord</p>
                    <Badge className="bg-primary/20 text-primary">{analysis.sections.vedicDeepDive.grahaMatri.user1PlanetaryLord}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{user2Data.first_name}'s Planetary Lord</p>
                    <Badge className="bg-accent/20 text-accent">{analysis.sections.vedicDeepDive.grahaMatri.user2PlanetaryLord}</Badge>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10">
                    <p className="text-xs font-semibold text-primary mb-1">Relationship: {analysis.sections.vedicDeepDive.grahaMatri.relationship}</p>
                    <p className="text-sm text-foreground/80">{analysis.sections.vedicDeepDive.grahaMatri.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Manglik Dosha */}
            <Card className="bg-gradient-to-br from-red-500/15 to-red-500/5 border-red-500/30">
              <CardContent className="p-6">
                <h4 className="font-bold text-lg mb-3 text-red-400 flex items-center gap-2">
                  <Flame className="w-5 h-5" />
                  Manglik Dosha Comparison
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{user1Data.first_name}</span>
                    <Badge className={analysis.sections.vedicDeepDive.manglikComparison.user1Manglik ? 'bg-red-500/30 text-red-300' : 'bg-green-500/30 text-green-300'}>
                      {analysis.sections.vedicDeepDive.manglikComparison.user1Manglik ? 'Manglik' : 'Non-Manglik'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{user2Data.first_name}</span>
                    <Badge className={analysis.sections.vedicDeepDive.manglikComparison.user2Manglik ? 'bg-red-500/30 text-red-300' : 'bg-green-500/30 text-green-300'}>
                      {analysis.sections.vedicDeepDive.manglikComparison.user2Manglik ? 'Manglik' : 'Non-Manglik'}
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground/80 pt-2 border-t border-red-500/20">{analysis.sections.vedicDeepDive.manglikComparison.description}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Emotional Alignment */}
          <Card className="bg-gradient-to-br from-accent/15 to-accent/5 border-accent/30 mb-6">
            <CardContent className="p-6">
              <h4 className="font-bold text-lg mb-4 text-accent flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Emotional Alignment (Moon & Nakshatra)
              </h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Moon Signs</p>
                  <p className="text-lg font-semibold text-foreground">{analysis.sections.vedicDeepDive.emotionalAlignment.moonSigns}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Nakshatras</p>
                  <p className="text-lg font-semibold text-foreground">{analysis.sections.vedicDeepDive.emotionalAlignment.nakshatras}</p>
                </div>
              </div>
              <p className="text-foreground/80 mt-4 p-4 rounded-lg bg-background/50">{analysis.sections.vedicDeepDive.emotionalAlignment.emotionalCommunication}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Emotional Compatibility</span>
                <div className="text-lg font-bold text-accent">{analysis.sections.vedicDeepDive.emotionalAlignment.score}%</div>
              </div>
            </CardContent>
          </Card>

          {/* Navamsha Marriage Potential */}
          <Card className="bg-gradient-to-br from-purple-500/15 to-purple-500/5 border-purple-500/30 mb-6">
            <CardContent className="p-6">
              <h4 className="font-bold text-lg mb-4 text-purple-300 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Long-Term Marriage Potential (Navamsha)
              </h4>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-purple-300 mb-1">7th House Strength</p>
                  <p className="text-foreground/80">{analysis.sections.vedicDeepDive.navamshaMarriage.seventhHouseStrength}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-purple-300 mb-1">Venus & Jupiter Alignment</p>
                  <p className="text-foreground/80">{analysis.sections.vedicDeepDive.navamshaMarriage.venusJupiterAlignment}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-purple-300 mb-1">Marital Destiny</p>
                  <p className="text-foreground/80">{analysis.sections.vedicDeepDive.navamshaMarriage.maritalPotential}</p>
                </div>
                <div className="pt-4 border-t border-purple-500/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Marriage Potential Score</span>
                    <div className="text-lg font-bold text-purple-300">{analysis.sections.vedicDeepDive.navamshaMarriage.score}%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Relationship Narrative Summary */}
          <Card className="bg-gradient-to-br from-primary/20 to-accent/10 border-primary/30">
            <CardContent className="p-6">
              <h4 className="font-bold text-lg mb-4 text-primary">Your Vedic Relationship Narrative</h4>
              <div className="space-y-6">
                <div>
                  <h5 className="font-semibold text-accent mb-2">Emotional Dynamics</h5>
                  <p className="text-foreground/80">{analysis.sections.vedicDeepDive.relationshipNarrative.emotionalDynamics}</p>
                </div>
                <div>
                  <h5 className="font-semibold text-accent mb-2">Psychological Compatibility</h5>
                  <p className="text-foreground/80">{analysis.sections.vedicDeepDive.relationshipNarrative.psychologicalCompatibility}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold text-green-400 mb-2">Strengths</h5>
                    <ul className="space-y-2">
                      {analysis.sections.vedicDeepDive.relationshipNarrative.strengths.map((strength: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-green-400 mt-1">✓</span>
                          <span className="text-foreground/80">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-orange-400 mb-2">Challenges</h5>
                    <ul className="space-y-2">
                      {analysis.sections.vedicDeepDive.relationshipNarrative.challenges.map((challenge: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-orange-400 mt-1">→</span>
                          <span className="text-foreground/80">{challenge}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
                  <p className="text-sm text-muted-foreground mb-2">Vedic Compatibility Score</p>
                  <p className="text-3xl font-bold text-primary">{analysis.sections.vedicDeepDive.relationshipNarrative.vedicScore}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Section>

        {/* Chinese Zodiac Compatibility */}
        {user1Data.birth_year && user2Data.birth_year && (
          <Section icon={Sparkles} title="Chinese Zodiac" delay={0.75}>
            <ChineseZodiacCompatibility
              birthYear1={user1Data.birth_year}
              birthYear2={user2Data.birth_year}
              user1Name={user1Data.first_name}
              user2Name={user2Data.first_name}
            />
          </Section>
        )}

        {/* Final Verdict */}
        <Section icon={Target} title="Final Verdict & Advice" delay={0.8}>
          <Card className="bg-gradient-to-br from-primary/20 to-accent/10 border-primary/30 mb-6">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-center mb-6 text-primary">Compatibility Ratings</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <RatingItem label="Mental Match" stars={analysis.sections.verdict.mentalMatch} />
                <RatingItem label="Physical" stars={analysis.sections.verdict.physicalAttraction} />
                <RatingItem label="Emotional" stars={analysis.sections.verdict.emotionalEase} />
                <RatingItem label="Growth" stars={analysis.sections.verdict.growthPotential} />
                <RatingItem 
                  label="Effort Required" 
                  value={analysis.sections.verdict.effortRequired}
                  isEffort 
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card className="bg-card/50 border-border/30">
              <CardContent className="p-6">
                <h4 className="font-bold text-lg mb-4 text-primary">For This To Work - You Must:</h4>
                <ul className="space-y-2 text-sm">
                  {analysis.sections.verdict.requirements.forYou.map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span className="text-foreground/80">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/30">
              <CardContent className="p-6">
                <h4 className="font-bold text-lg mb-4 text-accent">They Must:</h4>
                <ul className="space-y-2 text-sm">
                  {analysis.sections.verdict.requirements.forThem.map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-accent">•</span>
                      <span className="text-foreground/80">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-primary/10 border-primary/30">
            <CardContent className="p-6 text-center">
              <h4 className="font-bold text-lg mb-3 text-primary">Final Truth</h4>
              <p className="text-foreground/80 max-w-2xl mx-auto">
                {analysis.overallScore >= 70 
                  ? "This connection has beautiful potential. With awareness and care, you can build something meaningful that honors both your paths."
                  : analysis.overallScore >= 50
                  ? "This pairing requires effort but can work. Growth happens through understanding your differences and choosing each other consciously."
                  : "This match presents significant challenges. Be honest about whether you're both willing to do the work required for this to thrive."}
              </p>
            </CardContent>
          </Card>
        </Section>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex gap-4 justify-center mt-12"
        >
          <Button size="lg" onClick={() => router.push(`/messages`)}>
            <MessageCircle className="w-5 h-5 mr-2" />
            Start Conversation
          </Button>
          <Button size="lg" variant="outline" onClick={() => router.back()}>
            Back to Matches
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

function ProfileCard({ profile }: { profile: any }) {
  return (
    <Card className="bg-card/80 backdrop-blur border-border/50">
      <CardContent className="p-6 text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-primary/20">
          {profile.profile_image_url ? (
            <Image 
              src={profile.profile_image_url || "/placeholder.svg"} 
              alt={profile.first_name}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl text-primary">
              {profile.first_name.charAt(0)}
            </div>
          )}
        </div>
        <h3 className="text-xl font-bold">{profile.first_name}</h3>
        <p className="text-sm text-muted-foreground">{profile.age} years old</p>
        <div className="mt-2">
          <Badge variant="outline" className="bg-primary/10">{profile.sun_sign || profile.moon_sign}</Badge>
        </div>
      </CardContent>
    </Card>
  )
}

function Section({ 
  icon: Icon, 
  title, 
  children, 
  delay = 0 
}: { 
  icon: any
  title: string
  children: React.ReactNode
  delay?: number 
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="mb-12"
    >
      <div className="flex items-center gap-3 mb-6">
        <Icon className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-light text-primary">{title}</h2>
      </div>
      {children}
    </motion.section>
  )
}

function CompatibilityMetric({ 
  title, 
  score, 
  description 
}: { 
  title: string
  score: number
  description: string 
}) {
  return (
    <Card className="bg-card/50 border-border/30">
      <CardContent className="p-4 text-center">
        <div className={`text-3xl font-bold mb-2 ${
          score >= 80 ? 'text-green-400' : score >= 60 ? 'text-primary' : 'text-orange-400'
        }`}>
          {score}%
        </div>
        <h5 className="font-semibold mb-2">{title}</h5>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function RatingItem({ 
  label, 
  stars, 
  value, 
  isEffort = false 
}: { 
  label: string
  stars?: number
  value?: string
  isEffort?: boolean 
}) {
  return (
    <div className="text-center">
      <p className="text-sm font-medium mb-2">{label}</p>
      {isEffort ? (
        <Badge 
          variant="outline" 
          className={`${
            value === 'LOW' ? 'bg-green-500/10 text-green-400' :
            value === 'MODERATE' ? 'bg-primary/10 text-primary' :
            'bg-orange-500/10 text-orange-400'
          }`}
        >
          {value}
        </Badge>
      ) : (
        <div className="flex justify-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className={star <= (stars || 0) ? 'text-primary' : 'text-muted-foreground'}>
              ⭐
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
