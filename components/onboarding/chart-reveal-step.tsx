"use client"

import React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Sparkles, Sun, Moon, ArrowUpRight } from "lucide-react"
import type { BirthData, VedicChart, UserProfile } from "@/lib/types"
import { getZodiacSymbol, getZodiacDescription, getTraitsFromChart } from "@/lib/birth-chart"
import { getNakshatraById } from "@/lib/guna-milan"

interface ChartRevealStepProps {
  personalInfo: {
    first_name?: string
    last_name?: string
    name?: string
    age?: number
    gender: 'male' | 'female' | 'other'
    bio?: string
    profile_image_url?: string
  }
  birthData: BirthData
  vedicChart: VedicChart
  onComplete: (profile?: UserProfile) => void
  onBack: () => void
}

export function ChartRevealStep({ 
  personalInfo, 
  birthData, 
  vedicChart, 
  onComplete, 
  onBack 
}: ChartRevealStepProps) {
  const [isRevealed, setIsRevealed] = useState(false)
  const traits = getTraitsFromChart(vedicChart)
  const nakshatra = getNakshatraById(vedicChart.nakshatra)

  const handleComplete = () => {
    onComplete()
  }

  return (
    <Card className="bg-card/80 backdrop-blur border-border/50">
      <CardHeader>
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="w-fit -ml-2 mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <CardTitle className="text-2xl font-light">Your Cosmic Blueprint</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isRevealed ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-24 h-24 mx-auto mb-8 rounded-full bg-primary/20 flex items-center justify-center"
            >
              <Sparkles className="w-12 h-12 text-primary" />
            </motion.div>
            <p className="text-lg text-muted-foreground mb-8">
              The stars have aligned, {personalInfo.first_name || personalInfo.name || 'traveler'}...
            </p>
            <Button size="lg" onClick={() => setIsRevealed(true)}>
              Reveal My Chart
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Main Signs */}
            <div className="grid grid-cols-3 gap-4">
              <SignCard 
                icon={<Sun className="w-5 h-5" />}
                label="Sun Sign"
                sign={vedicChart.sunSign}
              />
              <SignCard 
                icon={<Moon className="w-5 h-5" />}
                label="Moon Sign"
                sign={vedicChart.moonSign}
                highlighted
              />
              <SignCard 
                icon={<ArrowUpRight className="w-5 h-5" />}
                label="Rising"
                sign={vedicChart.risingSign}
              />
            </div>
            
            {/* Nakshatra */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-xl bg-primary/10 border border-primary/20"
            >
              <div className="text-center">
                <span className="text-sm text-primary uppercase tracking-wider">Birth Star (Nakshatra)</span>
                <h3 className="text-3xl font-light mt-2 text-primary">{vedicChart.nakshatraName}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Ruled by {vedicChart.nakshatraLord}
                </p>
              </div>
            </motion.div>
            
            {/* Traits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 gap-3"
            >
              <TraitCard label="Gana" value={traits.gana} description="Temperament" />
              <TraitCard label="Nadi" value={traits.nadi} description="Life Force" />
              <TraitCard label="Yoni" value={traits.yoni} description="Nature" />
              <TraitCard label="Varna" value={traits.varna} description="Purpose" />
            </motion.div>
            
            {/* Moon Sign Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="p-4 rounded-lg bg-secondary/50"
            >
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="text-foreground font-medium">Your Moon Sign ({vedicChart.moonSign}): </span>
                {getZodiacDescription(vedicChart.moonSign)}
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <Button size="lg" className="w-full" onClick={handleComplete}>
                Complete Profile & Find Matches
              </Button>
            </motion.div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}

function SignCard({ 
  icon, 
  label, 
  sign, 
  highlighted = false 
}: { 
  icon: React.ReactNode
  label: string
  sign: string
  highlighted?: boolean 
}) {
  return (
    <div className={`p-4 rounded-xl text-center ${
      highlighted ? 'bg-primary/10 border border-primary/30' : 'bg-secondary/50'
    }`}>
      <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
        highlighted ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
      }`}>
        {icon}
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-center justify-center gap-1 mt-1">
        <span className="text-2xl">{getZodiacSymbol(sign)}</span>
        <span className="text-lg font-light">{sign}</span>
      </div>
    </div>
  )
}

function TraitCard({ label, value, description }: { label: string; value: string; description: string }) {
  return (
    <div className="p-3 rounded-lg bg-secondary/30 text-center">
      <span className="text-xs text-muted-foreground">{label}</span>
      <p className="font-medium text-lg">{value}</p>
      <span className="text-xs text-primary/70">{description}</span>
    </div>
  )
}
