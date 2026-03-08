'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { StepIndicator } from '@/components/onboarding/step-indicator'
import { PersonalInfoStep } from '@/components/onboarding/personal-info-step'
import { BirthDataStep } from '@/components/onboarding/birth-data-step'
import { ChartRevealStep } from '@/components/onboarding/chart-reveal-step'
import { ProfileImageStep } from '@/components/onboarding/profile-image-step'
import { StarField } from '@/components/star-field'
import { Button } from '@/components/ui/button'
import { updateProfile, getProfile } from '@/app/actions/profile'
import type { BirthData, VedicChart } from '@/lib/types'
import { getChineseZodiacAnimal, getChineseElement } from '@/lib/chinese-zodiac'

const STEPS = ['Personal Info', 'Birth Details', 'Profile Photo', 'Your Chart']

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const forceReonboard = searchParams.get('force') === 'true'

  const [personalInfo, setPersonalInfo] = useState({
    first_name: '',
    last_name: '',
    gender: 'female' as 'male' | 'female' | 'other',
    bio: '',
    profile_image_url: '',
  })

  const [birthData, setBirthData] = useState<BirthData | null>(null)
  const [vedicChart, setVedicChart] = useState<VedicChart | null>(null)

  // Check if user has already completed onboarding
  useEffect(() => {
    async function checkProfile() {
      if (!forceReonboard) {
        const profile = await getProfile()
        if (profile?.birth_date && profile?.moon_sign) {
          // User has already completed onboarding, redirect to matches
          router.push('/matches')
          return
        }
      }
      setIsLoading(false)
    }
    checkProfile()
  }, [forceReonboard, router])

  const handlePersonalInfoNext = (data: typeof personalInfo) => {
    setPersonalInfo(data)
    setCurrentStep(1)
  }

  const handleBirthDataNext = (data: BirthData, chart: VedicChart) => {
    setBirthData(data)
    setVedicChart(chart)
    setCurrentStep(2)
  }

  const handleImageNext = (imageUrl: string) => {
    setPersonalInfo((prev) => ({ ...prev, profile_image_url: imageUrl }))
    setCurrentStep(3)
  }

  const handleComplete = async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (!birthData || !vedicChart) {
        setError('Birth data is missing')
        return
      }

      // Calculate age from birth_date
      const birthDate = new Date(birthData.date)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }

      // Calculate Chinese zodiac
      const birthYear = birthDate.getFullYear()
      const chineseAnimal = getChineseZodiacAnimal(birthYear)
      const chineseElement = getChineseElement(birthYear)

      const profileData = {
        first_name: personalInfo.first_name,
        last_name: personalInfo.last_name,
        age: age,
        gender: personalInfo.gender,
        bio: personalInfo.bio,
        profile_image_url: personalInfo.profile_image_url,
        birth_date: birthData.date,
        birth_time: birthData.time,
        birth_location: birthData.location.city,
        birth_location_lat: birthData.location.latitude,
        birth_location_lng: birthData.location.longitude,
        sun_sign: vedicChart.sunSign,
        moon_sign: vedicChart.moonSign,
        rising_sign: vedicChart.risingSign,
        nakshatra: vedicChart.nakshatra,
        nakshatra_name: vedicChart.nakshatraName,
        chinese_zodiac_animal: chineseAnimal.name,
        chinese_zodiac_element: chineseElement.name,
        birth_year: birthYear,
        gana: '',
        nadi: '',
        yoni: '',
        varna: '',
      }

      const result = await updateProfile(profileData)

      if (result.error) {
        setError(result.error)
        return
      }

      router.push('/matches')
    } catch (err) {
      setError('Failed to save profile')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <StarField />

      <div className="relative z-10 container max-w-2xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-light mb-2">Begin Your Journey</h1>
          <p className="text-muted-foreground">Discover your cosmic blueprint</p>
        </div>

        <StepIndicator steps={STEPS} currentStep={currentStep} />

        <div className="mt-12">
          {currentStep === 0 && (
            <PersonalInfoStep
              initialData={personalInfo}
              onNext={handlePersonalInfoNext}
            />
          )}

          {currentStep === 1 && (
            <BirthDataStep
              onNext={handleBirthDataNext}
              onBack={() => setCurrentStep(0)}
            />
          )}

          {currentStep === 2 && (
            <ProfileImageStep
              onNext={handleImageNext}
              onBack={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 3 && vedicChart && birthData && (
            <ChartRevealStep
              personalInfo={personalInfo}
              birthData={birthData}
              vedicChart={vedicChart}
              onComplete={handleComplete}
              onBack={() => setCurrentStep(2)}
            />
          )}

          {error && (
            <div className="mt-6 p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
