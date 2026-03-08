"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"

interface StepIndicatorProps {
  steps: string[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div className="flex flex-col items-center">
            <motion.div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                index < currentStep
                  ? "bg-primary border-primary text-primary-foreground"
                  : index === currentStep
                  ? "border-primary text-primary"
                  : "border-border text-muted-foreground"
              }`}
              initial={false}
              animate={{
                scale: index === currentStep ? 1.1 : 1
              }}
            >
              {index < currentStep ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </motion.div>
            <span className={`text-xs mt-2 ${
              index <= currentStep ? "text-foreground" : "text-muted-foreground"
            }`}>
              {step}
            </span>
          </div>
          
          {index < steps.length - 1 && (
            <div className={`w-12 h-0.5 mx-2 transition-colors ${
              index < currentStep ? "bg-primary" : "bg-border"
            }`} />
          )}
        </div>
      ))}
    </div>
  )
}
