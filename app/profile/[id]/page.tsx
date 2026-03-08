"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { StarField } from "@/components/star-field"
import { Sun, Moon, ArrowUpRight, Heart, Share2, Edit } from "lucide-react"
import { getZodiacSymbol, getZodiacDescription } from "@/lib/birth-chart"
import type { UserProfile } from "@/lib/types"
import Link from "next/link"
import { ChineseZodiacCard } from "@/components/chinese-zodiac-card"

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    // Load profile from localStorage
    const currentProfile = localStorage.getItem('currentProfile')
    const profiles = JSON.parse(localStorage.getItem('profiles') || '[]')
    
    const foundProfile = profiles.find((p: UserProfile) => p.id === params.id)
    
    if (foundProfile) {
      setProfile(foundProfile)
      if (currentProfile) {
        const current = JSON.parse(currentProfile)
        setIsOwner(current.id === params.id)
      }
    }
  }, [params.id])

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Profile not found</p>
          <Button asChild>
            <Link href="/onboarding">Create Your Profile</Link>
          </Button>
        </div>
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
          <Link href="/" className="text-primary hover:text-primary/80 transition-colors">
            The AI Need
          </Link>
          {isOwner && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/matches">
                  <Heart className="w-4 h-4 mr-2" />
                  View Matches
                </Link>
              </Button>
            </div>
          )}
        </motion.div>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center text-4xl text-primary">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-4xl font-light mb-2">{profile.name}</h1>
          <p className="text-muted-foreground">
            {profile.age} years old
          </p>
        </motion.div>

        {/* Vedic Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-card/80 backdrop-blur border-border/50 mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-light mb-6 text-center">Vedic Overview</h2>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 rounded-xl bg-secondary/50">
                  <Sun className="w-5 h-5 mx-auto mb-2 text-yellow-500" />
                  <span className="text-xs text-muted-foreground block">Sun Sign</span>
                  <span className="text-2xl">{getZodiacSymbol(profile.vedicChart.sunSign)}</span>
                  <span className="block text-sm">{profile.vedicChart.sunSign}</span>
                </div>
                
                <div className="text-center p-4 rounded-xl bg-primary/10 border border-primary/30">
                  <Moon className="w-5 h-5 mx-auto mb-2 text-primary" />
                  <span className="text-xs text-muted-foreground block">Moon Sign</span>
                  <span className="text-2xl">{getZodiacSymbol(profile.vedicChart.moonSign)}</span>
                  <span className="block text-sm">{profile.vedicChart.moonSign}</span>
                </div>
                
                <div className="text-center p-4 rounded-xl bg-secondary/50">
                  <ArrowUpRight className="w-5 h-5 mx-auto mb-2 text-blue-400" />
                  <span className="text-xs text-muted-foreground block">Rising</span>
                  <span className="text-2xl">{getZodiacSymbol(profile.vedicChart.risingSign)}</span>
                  <span className="block text-sm">{profile.vedicChart.risingSign}</span>
                </div>
              </div>

              {/* Nakshatra */}
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                <span className="text-sm text-primary uppercase tracking-wider">Birth Star</span>
                <h3 className="text-3xl font-light mt-2">{profile.vedicChart.nakshatraName}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Ruled by {profile.vedicChart.nakshatraLord}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Traits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-card/80 backdrop-blur border-border/50 mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-light mb-6 text-center">Cosmic Traits</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-secondary/30">
                  <span className="text-xs text-muted-foreground block mb-1">Gana</span>
                  <span className="text-lg font-medium">{profile.traits.gana}</span>
                  <span className="text-xs text-primary/70 block">Temperament</span>
                </div>
                <div className="text-center p-4 rounded-lg bg-secondary/30">
                  <span className="text-xs text-muted-foreground block mb-1">Nadi</span>
                  <span className="text-lg font-medium">{profile.traits.nadi}</span>
                  <span className="text-xs text-primary/70 block">Life Force</span>
                </div>
                <div className="text-center p-4 rounded-lg bg-secondary/30">
                  <span className="text-xs text-muted-foreground block mb-1">Yoni</span>
                  <span className="text-lg font-medium">{profile.traits.yoni}</span>
                  <span className="text-xs text-primary/70 block">Nature</span>
                </div>
                <div className="text-center p-4 rounded-lg bg-secondary/30">
                  <span className="text-xs text-muted-foreground block mb-1">Varna</span>
                  <span className="text-lg font-medium">{profile.traits.varna}</span>
                  <span className="text-xs text-primary/70 block">Purpose</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Chinese Zodiac */}
        {profile.birth_year && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-6"
          >
            <ChineseZodiacCard birthYear={profile.birth_year} />
          </motion.div>
        )}

        {/* Bio */}
        {profile.bio && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-card/80 backdrop-blur border-border/50 mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-light mb-4">About</h2>
                <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Moon Sign Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-card/80 backdrop-blur border-border/50">
            <CardContent className="p-6">
              <h2 className="text-xl font-light mb-4">Moon Sign Insight</h2>
              <p className="text-muted-foreground leading-relaxed">
                {getZodiacDescription(profile.vedicChart.moonSign)}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA */}
        {isOwner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center"
          >
            <Button size="lg" asChild>
              <Link href="/matches">
                <Heart className="w-5 h-5 mr-2" />
                Find Your Cosmic Matches
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
