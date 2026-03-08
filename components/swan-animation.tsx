"use client"

import { motion } from "framer-motion"

export function SwanAnimation() {
  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-full max-w-3xl pointer-events-none">
      <div className="relative h-48 md:h-64">
        {/* Left Swan */}
        <motion.div
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
          className="absolute left-1/4 bottom-0"
        >
          <motion.svg
            width="120"
            height="100"
            viewBox="0 0 120 100"
            fill="none"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="text-primary/70"
          >
            {/* Swan body */}
            <ellipse cx="60" cy="75" rx="35" ry="20" fill="currentColor" opacity="0.9" />
            {/* Swan neck */}
            <path
              d="M75 65 Q85 40, 75 25 Q70 15, 80 10"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            {/* Swan head */}
            <circle cx="80" cy="12" r="8" fill="currentColor" />
            {/* Beak */}
            <path d="M88 12 L98 10 L88 14" fill="#e6a84d" />
            {/* Wing detail */}
            <path
              d="M45 70 Q55 55, 70 60"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              opacity="0.6"
            />
          </motion.svg>
        </motion.div>
        
        {/* Right Swan - facing left */}
        <motion.div
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.2, ease: "easeOut" }}
          className="absolute right-1/4 bottom-0"
        >
          <motion.svg
            width="120"
            height="100"
            viewBox="0 0 120 100"
            fill="none"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="text-primary/70 scale-x-[-1]"
          >
            {/* Swan body */}
            <ellipse cx="60" cy="75" rx="35" ry="20" fill="currentColor" opacity="0.9" />
            {/* Swan neck */}
            <path
              d="M75 65 Q85 40, 75 25 Q70 15, 80 10"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            {/* Swan head */}
            <circle cx="80" cy="12" r="8" fill="currentColor" />
            {/* Beak */}
            <path d="M88 12 L98 10 L88 14" fill="#e6a84d" />
            {/* Wing detail */}
            <path
              d="M45 70 Q55 55, 70 60"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              opacity="0.6"
            />
          </motion.svg>
        </motion.div>
        
        {/* Lotus between swans */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute left-1/2 -translate-x-1/2 bottom-4"
        >
          <motion.svg
            width="60"
            height="50"
            viewBox="0 0 60 50"
            fill="none"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Lotus petals */}
            <path d="M30 25 Q20 10, 30 0 Q40 10, 30 25" fill="#f0a0b0" opacity="0.8" />
            <path d="M30 25 Q15 20, 10 10 Q25 15, 30 25" fill="#f0a0b0" opacity="0.7" />
            <path d="M30 25 Q45 20, 50 10 Q35 15, 30 25" fill="#f0a0b0" opacity="0.7" />
            <path d="M30 25 Q10 25, 5 20 Q20 22, 30 25" fill="#f0a0b0" opacity="0.6" />
            <path d="M30 25 Q50 25, 55 20 Q40 22, 30 25" fill="#f0a0b0" opacity="0.6" />
            {/* Center */}
            <circle cx="30" cy="28" r="5" fill="#d4af37" />
          </motion.svg>
        </motion.div>
        
        {/* Water ripples */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full"
        >
          <svg width="100%" height="20" viewBox="0 0 400 20" preserveAspectRatio="none">
            <motion.ellipse
              cx="200"
              cy="10"
              rx="150"
              ry="5"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-primary/30"
              animate={{ rx: [150, 180, 150] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.ellipse
              cx="200"
              cy="10"
              rx="100"
              ry="3"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-primary/20"
              animate={{ rx: [100, 130, 100] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
          </svg>
        </motion.div>
      </div>
    </div>
  )
}
