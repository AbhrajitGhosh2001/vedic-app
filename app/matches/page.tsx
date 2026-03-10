'use client'

import React from "react"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StarField } from '@/components/star-field'
import { Heart, MessageCircle, Sparkles, Users, MapPin, Filter } from 'lucide-react'
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
  birth_location?: string
  birth_location_lat?: number
  birth_location_lng?: number
}

interface MatchWithScore {
  profile: Profile
  compatibility: ReturnType<typeof calculateGunaMilan>
  distance?: number
}

type SortBy = 'compatibility' | 'gender' | 'distance'

// Calculate distance between two coordinates in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export default function MatchesPage() {
  const router = useRouter()
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null)
  const [matches, setMatches] = useState<MatchWithScore[]>([])
  const [filteredMatches, setFilteredMatches] = useState<MatchWithScore[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<SortBy>('compatibility')
  const [selectedGender, setSelectedGender] = useState<string | null>(null)

  // Apply sorting and filtering
  useEffect(() => {
    let result = [...matches]

    // Filter by gender if selected
    if (selectedGender && selectedGender !== 'all') {
      result = result.filter(m => m.profile.gender?.toLowerCase() === selectedGender.toLowerCase())
    }

    // Sort based on selected option
    if (sortBy === 'compatibility') {
      result.sort((a, b) => b.compatibility.percentage - a.compatibility.percentage)
    } else if (sortBy === 'distance') {
      result.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity))
    } else if (sortBy === 'gender') {
      result.sort((a, b) => {
        const genderA = a.profile.gender || 'unknown'
        const genderB = b.profile.gender || 'unknown'
        return genderA.localeCompare(genderB)
      })
    }

    setFilteredMatches(result)
  }, [matches, sortBy, selectedGender])

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

      if (allProfiles && allProfiles.length > 0) {
        // Calculate compatibility and distance with each profile
        const calculatedMatches = allProfiles
          .map((profile) => {
            const distance = myProfile.birth_location_lat && myProfile.birth_location_lng &&
              profile.birth_location_lat && profile.birth_location_lng
              ? calculateDistance(
                myProfile.birth_location_lat,
                myProfile.birth_location_lng,
                profile.birth_location_lat,
                profile.birth_location_lng
              )
              : undefined

            return {
              profile,
              compatibility: profile.moon_sign && myProfile.moon_sign
                ? calculateGunaMilan(
                    {
                      moonSign: myProfile.moon_sign,
                      nakshatra: myProfile.nakshatra || 1,
                    },
                    {
                      moonSign: profile.moon_sign,
                      nakshatra: profile.nakshatra || 1,
                    }
                  )
                : { percentage: 0, totalScore: 0 }, // Default score for profiles without moon_sign
              distance,
            }
          })

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

      <div className="relative z-10 container max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 flex-wrap gap-4"
        >
          <div className="flex gap-2">
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
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-light mb-2">Your Cosmic Matches</h1>
          <p className="text-muted-foreground">
            {filteredMatches.length} potential {filteredMatches.length === 1 ? 'match' : 'matches'} found
          </p>
        </motion.div>

        {/* Filters and Sort */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex flex-wrap gap-3 items-center"
        >
          <Filter className="w-4 h-4 text-muted-foreground" />
          
          {/* Sort By */}
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="px-3 py-2 rounded-lg bg-card/40 border border-border/30 text-sm hover:bg-card/60 transition-colors cursor-pointer"
            >
              <option value="compatibility">Sort by Compatibility</option>
              <option value="distance">Sort by Distance</option>
              <option value="gender">Sort by Gender</option>
            </select>
          </div>

          {/* Gender Filter */}
          <div className="flex gap-2">
            {['all', 'male', 'female', 'other'].map((gender) => (
              <button
                key={gender}
                onClick={() => setSelectedGender(gender === 'all' ? null : gender)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  (gender === 'all' && !selectedGender) || selectedGender === gender
                    ? 'bg-primary/30 border border-primary/50 text-foreground'
                    : 'bg-card/40 border border-border/30 text-muted-foreground hover:bg-card/60'
                }`}
              >
                {gender.charAt(0).toUpperCase() + gender.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Matches Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMatches.map((match, index) => (
            <MatchCard
              key={match.profile.id}
              match={match}
              index={index}
              currentProfileId={currentProfile?.id || ''}
            />
          ))}
        </div>

        {filteredMatches.length === 0 && (
          <Card className="bg-card/80 backdrop-blur-sm border-border/50 p-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No matches found</h3>
            <p className="text-muted-foreground">
              {selectedGender ? 'Try adjusting your filters' : 'Be patient - your cosmic match will appear when the stars align!'}
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
  const { profile, compatibility, distance } = match
  const [startingChat, setStartingChat] = useState(false)

  const getScoreColor = (percentage: number) => {
    if (percentage >= 75) return 'from-green-500/40 to-green-600/20'
    if (percentage >= 50) return 'from-primary/40 to-primary/20'
    return 'from-orange-500/40 to-orange-600/20'
  }

  const getScoreTextColor = (percentage: number) => {
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
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/compatibility/${currentProfileId}/${profile.id}`}>
        <Card className="bg-card/40 backdrop-blur border-border/30 hover:border-primary/50 transition-all group h-full overflow-hidden cursor-pointer">
          {/* Profile Image Container */}
          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-colors">
            {profile.profile_image_url ? (
              <Image
                src={profile.profile_image_url}
                alt={profile.first_name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-6xl text-primary/20">
                  {profile.first_name?.charAt(0) || '?'}
                </span>
              </div>
            )}

            {/* Compatibility Badge */}
            <div className={`absolute top-3 right-3 bg-gradient-to-br ${getScoreColor(compatibility.percentage)} backdrop-blur-sm border border-white/10 rounded-lg px-3 py-1.5`}>
              <div className={`text-lg font-bold ${getScoreTextColor(compatibility.percentage)}`}>
                {compatibility.percentage}%
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="p-4 space-y-3">
            {/* Name and Age */}
            <div>
              <h3 className="text-lg font-semibold truncate group-hover:text-primary transition-colors">
                {profile.first_name} {profile.last_name ? profile.last_name.charAt(0) + '.' : ''}
              </h3>
              {profile.age && (
                <p className="text-sm text-muted-foreground">{profile.age} years old</p>
              )}
            </div>

            {/* Astrological Info */}
            <div className="space-y-2 text-sm text-muted-foreground">
              {profile.gender && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Gender:</span>
                  <span className="font-medium text-foreground capitalize">{profile.gender}</span>
                </div>
              )}
              
              {profile.sun_sign && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Sun Sign:</span>
                  <span className="font-medium text-foreground">
                    {getZodiacSymbol(profile.sun_sign)} {profile.sun_sign}
                  </span>
                </div>
              )}

              {profile.nakshatra_name && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Nakshatra:</span>
                  <span className="font-medium text-foreground text-xs">{profile.nakshatra_name}</span>
                </div>
              )}
            </div>

            {/* Location and Distance */}
            {profile.birth_location && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground pt-1 border-t border-border/20">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <div className="flex-1 truncate">
                  <span className="truncate block text-xs">{profile.birth_location}</span>
                  {distance !== undefined && (
                    <span className="text-xs text-muted-foreground/70">
                      {distance < 1 ? '&lt;1 km' : `${Math.round(distance)} km away`}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleMessage}
                disabled={startingChat}
                className="flex-1 px-3 py-2 rounded-lg bg-primary/20 hover:bg-primary/30 disabled:opacity-50 transition-colors text-sm font-medium flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Message</span>
              </button>
              <button className="px-3 py-2 rounded-lg bg-card/40 hover:bg-card/60 transition-colors border border-border/20">
                <Heart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}
