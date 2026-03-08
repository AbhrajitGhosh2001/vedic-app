"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface Star {
  id: number
  x: number
  y: number
  size: number
  delay: number
  duration: number
}

export function StarField() {
  const [stars, setStars] = useState<Star[]>([])
  
  useEffect(() => {
    const generatedStars: Star[] = []
    for (let i = 0; i < 100; i++) {
      generatedStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        delay: Math.random() * 3,
        duration: Math.random() * 2 + 2,
      })
    }
    setStars(generatedStars)
  }, [])
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-primary/60"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Constellation lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <motion.path
          d="M 10% 20% L 15% 25% L 20% 22% L 25% 28%"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          className="text-primary"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, delay: 1 }}
        />
        <motion.path
          d="M 70% 15% L 75% 20% L 80% 18% L 85% 25% L 82% 30%"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          className="text-primary"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, delay: 1.5 }}
        />
      </svg>
    </div>
  )
}
