'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StarField } from '@/components/star-field'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Send, X, MessageCircle } from 'lucide-react'
import {
  PHILOSOPHERS,
  TRADITIONS,
  ZODIAC_GLYPHS,
  type Philosopher,
} from '@/lib/astrological-philosophers'

type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

/* ─────────────────────────────────────────────
   Helper: polar → cartesian
   ───────────────────────────────────────────── */
function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

/* ─────────────────────────────────────────────
   Flat-Earth Circle SVG
   ───────────────────────────────────────────── */
function FlatEarthCircle({
  selectedPhilosopher,
  onSelect,
}: {
  selectedPhilosopher: Philosopher | null
  onSelect: (p: Philosopher) => void
}) {
  const cx = 500
  const cy = 500
  const outerR = 460
  const earthR = 100
  const ringStart = earthR + 30
  const ringEnd = outerR - 40
  const ringCount = 12
  const ringWidth = (ringEnd - ringStart) / ringCount

  return (
    <svg
      viewBox="0 0 1000 1000"
      className="w-full max-w-[720px] mx-auto select-none"
      style={{ filter: 'drop-shadow(0 0 60px rgba(241,196,15,0.06))' }}
    >
      <defs>
        <radialGradient id="atmGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0a1628" />
          <stop offset="40%" stopColor="#0d1f3c" />
          <stop offset="70%" stopColor="#0a0f1a" />
          <stop offset="100%" stopColor="#050a12" />
        </radialGradient>
        <radialGradient id="earthGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a5c2a" />
          <stop offset="50%" stopColor="#14472a" />
          <stop offset="100%" stopColor="#0d2e1a" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glowSmall">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer glow rings */}
      <circle cx={cx} cy={cy} r={outerR + 12} fill="none" stroke="rgba(241,196,15,0.08)" strokeWidth={0.8} />
      <circle cx={cx} cy={cy} r={outerR + 6} fill="none" stroke="rgba(241,196,15,0.12)" strokeWidth={0.5} />

      {/* Atmosphere background */}
      <circle cx={cx} cy={cy} r={outerR} fill="url(#atmGrad)" />

      {/* Tradition ring arcs */}
      {TRADITIONS.map((t) => {
        const rInner = ringStart + t.ringIndex * ringWidth
        const rOuter = rInner + ringWidth - 2
        const startRad = ((t.startAngle - 90) * Math.PI) / 180
        const endRad = ((t.startAngle + t.sweepAngle - 90) * Math.PI) / 180

        const x1o = cx + rOuter * Math.cos(startRad)
        const y1o = cy + rOuter * Math.sin(startRad)
        const x2o = cx + rOuter * Math.cos(endRad)
        const y2o = cy + rOuter * Math.sin(endRad)
        const x1i = cx + rInner * Math.cos(endRad)
        const y1i = cy + rInner * Math.sin(endRad)
        const x2i = cx + rInner * Math.cos(startRad)
        const y2i = cy + rInner * Math.sin(startRad)
        const large = t.sweepAngle > 180 ? 1 : 0

        const path = `M ${x1o} ${y1o} A ${rOuter} ${rOuter} 0 ${large} 1 ${x2o} ${y2o} L ${x1i} ${y1i} A ${rInner} ${rInner} 0 ${large} 0 ${x2i} ${y2i} Z`

        const hasSelected = selectedPhilosopher?.tradition === t.name
        return (
          <path
            key={t.name}
            d={path}
            fill={`${t.color}${hasSelected ? '33' : '18'}`}
            stroke={`${t.color}${hasSelected ? '88' : '44'}`}
            strokeWidth={hasSelected ? 1.5 : 0.5}
            style={{ transition: 'all 0.4s ease' }}
          />
        )
      })}

      {/* Tradition labels along arcs */}
      {TRADITIONS.map((t) => {
        const rMid = ringStart + t.ringIndex * ringWidth + ringWidth / 2
        const midAngle = t.startAngle + t.sweepAngle / 2
        const pos = polar(cx, cy, rMid, midAngle)
        const hasSelected = selectedPhilosopher?.tradition === t.name
        return (
          <text
            key={`label-${t.name}`}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill={hasSelected ? t.color : `${t.color}99`}
            fontSize={8}
            fontWeight="bold"
            letterSpacing={1}
            style={{ textTransform: 'uppercase' as const, transition: 'fill 0.3s', pointerEvents: 'none' }}
          >
            {t.name.length > 14 ? t.name.split(' ')[0] : t.name}
          </text>
        )
      })}

      {/* Philosopher dots — clickable */}
      {PHILOSOPHERS.map((p) => {
        const r = ringStart + p.ringIndex * ringWidth + ringWidth / 2
        const pos = polar(cx, cy, r, p.angle)
        const isSelected = selectedPhilosopher?.id === p.id
        const isTraditionSelected = selectedPhilosopher?.tradition === p.tradition

        return (
          <g key={p.id} style={{ cursor: 'pointer' }} onClick={() => onSelect(p)}>
            {/* Hit area */}
            <circle cx={pos.x} cy={pos.y} r={16} fill="transparent" />
            {/* Glow ring for selected */}
            {isSelected && (
              <circle
                cx={pos.x} cy={pos.y} r={12}
                fill="none" stroke={p.color} strokeWidth={1.5}
                opacity={0.6} filter="url(#glow)"
              />
            )}
            {/* Dot */}
            <circle
              cx={pos.x} cy={pos.y}
              r={isSelected ? 6 : isTraditionSelected ? 5 : 4}
              fill={isSelected ? p.color : `${p.color}${isTraditionSelected ? 'cc' : '88'}`}
              stroke={isSelected ? '#fff' : 'none'}
              strokeWidth={isSelected ? 1.5 : 0}
              filter={isSelected ? 'url(#glowSmall)' : undefined}
              style={{ transition: 'all 0.3s ease' }}
            />
            {/* Name label */}
            <text
              x={pos.x}
              y={pos.y + (p.angle > 90 && p.angle < 270 ? -12 : 14)}
              textAnchor="middle"
              dominantBaseline="central"
              fill={isSelected ? '#f1c40f' : `${p.color}${isTraditionSelected ? 'dd' : '99'}`}
              fontSize={isSelected ? 9 : 7.5}
              fontWeight={isSelected ? 'bold' : 'normal'}
              style={{ transition: 'all 0.3s', pointerEvents: 'none' }}
            >
              {p.name}
            </text>
            {/* Era label */}
            <text
              x={pos.x}
              y={pos.y + (p.angle > 90 && p.angle < 270 ? -22 : 24)}
              textAnchor="middle"
              dominantBaseline="central"
              fill={`${p.color}66`}
              fontSize={6}
              style={{ pointerEvents: 'none' }}
            >
              {p.era}
            </text>
          </g>
        )
      })}

      {/* Flat earth disc */}
      <circle cx={cx} cy={cy} r={earthR} fill="url(#earthGrad)" stroke="rgba(200,230,255,0.25)" strokeWidth={2} />
      {/* Continent shapes */}
      <ellipse cx={cx - 20} cy={cy - 15} rx={35} ry={22} fill="#2d8a4e" opacity={0.5} />
      <ellipse cx={cx + 25} cy={cy + 8} rx={28} ry={18} fill="#2d8a4e" opacity={0.45} />
      <ellipse cx={cx - 8} cy={cy + 28} rx={22} ry={12} fill="#2d8a4e" opacity={0.35} />
      <ellipse cx={cx + 40} cy={cy - 22} rx={16} ry={12} fill="#2d8a4e" opacity={0.4} />
      {/* Ice rim */}
      <circle cx={cx} cy={cy} r={earthR} fill="none" stroke="rgba(200,230,255,0.2)" strokeWidth={3} />
      {/* Water shimmer */}
      <circle cx={cx} cy={cy} r={earthR - 3} fill="none" stroke="rgba(41,128,185,0.15)" strokeWidth={2} />

      {/* Center label */}
      <text x={cx} y={cy - 8} textAnchor="middle" fill="#f1c40f" fontSize={10} fontWeight="bold" letterSpacing={2.5} opacity={0.9}>
        ASTROLOGICAL
      </text>
      <text x={cx} y={cy + 6} textAnchor="middle" fill="#f1c40f" fontSize={8.5} fontWeight="bold" letterSpacing={3} opacity={0.7}>
        THOUGHT
      </text>
      <text x={cx} y={cy + 18} textAnchor="middle" fill="#f1c40f" fontSize={8.5} fontWeight="bold" letterSpacing={3} opacity={0.7}>
        PATHS
      </text>

      {/* Zodiac glyph ring */}
      {ZODIAC_GLYPHS.map((z) => {
        const pos = polar(cx, cy, outerR - 16, z.angle)
        return (
          <text
            key={z.name}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#f1c40f"
            fontSize={18}
            opacity={0.7}
          >
            {z.glyph}
          </text>
        )
      })}

      {/* Outer rim dots */}
      {Array.from({ length: 72 }).map((_, i) => {
        const pos = polar(cx, cy, outerR + 2, i * 5)
        return (
          <circle
            key={`dot-${i}`}
            cx={pos.x}
            cy={pos.y}
            r={0.8}
            fill="rgba(241,196,15,0.25)"
          />
        )
      })}
    </svg>
  )
}

