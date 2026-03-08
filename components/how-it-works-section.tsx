"use client"

import { motion } from "framer-motion"

const steps = [
  {
    number: "01",
    title: "Enter Your Birth Details",
    description: "Provide your exact birth date, time, and location. Precision matters for accurate Nakshatra calculation.",
  },
  {
    number: "02",
    title: "Generate Your Birth Chart",
    description: "We calculate your Moon sign, Nakshatra, and other celestial positions using authentic Vedic methods.",
  },
  {
    number: "03",
    title: "Discover Compatible Souls",
    description: "Our algorithm matches you with others based on the 36-point Guna Milan system and AI insights.",
  },
  {
    number: "04",
    title: "Connect with Meaning",
    description: "Share detailed compatibility reports. Build relationships founded on cosmic harmony.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 px-6">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm tracking-[0.3em] uppercase">Your Journey</span>
          <h2 className="text-4xl md:text-5xl font-light mt-4">
            How It <span className="text-primary font-medium">Works</span>
          </h2>
        </motion.div>
        
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent hidden md:block" />
          
          <div className="space-y-12 md:space-y-0">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className={`relative md:grid md:grid-cols-2 md:gap-12 items-center ${
                  index % 2 === 0 ? "" : "md:flex-row-reverse"
                }`}
              >
                <div className={`${index % 2 === 0 ? "md:text-right md:pr-12" : "md:order-2 md:pl-12"}`}>
                  <span className="text-primary/40 text-6xl font-light">{step.number}</span>
                  <h3 className="text-2xl font-medium mt-2 mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
                
                {/* Timeline dot */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                
                <div className={`${index % 2 === 0 ? "md:order-2" : ""} hidden md:block`} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
