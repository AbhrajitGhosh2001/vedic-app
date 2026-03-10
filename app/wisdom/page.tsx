'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StarField } from '@/components/star-field'

const vedicsTopics = [
  {
    title: 'Understanding Guna Milan',
    description: 'Learn about the eight factors that determine compatibility in Vedic astrology.',
    content: 'Guna Milan is an ancient Vedic astrology technique that evaluates compatibility between two individuals based on eight key factors called Ashta Kootas. Each factor is assigned points, with a maximum score of 36.',
  },
  {
    title: 'The 27 Nakshatras',
    description: 'Discover the lunar mansions that influence your personality and destiny.',
    content: 'Nakshatras are lunar mansions in Vedic astrology, each spanning 13 degrees and 20 minutes of the zodiac. Your birth nakshatra reveals deep insights about your nature and compatibility.',
  },
  {
    title: 'Moon Sign Compatibility',
    description: 'Why your Moon sign matters more than your Sun sign in relationships.',
    content: 'In Vedic astrology, the Moon represents your emotional nature and inner self. Moon sign compatibility is crucial for understanding emotional bonds and mental harmony in relationships.',
  },
  {
    title: 'Understanding Nadi Dosha',
    description: 'Learn about this important compatibility factor and its remedies.',
    content: 'Nadi Dosha occurs when both partners share the same Nadi (energy channel). While considered challenging, various remedies and deeper chart analysis can provide solutions.',
  },
]

const advancedVedicTopics = [
  {
    title: 'Understanding Manglik Dosha',
    description: 'Navigating the influence of Mars on temper and passion.',
    content: 'Manglik Dosha occurs when Mars is placed in specific houses of your birth chart. It governs "Kuja" (fire) energy. If one partner is a "Manglik" and the other isn\'t, it can lead to friction, but specific "cancellations" in the chart often provide a perfect balance.',
  },
  {
    title: 'Graha Maitri (Planetary Friendship)',
    description: 'Are your ruling planets friends or enemies?',
    content: 'This factor measures the psychological disposition of two individuals. If your ruling planets (like Jupiter and Mars) are friends, you will naturally understand each other\'s outlook on life, regardless of your personality differences.',
  },
  {
    title: 'The Navamsha (D9) Chart',
    description: 'The "Fruit of the Tree": Your long-term marriage destiny.',
    content: 'While the main birth chart (Lagna) shows the "promise" of a relationship, the Navamsha chart reveals the actual strength and longevity of the bond. It is the microscopic view used by Vedic experts to confirm if a couple will stay together through old age.',
  },
]

const chineseTopics = [
  {
    title: 'The Four Pillars of Destiny (Bazi)',
    description: 'Beyond your birth year: The Month, Day, and Hour.',
    content: 'While most know their zodiac animal, true Chinese astrology uses the Four Pillars. Your Day Pillar (the Day Master) represents your true self, while the Year, Month, and Hour represent your ancestors, career, and future children.',
  },
  {
    title: 'The Five Elements (Wu Xing)',
    description: 'Wood, Fire, Earth, Metal, and Water.',
    content: 'Every sign is influenced by an element that changes every two years. Compatibility depends on the Productive Cycle (e.g., Water nourishes Wood) or the Destructive Cycle (e.g., Water extinguishes Fire). Knowing your element explains how you express your zodiac traits.',
  },
  {
    title: 'The Six Clashes & Harmonies',
    description: 'Understanding the hidden dynamics of attraction and conflict.',
    content: 'In Chinese astrology, certain signs are "Natural Allies" (Harmonies) while others are "Natural Opposites" (Clashes). A Clash doesn\'t mean failure—it often indicates a relationship that sparks intense growth or provides a necessary challenge.',
  },
]

export default function WisdomPage() {
  const [activeTab, setActiveTab] = useState<'vedic' | 'advanced' | 'chinese'>('vedic')

  return (
    <div className="relative min-h-screen">
      <StarField />
      
      <div className="container max-w-6xl mx-auto px-6 py-16 relative z-10">
        <div className="text-center mb-16">
          <span className="text-primary/80 text-sm tracking-[0.3em] uppercase font-medium">
            Ancient Knowledge
          </span>
          <h1 className="text-4xl md:text-6xl font-light mt-4 mb-6">
            Cosmic <span className="text-primary font-medium">Wisdom</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore the profound teachings of Vedic and Chinese astrology to guide your journey through love and destiny.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <Button
            variant={activeTab === 'vedic' ? 'default' : 'outline'}
            onClick={() => setActiveTab('vedic')}
            className="rounded-full"
          >
            Vedic Basics
          </Button>
          <Button
            variant={activeTab === 'advanced' ? 'default' : 'outline'}
            onClick={() => setActiveTab('advanced')}
            className="rounded-full"
          >
            Advanced Vedic
          </Button>
          <Button
            variant={activeTab === 'chinese' ? 'default' : 'outline'}
            onClick={() => setActiveTab('chinese')}
            className="rounded-full"
          >
            Chinese Astrology
          </Button>
        </div>

        {/* Vedic Basics Tab */}
        {activeTab === 'vedic' && (
          <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-300">
            {vedicsTopics.map((topic) => (
              <Card key={topic.title} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <CardTitle className="text-2xl font-light">{topic.title}</CardTitle>
                  <CardDescription className="text-base">{topic.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{topic.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Advanced Vedic Tab */}
        {activeTab === 'advanced' && (
          <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-300">
            {advancedVedicTopics.map((topic) => (
              <Card key={topic.title} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <CardTitle className="text-2xl font-light">{topic.title}</CardTitle>
                  <CardDescription className="text-base">{topic.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{topic.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Chinese Astrology Tab */}
        {activeTab === 'chinese' && (
          <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-300">
            {chineseTopics.map((topic) => (
              <Card key={topic.title} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <CardTitle className="text-2xl font-light">{topic.title}</CardTitle>
                  <CardDescription className="text-base">{topic.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{topic.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
