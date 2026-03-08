'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getProfile } from '@/app/actions/profile'
import { logout, getUser } from '@/app/actions/auth'
import type { UserProfile } from '@/lib/types'

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function loadProfile() {
      try {
        const profileData = await getProfile()
        if (!profileData) {
          router.push('/auth/login')
          return
        }
        setProfile(profileData)
      } catch (err) {
        setError('Failed to load profile')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [router])

  const handleLogout = async () => {
    await logout()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-muted-foreground">Loading your profile...</div>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-destructive mb-4">{error || 'Profile not found'}</p>
            <Button onClick={() => router.push('/auth/login')}>Return to Login</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-card via-background to-card py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-serif">Your Cosmic Profile</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Profile Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0">
                  {profile.profile_image_url ? (
                    <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-primary">
                      <Image
                        src={profile.profile_image_url || "/placeholder.svg"}
                        alt={profile.first_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-40 h-40 rounded-full bg-primary/10 flex items-center justify-center text-6xl">
                      👤
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h2 className="text-3xl font-serif mb-2">
                    {profile.first_name} {profile.last_name}
                    {profile.age && <span className="text-xl ml-3 text-muted-foreground">{profile.age}</span>}
                  </h2>
                  {profile.gender && (
                    <p className="text-muted-foreground mb-4 capitalize">
                      {profile.gender === 'male' ? '♂️' : profile.gender === 'female' ? '♀️' : '⚪'} {profile.gender}
                    </p>
                  )}
                  {profile.bio && (
                    <p className="text-foreground leading-relaxed">{profile.bio}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Birth Data Card */}
          <Card>
            <CardHeader>
              <CardTitle>Birth Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {profile.birth_date && (
                  <div>
                    <p className="text-sm text-muted-foreground">Birth Date</p>
                    <p className="font-serif text-lg">{profile.birth_date}</p>
                  </div>
                )}
                {profile.birth_time && (
                  <div>
                    <p className="text-sm text-muted-foreground">Birth Time</p>
                    <p className="font-serif text-lg">{profile.birth_time}</p>
                  </div>
                )}
                {profile.birth_location && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Birth Location</p>
                    <p className="font-serif text-lg">{profile.birth_location}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Vedic Chart Card */}
          <Card>
            <CardHeader>
              <CardTitle>Your Vedic Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {profile.sun_sign && (
                  <div>
                    <p className="text-sm text-muted-foreground">Sun Sign</p>
                    <p className="font-serif text-lg">{profile.sun_sign}</p>
                  </div>
                )}
                {profile.moon_sign && (
                  <div>
                    <p className="text-sm text-muted-foreground">Moon Sign</p>
                    <p className="font-serif text-lg">{profile.moon_sign}</p>
                  </div>
                )}
                {profile.rising_sign && (
                  <div>
                    <p className="text-sm text-muted-foreground">Rising Sign</p>
                    <p className="font-serif text-lg">{profile.rising_sign}</p>
                  </div>
                )}
                {profile.nakshatra_name && (
                  <div className="col-span-3">
                    <p className="text-sm text-muted-foreground">Nakshatra</p>
                    <p className="font-serif text-lg">{profile.nakshatra_name}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button 
              onClick={() => router.push('/profile/insights')} 
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              View Full Insights
            </Button>
            <Button onClick={() => router.push('/matches')} size="lg">
              Browse Matches
            </Button>
            <Button variant="outline" onClick={() => router.push('/')} size="lg">
              Back to Home
            </Button>
          </div>

          {/* Re-onboard Button */}
          <div className="mt-4">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/onboarding?force=true')}
              className="w-full text-muted-foreground hover:text-foreground"
            >
              Update Birth Information
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
