"use client"

import { motion } from "framer-motion"
import type { PlanetPlacement } from "@/lib/astrology-insights"

const zodiacSigns = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
]

const zodiacSymbols: Record<string, string> = {
  'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
  'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
  'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
}

const planetSymbols: Record<string, string> = {
  'Sun': '☉', 'Moon': '☽', 'Mars': '♂', 'Mercury': '☿',
  'Jupiter': '♃', 'Venus': '♀', 'Saturn': '♄', 'Rahu': '☊', 'Ketu': '☋'
}

const planetColors: Record<string, string> = {
  'Sun': '#FFD700', 'Moon': '#C0C0C0', 'Mars': '#FF4444',
  'Mercury': '#90EE90', 'Jupiter': '#FFB347', 'Venus': '#FFB6C1',
  'Saturn': '#708090', 'Rahu': '#9370DB', 'Ketu': '#8B4513'
}

interface ChartWheelProps {
  lagna: string
  planets: PlanetPlacement[]
}

export function ChartWheel({ lagna, planets }: ChartWheelProps) {
  const lagnaIndex = zodiacSigns.indexOf(lagna)
  
  // Rearrange signs starting from Lagna
  const orderedSigns = [
    ...zodiacSigns.slice(lagnaIndex),
    ...zodiacSigns.slice(0, lagnaIndex)
  ]

  // Group planets by house
  const planetsByHouse: Record<number, PlanetPlacement[]> = {}
  for (const planet of planets) {
    if (!planetsByHouse[planet.house]) {
      planetsByHouse[planet.house] = []
    }
    planetsByHouse[planet.house].push(planet)
  }

  return (
    <div className="relative w-full max-w-md mx-auto aspect-square">
      {/* Outer ring with signs */}
      <svg viewBox="0 0 400 400" className="w-full h-full">
        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        
        {/* Background circles */}
        <circle cx="200" cy="200" r="190" fill="none" stroke="hsl(var(--border))" strokeWidth="1" strokeOpacity="0.3" />
        <circle cx="200" cy="200" r="140" fill="none" stroke="hsl(var(--border))" strokeWidth="1" strokeOpacity="0.3" />
        <circle cx="200" cy="200" r="90" fill="url(#chartGradient)" stroke="hsl(var(--primary))" strokeWidth="2" strokeOpacity="0.5" />
        
        {/* House divisions */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180)
          const x1 = 200 + 90 * Math.cos(angle)
          const y1 = 200 + 90 * Math.sin(angle)
          const x2 = 200 + 190 * Math.cos(angle)
          const y2 = 200 + 190 * Math.sin(angle)
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="hsl(var(--border))"
              strokeWidth="1"
              strokeOpacity="0.3"
            />
          )
        })}
        
        {/* Zodiac signs in outer ring */}
        {orderedSigns.map((sign, i) => {
          const angle = ((i * 30) + 15 - 90) * (Math.PI / 180)
          const x = 200 + 165 * Math.cos(angle)
          const y = 200 + 165 * Math.sin(angle)
          const isLagna = i === 0
          
          return (
            <g key={sign}>
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className={`text-xl ${isLagna ? 'fill-primary' : 'fill-muted-foreground'}`}
                style={{ fontSize: '20px' }}
              >
                {zodiacSymbols[sign]}
              </text>
            </g>
          )
        })}
        
        {/* House numbers */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = ((i * 30) + 15 - 90) * (Math.PI / 180)
          const x = 200 + 115 * Math.cos(angle)
          const y = 200 + 115 * Math.sin(angle)
          
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground text-xs"
              style={{ fontSize: '10px' }}
            >
              {i + 1}
            </text>
          )
        })}
        
        {/* Planets in houses */}
        {Object.entries(planetsByHouse).map(([house, housePlanets]) => {
          const houseNum = parseInt(house)
          const angle = ((houseNum - 1) * 30 + 15 - 90) * (Math.PI / 180)
          
          return housePlanets.map((planet, planetIndex) => {
            const offset = (planetIndex - (housePlanets.length - 1) / 2) * 15
            const radius = 60 - planetIndex * 5
            const x = 200 + radius * Math.cos(angle) + offset * Math.cos(angle + Math.PI / 2)
            const y = 200 + radius * Math.sin(angle) + offset * Math.sin(angle + Math.PI / 2)
            
            return (
              <motion.g
                key={planet.planet}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: planetIndex * 0.1 + houseNum * 0.05 }}
              >
                <circle
                  cx={x}
                  cy={y}
                  r="12"
                  fill={planetColors[planet.planet]}
                  fillOpacity="0.2"
                  stroke={planetColors[planet.planet]}
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ fontSize: '14px', fill: planetColors[planet.planet] }}
                >
                  {planetSymbols[planet.planet]}
                </text>
              </motion.g>
            )
          })
        })}
        
        {/* Center text */}
        <text
          x="200"
          y="195"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-primary font-bold"
          style={{ fontSize: '14px' }}
        >
          {zodiacSymbols[lagna]}
        </text>
        <text
          x="200"
          y="212"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-muted-foreground"
          style={{ fontSize: '10px' }}
        >
          Lagna
        </text>
      </svg>
      
      {/* Legend */}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {planets.map((planet) => (
          <div key={planet.planet} className="flex items-center gap-1 text-xs">
            <span style={{ color: planetColors[planet.planet] }}>{planetSymbols[planet.planet]}</span>
            <span className="text-muted-foreground">{planet.planet}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
