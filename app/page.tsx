'use client'

import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { CTASection } from "@/components/cta-section"
import { useEffect, useState } from 'react'

export default function Home() {
  const [error, setError] = useState<Error | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    console.log('[v0] Home page mounted')
    setMounted(true)
  }, [])

  if (error) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Something went wrong</h1>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </main>
    )
  }

  if (!mounted) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </main>
    )
  }

  try {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection />
      </main>
    )
  } catch (err) {
    console.error('[v0] Error rendering home:', err)
    setError(err instanceof Error ? err : new Error('Unknown error'))
    return null
  }
}
