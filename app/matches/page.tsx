'use client'

import React from "react"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { StarField } from '@/components/star-field'
import { Heart, MessageCircle, Sparkles, Users } from 'lucide-react'
import { calculateGunaMilan } from '@/lib/guna-milan'
import { getZodiacSymbol } from '@/lib/birth-chart'
import { createClient } from '@/lib/supabase/client'
import { getOrCreateConversation } from '@/app/actions/messages'

interface Profile {
  id: string
  first_name: string
  last_name?: string
  age?: number
  bio?: string
  profile_image_url?: string
  moon_sign?: string
  sun_sign?: string
  nakshatra?: number
  nakshatra_name?: string
  gender?: string
}

interface MatchWithScore {
  profile: Profile
  compatibility: ReturnType<typeof calculateGunaMilan>
}

export default function MatchesPage() {
  const router = useRouter()
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null)
  const [matches, setMatches] = useState<MatchWithScore[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMatches() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      // Get current user's profile
      const { data: myProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!myProfile) {
        router.push('/onboarding')
        return
      }

      setCurrentProfile(myProfile)

      // Get all other profiles (potential matches)
      const { data: allProfiles } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id)
        .not('moon_sign', 'is', null)

      if (allProfiles && allProfiles.length > 0) {
        // Calculate compatibility with each profile
        const calculatedMatches = allProfiles
          .map((profile) => ({
            profile,
            compatibility: calculateGunaMilan(
              {
                moonSign: myProfile.moon_sign || 'Aries',
                nakshatra: myProfile.nakshatra || 1,
              },
              {
                moonSign: profile.moon_sign || 'Aries',
                nakshatra: profile.nakshatra || 1,
              }
            ),
          }))
          .sort((a, b) => b.compatibility.percentage - a.compatibility.percentage)

        setMatches(calculatedMatches)
      }

      setLoading(false)
    }

    loadMatches()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles className="w-8 h-8 text-primary" />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative">
      <StarField />

      <div className="relative z-10 container max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <Users className="w-4 h-4 mr-2" />
              My Profile
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/messages">
              <MessageCircle className="w-4 h-4 mr-2" />
              Messages
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-light mb-2">Your Cosmic Matches</h1>
          <p className="text-muted-foreground">
            Sorted by Guna Milan compatibility score
          </p>
        </motion.div>

        {/* Matches Grid */}
        <div className="space-y-4">
          {matches.map((match, index) => (
            <MatchCard
              key={match.profile.id}
              match={match}
              index={index}
              currentProfileId={currentProfile?.id || ''}
            />
          ))}
        </div>

        {matches.length === 0 && (
          <Card className="bg-card/80 backdrop-blur-sm border-border/50 p-8 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No matches yet</h3>
            <p className="text-muted-foreground mb-4">
              Be patient - your cosmic match will appear when the stars align!
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}

function MatchCard({
  match,
  index,
  currentProfileId,
}: {
  match: MatchWithScore
  index: number
  currentProfileId: string
}) {
  const router = useRouter()
  const { profile, compatibility } = match
  const [startingChat, setStartingChat] = useState(false)

  const getScoreColor = (percentage: number) => {
    if (percentage >= 75) return 'text-green-400'
    if (percentage >= 50) return 'text-primary'
    return 'text-orange-400'
  }

  async function handleMessage(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setStartingChat(true)

    const result = await getOrCreateConversation(profile.id)
    if (result.conversationId) {
      router.push(`/messages/${result.conversationId}`)
    }
    setStartingChat(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="bg-card/80 backdrop-blur border-border/50 hover:border-primary/30 transition-all group">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 md:gap-6">
            {/* Avatar */}
            <Link href={`/compatibility/${currentProfileId}/${profile.id}`} className="shrink-0">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center">
                {profile.profile_image_url ? (
                  <Image
                    src={profile.profile_image_url || "/placeholder.svg"}
                    alt={profile.first_name}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-2xl text-primary">
                    {profile.first_name?.charAt(0) || '?'}
                  </span>
                )}
              </div>
            </Link>

            {/* Info */}
            <Link href={`/compatibility/${currentProfileId}/${profile.id}`} className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg md:text-xl font-medium truncate">
                  {profile.first_name} {profile.last_name || ''}
                </h3>
                {profile.age && (
                  <span className="text-muted-foreground">{profile.age}</span>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                {profile.sun_sign && (
                  <span className="flex items-center gap-1">
                    <span>{getZodiacSymbol(profile.sun_sign)}</span>
                    {profile.sun_sign}
                  </span>
                )}
                {profile.nakshatra_name && (
                  <>
                    <span className="text-border">|</span>
                    <span className="hidden sm:inline">{profile.nakshatra_name}</span>
                  </>
                )}
              </div>
              {profile.bio && (
                <p className="text-sm text-muted-foreground mt-2 line-clamp-1 hidden sm:block">
                  {profile.bio}
                </p>
              )}
            </Link>

            {/* Score */}
            <div className="text-center shrink-0">
              <div className={`text-2xl md:text-3xl font-light ${getScoreColor(compatibility.percentage)}`}>
                {compatibility.percentage}%
              </div>
              <div className="text-xs text-muted-foreground">
                {compatibility.totalScore}/36
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 shrink-0">
              <Button
                size="sm"
                variant="outline"
                onClick={handleMessage}
                disabled={startingChat}
                className="gap-1 bg-transparent"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Message</span>
              </Button>
              <Link href={`/compatibility/${currentProfileId}/${profile.id}`}>
                <Button size="sm" variant="ghost" className="w-full gap-1">
                  <Heart className="w-4 h-4" />
                  <span className="hidden sm:inline">Details</span>
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
