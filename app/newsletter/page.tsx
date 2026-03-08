'use client'

import React from "react"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Checkout } from '@/components/checkout'
import { 
  Sparkles, 
  Calendar, 
  Heart, 
  Moon, 
  Star,
  TrendingUp,
  Mail,
  Check,
  Zap,
  Gift
} from 'lucide-react'
import Link from 'next/link'
import { sendTestNewsletterSignup } from '@/app/actions/test-newsletter'
import { generateAndSendTodayNewsletter } from '@/app/actions/send-newsletter'

const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Phoenix', label: 'Arizona (MST)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Asia/Kolkata', label: 'India (IST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEDT)' },
]

export default function NewsletterPage() {
  const [email, setEmail] = useState('')
  const [timezone, setTimezone] = useState('')
  const [showCheckout, setShowCheckout] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'ad-free'>('free')
  const [isValidEmail, setIsValidEmail] = useState(false)
  const [isSendingTest, setIsSendingTest] = useState(false)
  const [testSent, setTestSent] = useState(false)
  const [isSendingAdmin, setIsSendingAdmin] = useState(false)
  const [adminResult, setAdminResult] = useState<{ success: boolean; message: string } | null>(null)

  // Auto-detect user's timezone on mount
  useEffect(() => {
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    setTimezone(detectedTimezone)
    console.log('[v0] Detected timezone:', detectedTimezone)
  }, [])

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    setIsValidEmail(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
  }

  const handleSubscribe = () => {
    if (isValidEmail) {
      if (selectedPlan === 'free') {
        // For free plan, just signup without checkout
        handleFreeSubscribe()
      } else {
        // For ad-free, show checkout
        setShowCheckout(true)
      }
    }
  }

  const handleFreeSubscribe = async () => {
    if (!isValidEmail) return
    
    setIsSendingTest(true)
    try {
      const result = await sendTestNewsletterSignup(email, timezone || 'America/New_York')
      setTestSent(true)
      console.log('[v0] Free subscription started:', result)
    } catch (error) {
      console.error('[v0] Failed to start free subscription:', error)
      alert('Failed to start free subscription. Please try again.')
    } finally {
      setIsSendingTest(false)
    }
  }

  const handleAdminSendNewsletter = async () => {
    setIsSendingAdmin(true)
    setAdminResult(null)
    try {
      const result = await generateAndSendTodayNewsletter('tataighosh5@gmail.com')
      setAdminResult(result)
      console.log('[v0] Admin newsletter sent:', result)
    } catch (error) {
      console.error('[v0] Failed to send admin newsletter:', error)
      setAdminResult({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to send newsletter'
      })
    } finally {
      setIsSendingAdmin(false)
    }
  }

  const handleTestSignup = async () => {
    if (!isValidEmail) return
    
    setIsSendingTest(true)
    try {
      const result = await sendTestNewsletterSignup(email, timezone || 'America/New_York')
      setTestSent(true)
      console.log('[v0] Test newsletter signup sent:', result)
    } catch (error) {
      console.error('[v0] Failed to send test signup:', error)
      alert('Failed to send test signup. Please try again.')
    } finally {
      setIsSendingTest(false)
    }
  }

  const benefits = [
    {
      icon: Calendar,
      title: 'Daily Forecasts',
      description: 'Get your personalized Vedic astrology predictions every day'
    },
    {
      icon: Sparkles,
      title: 'Numerology Insights',
      description: 'Discover hidden patterns in your life path numbers'
    },
    {
      icon: Heart,
      title: 'Love Compatibility',
      description: 'Learn about cosmic connections and relationship timing'
    },
    {
      icon: Moon,
      title: 'Lunar Guidance',
      description: 'Understand how moon phases affect your energy and decisions'
    },
    {
      icon: Star,
      title: 'Chinese Zodiac',
      description: 'Ancient Eastern wisdom for career and life direction'
    },
    {
      icon: TrendingUp,
      title: 'Growth Tips',
      description: 'Actionable advice aligned with your cosmic blueprint'
    }
  ]

  if (showCheckout && isValidEmail) {
    return (
      <div className="min-h-screen bg-background text-foreground py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <h1 className="text-3xl font-bold mb-2">Complete Your Subscription</h1>
            <p className="text-muted-foreground">Subscribing with: <span className="text-amber-400">{email}</span></p>
          </motion.div>
          
          <Card className="bg-card/50 backdrop-blur border-amber-500/20">
            <CardContent className="p-6">
          <Checkout 
            productId={selectedPlan === 'ad-free' ? 'cosmic-insights-ad-free' : 'cosmic-insights-free'} 
            metadata={{ email, timezone }}
          />
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <Button 
              variant="ghost" 
              onClick={() => setShowCheckout(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              ← Change email address
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 to-background" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Limited Time Offer
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Cosmic Insights Newsletter
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Daily wisdom from Vedic astrology, numerology, and ancient Eastern traditions delivered to your inbox
            </p>

            <div className="flex flex-col items-center justify-center gap-4 text-sm text-muted-foreground mb-10">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>Every Day</span>
              </div>
              <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium inline-flex items-center gap-2">
                <Zap className="w-4 h-4" />
                7-Day Free Trial Included
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>Personalized & Actionable</span>
              </div>
            </div>

            {/* Pricing & Plan Selection */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-10"
            >
              <div className="grid md:grid-cols-2 gap-4 max-w-xl mx-auto mb-6">
                {/* Free Plan */}
                <Card 
                  className={`cursor-pointer transition-all ${selectedPlan === 'free' ? 'bg-gradient-to-br from-green-950/40 to-green-900/20 border-green-500/50' : 'bg-card/50 border-card/50 hover:border-amber-500/20'}`}
                  onClick={() => setSelectedPlan('free')}
                >
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400 mb-2">FREE</div>
                      <p className="text-sm text-muted-foreground mb-4">Daily insights with ads</p>
                      <Badge className="bg-green-500/20 text-green-400">No Payment Required</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Ad-Free Plan */}
                <Card 
                  className={`cursor-pointer transition-all ${selectedPlan === 'ad-free' ? 'bg-gradient-to-br from-amber-950/30 to-purple-950/30 border-amber-500/50' : 'bg-card/50 border-card/50 hover:border-amber-500/20'}`}
                  onClick={() => setSelectedPlan('ad-free')}
                >
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-amber-400 mb-2">$2.88</div>
                      <p className="text-sm text-muted-foreground mb-2">/month</p>
                      <p className="text-xs text-muted-foreground mb-3">No ads, premium experience</p>
                      <Badge className="bg-amber-500/20 text-amber-400">Most Popular</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Email & Timezone Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-md mx-auto space-y-4"
            >
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={handleEmailChange}
                      className="pl-10 h-12 bg-background/50 border-amber-500/30 focus:border-amber-500"
                    />
                  </div>
                {/* Subscribe Button */}
                <Button
                  onClick={handleSubscribe}
                  disabled={!isValidEmail}
                  className={`h-12 px-8 font-semibold ${selectedPlan === 'free' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black'}`}
                >
                  {selectedPlan === 'free' ? 'Subscribe Free' : 'Subscribe Now'}
                  <Zap className="w-4 h-4 ml-2" />
                </Button>
                </div>
                
                {/* Free Test Button */}
                {testSent ? (
                  <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                    <p className="text-blue-400 font-medium">
                      ✅ Free subscription started!
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Subject: "🌟 Welcome to Cosmic Insights Newsletter"
                    </p>
                    <p className="text-xs text-muted-foreground mt-2 bg-black/20 p-2 rounded">
                      Your daily newsletters with ads will be sent at 6:00 AM {timezone} time. Upgrade to ad-free anytime for just $2.88/month.
                    </p>
                  </div>
                ) : (
                  <Button
                    onClick={handleFreeSubscribe}
                    disabled={!isValidEmail || isSendingTest}
                    variant="outline"
                    className="w-full h-12 border-green-500/30 hover:border-green-500 hover:bg-green-500/10 text-green-400"
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    {isSendingTest ? 'Starting...' : 'Start Free Subscription (No Payment)'}
                  </Button>
                )}
              </div>
              
              {/* Timezone Selector */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Your timezone (newsletters sent at 6:00 AM)
                </label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger className="h-12 bg-background/50 border-amber-500/30 focus:border-amber-500">
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
              </div>
              
              {email && !isValidEmail && (
                <p className="text-sm text-red-400 text-left">Please enter a valid email address</p>
              )}

              {/* TEMPORARY ADMIN BUTTON - Generate Today's Newsletter */}
              <div className="mt-6 pt-6 border-t border-amber-500/20">
                <p className="text-xs text-muted-foreground mb-3">ADMIN: Generate today's newsletter</p>
                <Button
                  onClick={handleAdminSendNewsletter}
                  disabled={isSendingAdmin}
                  variant="outline"
                  className="w-full h-10 border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/10 text-purple-400"
                >
                  {isSendingAdmin ? 'Generating...' : '📧 Send Today\'s Newsletter to Admin'}
                </Button>
                {adminResult && (
                  <div className={`mt-3 p-3 rounded-lg text-sm ${adminResult.success ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
                    {adminResult.message}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-purple-950/10">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12"
          >
            What You'll Receive Every Day
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bg-card/50 backdrop-blur border-amber-500/20 hover:border-amber-500/40 transition-colors">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4">
                      <benefit.icon className="w-6 h-6 text-amber-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Content Preview */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">A Glimpse Inside</h2>
            <p className="text-muted-foreground">Here's what a typical newsletter looks like</p>
          </motion.div>

          <Card className="bg-gradient-to-br from-purple-950/30 to-amber-950/20 border-amber-500/30">
            <CardContent className="p-8 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-amber-400 mb-2">🌟 This Week's Cosmic Forecast</h3>
                <p className="text-muted-foreground">
                  Venus enters Pisces this Tuesday, bringing heightened romance and creative inspiration. 
                  Moon in Ashwini nakshatra suggests new beginnings and bold initiatives...
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-amber-400 mb-2">🔢 Numerology Spotlight</h3>
                <p className="text-muted-foreground">
                  If you're a Life Path 7, this week emphasizes spiritual growth and introspection. 
                  The number 11 appears strongly, indicating divine guidance...
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-amber-400 mb-2">❤️ Love & Relationships</h3>
                <p className="text-muted-foreground">
                  Fire signs experience passionate connections. Water signs should focus on emotional honesty. 
                  Best compatibility days: Thursday and Saturday...
                </p>
              </div>

              <div className="pt-4 border-t border-amber-500/20">
                <p className="text-sm text-muted-foreground italic">
                  Plus: Lucky numbers, auspicious dates, career guidance, and much more!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-purple-950/10 to-background">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Unlock Your Cosmic Potential?</h2>
            <p className="text-muted-foreground mb-8">
              Join hundreds of seekers receiving weekly guidance from the stars
            </p>
            
            <div className="max-w-md mx-auto mb-8">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={handleEmailChange}
                    className="pl-10 h-12 bg-background/50 border-amber-500/30 focus:border-amber-500"
                  />
                </div>
                <Button
                  onClick={handleSubscribe}
                  disabled={!isValidEmail}
                  className="h-12 px-8 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold"
                >
                  Subscribe
                </Button>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              No spam, ever. Unsubscribe anytime. 
              <Link href="/privacy" className="text-amber-400 hover:underline ml-1">
                Privacy Policy
              </Link>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
