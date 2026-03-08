"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SwanAnimation } from "./swan-animation"
import { StarField } from "./star-field"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <StarField />
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />
      
      <div className="container relative z-10 px-6 py-20">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <span className="text-primary/80 text-sm tracking-[0.3em] uppercase font-medium">
              Numerology & Zodiac Insights
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight mb-6 text-balance"
          >
            Decode Your{" "}
            <span className="text-primary font-medium">Cosmic</span>{" "}
            Blueprint
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mb-12 leading-relaxed"
          >
            Numerology & Zodiac Insights | Who Were You Meant to Be? | Who Is Your Perfect Match? | Decode the Universe Now!
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button asChild size="lg" className="bg-[#9b8bb8] hover:bg-[#8a7aa7] text-background text-lg px-8 py-6 rounded-full">
              <Link href="/auth/sign-up">Begin Your Journey</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full border-primary/30 hover:bg-primary/10 bg-transparent">
              <Link href="#how-it-works">Learn More</Link>
            </Button>
          </motion.div>
        </div>
        
        <SwanAnimation />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
