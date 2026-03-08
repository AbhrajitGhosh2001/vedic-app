"use client"

import { motion } from "framer-motion"
import { Moon, Heart, Star, Users } from "lucide-react"

const features = [
  {
    icon: Moon,
    title: "Nakshatra Analysis",
    description: "Your birth Nakshatra reveals your deepest personality traits and emotional nature. We use precise lunar calculations.",
  },
  {
    icon: Heart,
    title: "36-Point Guna Milan",
    description: "The traditional 8-factor compatibility system that has guided marriages for millennia, adapted for modern connections.",
  },
  {
    icon: Star,
    title: "AI-Enhanced Insights",
    description: "Ancient wisdom meets modern technology. Our AI interprets your cosmic connection in meaningful ways.",
  },
  {
    icon: Users,
    title: "Meaningful Matches",
    description: "Connect only with those whose stars align with yours. Quality over quantity, destiny over chance.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 px-6 bg-card/50">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm tracking-[0.3em] uppercase">Ancient Wisdom</span>
          <h2 className="text-4xl md:text-5xl font-light mt-4 mb-6">
            The Science of <span className="text-primary font-medium">Cosmic Compatibility</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Vedic astrology offers a profound system for understanding relationship compatibility
            through the alignment of celestial bodies at the moment of birth.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group p-8 rounded-2xl bg-secondary/50 border border-border/50 hover:border-primary/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-medium mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
