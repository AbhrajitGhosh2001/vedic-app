"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl" />
      </div>
      
      <div className="container max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-6xl font-light mb-6">
            Ready to Find Your{" "}
            <span className="text-primary font-medium">Star-Crossed</span> Love?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands who have discovered meaningful connections through the wisdom of Vedic astrology.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-[#9b8bb8] hover:bg-[#8a7aa7] text-background text-lg px-10 py-6 rounded-full">
              <Link href="/auth/sign-up">Create Your Profile</Link>
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-8">
            Free to start. Your cosmic journey awaits.
          </p>
        </motion.div>
      </div>
      
      {/* Footer */}
      <footer className="mt-24 pt-8 border-t border-border/50">
        <div className="container max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>Geek Boost Media - Numerology & Zodiac Insights | Who Were You Meant to Be? | Who Is Your Perfect Match? | Decode the Universe Now!</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
          </div>
        </div>
      </footer>
    </section>
  )
}