/* ─────────────────────────────────────────────
   Chat panel — streams AI as the philosopher
   ───────────────────────────────────────────── */
function PhilosopherChat({
  philosopher,
  onClose,
}: {
  philosopher: Philosopher
  onClose: () => void
}) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  // Reset messages when philosopher changes
  useEffect(() => {
    setMessages([])
    setStreamingContent('')
  }, [philosopher.id])

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, streamingContent])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setStreamingContent('')
    
    try {
      const response = await fetch('/api/philosopher-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          philosopherId: philosopher.id,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to get response')
      }
      
      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')
      
      const decoder = new TextDecoder()
      let fullContent = ''
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = decoder.decode(value, { stream: true })
        fullContent += chunk
        setStreamingContent(fullContent)
      }
      
      // Add assistant message
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fullContent,
      }
      setMessages(prev => [...prev, assistantMessage])
      setStreamingContent('')
      
    } catch (error) {
      console.error('Chat error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="bg-card/40 border-border/30 overflow-hidden backdrop-blur-sm">
        {/* Colored header bar */}
        <div
          className="h-1.5 w-full"
          style={{ background: `linear-gradient(90deg, ${philosopher.color}, transparent)` }}
        />

        {/* Header */}
        <div className="flex items-start justify-between p-5 pb-3">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
              style={{
                background: `${philosopher.color}22`,
                color: philosopher.color,
                border: `2px solid ${philosopher.color}44`,
              }}
            >
              {philosopher.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">{philosopher.name}</h3>
              <p className="text-sm text-muted-foreground">
                {philosopher.tradition} &middot; {philosopher.era}
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1 leading-relaxed max-w-md">
                {philosopher.description}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted/30 transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Close chat"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="px-5 pb-3 space-y-4 max-h-[400px] overflow-y-auto">
          {messages.length === 0 && (
            <div className="py-8 text-center">
              <MessageCircle size={32} className="mx-auto mb-3 text-muted-foreground/40" />
              <p className="text-muted-foreground text-sm">
                Ask {philosopher.name} a question about life, the stars, or your destiny...
              </p>
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-primary/20 text-foreground rounded-br-sm'
                    : 'bg-muted/20 text-foreground/90 rounded-bl-sm'
                }`}
                style={
                  msg.role === 'assistant'
                    ? { borderLeft: `3px solid ${philosopher.color}44` }
                    : undefined
                }
              >
                {msg.role === 'assistant' && (
                  <span
                    className="text-xs font-semibold block mb-1"
                    style={{ color: philosopher.color }}
                  >
                    {philosopher.name}
                  </span>
                )}
                <span className="whitespace-pre-wrap">{msg.content}</span>
              </div>
            </div>
          ))}
          {/* Streaming response */}
          {isLoading && streamingContent && (
            <div className="flex justify-start">
              <div
                className="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed bg-muted/20 text-foreground/90 rounded-bl-sm"
                style={{ borderLeft: `3px solid ${philosopher.color}44` }}
              >
                <span
                  className="text-xs font-semibold block mb-1"
                  style={{ color: philosopher.color }}
                >
                  {philosopher.name}
                </span>
                <span className="whitespace-pre-wrap">{streamingContent}</span>
              </div>
            </div>
          )}
          {/* Loading dots */}
          {isLoading && !streamingContent && (
            <div className="flex justify-start">
              <div className="bg-muted/20 rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-pulse" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-pulse" style={{ animationDelay: '200ms' }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-pulse" style={{ animationDelay: '400ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 pt-2 border-t border-border/20">
          <div className="flex items-center gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask ${philosopher.name}...`}
              disabled={isLoading}
              className="flex-1 bg-muted/20 border border-border/30 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
              style={{ ['--tw-ring-color' as string]: `${philosopher.color}44` }}
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              size="icon"
              className="shrink-0 h-11 w-11 rounded-xl"
              style={{
                background: philosopher.color,
                opacity: !input.trim() || isLoading ? 0.4 : 1,
              }}
            >
              <Send size={16} className="text-white" />
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   Main page
   ───────────────────────────────────────────── */
export default function QuestionsPage() {
  const [selectedPhilosopher, setSelectedPhilosopher] = useState<Philosopher | null>(null)
  const chatRef = useRef<HTMLDivElement>(null)

  function handleSelect(p: Philosopher) {
    setSelectedPhilosopher(p)
    setTimeout(() => {
      chatRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 200)
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <StarField />

      {/* Header */}
      <div className="relative z-10 pt-24 pb-6 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
              Astrological Thought Paths
            </h1>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto leading-relaxed text-balance">
              Select a philosopher or tradition on the map below. Ask them any
              question and receive wisdom from their unique astrological perspective,
              spanning 4,000+ years across 12 civilizations.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Flat-earth circle */}
      <div className="relative z-10 px-4 pb-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <FlatEarthCircle
              selectedPhilosopher={selectedPhilosopher}
              onSelect={handleSelect}
            />
          </motion.div>

          {/* Stats line */}
          <p className="text-center text-xs text-muted-foreground/50 mt-2 tracking-widest">
            12 Major Traditions &middot; {PHILOSOPHERS.length} Philosophers &middot; 4,000+ Years of Astrological Thought
          </p>
        </div>
      </div>

      {/* Philosopher selector chips (mobile-friendly) */}
      <div className="relative z-10 px-4 pb-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap justify-center gap-2">
            {PHILOSOPHERS.map((p) => {
              const isSelected = selectedPhilosopher?.id === p.id
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelect(p)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={{
                    background: isSelected ? `${p.color}33` : 'rgba(255,255,255,0.04)',
                    color: isSelected ? p.color : 'rgba(255,255,255,0.5)',
                    border: `1px solid ${isSelected ? `${p.color}66` : 'rgba(255,255,255,0.08)'}`,
                  }}
                >
                  {p.name}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Chat panel */}
      <div ref={chatRef} className="relative z-10 px-4 pb-24">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {selectedPhilosopher && (
              <PhilosopherChat
                key={selectedPhilosopher.id}
                philosopher={selectedPhilosopher}
                onClose={() => setSelectedPhilosopher(null)}
              />
            )}
          </AnimatePresence>

          {!selectedPhilosopher && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/10 flex items-center justify-center border border-border/20">
                <MessageCircle size={28} className="text-muted-foreground/40" />
              </div>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Click on any philosopher dot in the circle above, or select one from the chips,
                to begin a conversation across time and tradition.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
