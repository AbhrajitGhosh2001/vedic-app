'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StarField } from '@/components/star-field'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Send, X, MessageCircle, Trash2, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  PHILOSOPHERS,
  TRADITIONS,
  ZODIAC_GLYPHS,
  type Philosopher,
} from '@/lib/astrological-philosophers'
import {
  createHappeningsConversation,
  getHappeningsConversations,
  getHappeningsMessages,
  deleteHappeningsConversation,
  saveHappeningsMessage,
} from '@/app/actions/happenings'

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

/* ─────────────────────────────────────────────
   Main Happenings Page
   ───────────────────────────────────────────── */
export default function HappeningsPage() {
  const router = useRouter()
  const [isAuthChecking, setIsAuthChecking] = useState(true)
  const [selectedPhilosopher, setSelectedPhilosopher] = useState<Philosopher | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [conversations, setConversations] = useState<any[]>([])
  const [isLoadingConversations, setIsLoadingConversations] = useState(true)
  const [isLoadingMessage, setIsLoadingMessage] = useState(false)
  const [userInput, setUserInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push('/auth/login')
        return
      }

      setIsAuthChecking(false)
      loadConversations()
    }

    checkAuth()
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadConversations = async () => {
    try {
      const convs = await getHappeningsConversations()
      setConversations(convs)
    } catch (error) {
      console.error('[v0] Failed to load conversations:', error)
    } finally {
      setIsLoadingConversations(false)
    }
  }

  const handleSelectPhilosopher = async (philosopher: Philosopher) => {
    console.log('[v0] Selected philosopher:', philosopher.name)
    setSelectedPhilosopher(philosopher)
    setMessages([])

    try {
      // Create new conversation
      console.log('[v0] Creating conversation for philosopher:', philosopher.id)
      const conv = await createHappeningsConversation(philosopher.id, philosopher.name)
      console.log('[v0] Conversation created:', conv.id)
      setConversationId(conv.id)
      await loadConversations()
    } catch (error) {
      console.error('[v0] Failed to create conversation:', error)
      alert('Failed to create conversation: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const handleLoadConversation = async (conv: any) => {
    try {
      console.log('[v0] Loading conversation:', conv.id)
      const philosopher = PHILOSOPHERS.find((p) => p.id === conv.philosopher_id)
      if (philosopher) {
        console.log('[v0] Found philosopher:', philosopher.name)
        setSelectedPhilosopher(philosopher)
        setConversationId(conv.id)

        // Load messages from this conversation
        console.log('[v0] Loading messages for conversation')
        const loadedMessages = await getHappeningsMessages(conv.id)
        console.log('[v0] Loaded messages:', loadedMessages.length)
        // Convert to ChatMessage type
        const chatMessages: ChatMessage[] = loadedMessages.map((m: any) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }))
        setMessages(chatMessages)
      } else {
        console.error('[v0] Philosopher not found for ID:', conv.philosopher_id)
      }
    } catch (error) {
      console.error('[v0] Failed to load conversation:', error)
    }
  }

  const handleDeleteConversation = async (convId: string) => {
    try {
      await deleteHappeningsConversation(convId)
      await loadConversations()
      if (conversationId === convId) {
        setConversationId(null)
        setSelectedPhilosopher(null)
        setMessages([])
      }
    } catch (error) {
      console.error('[v0] Failed to delete conversation:', error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('[v0] Form submitted - input:', userInput, 'convId:', conversationId)
    
    if (!userInput?.trim() || !selectedPhilosopher || !conversationId) {
      console.log('[v0] Validation failed - returning')
      return
    }

    const message = userInput.trim()
    setIsLoadingMessage(true)

    try {
      // Clear input immediately
      setUserInput('')
      console.log('[v0] Input cleared, saving user message')
      
      // Save user message to database
      await saveHappeningsMessage(conversationId, 'user', message, selectedPhilosopher.id)
      console.log('[v0] User message saved')

      // Get existing messages to build conversation history
      const existingMessages = messages.map(m => ({ role: m.role, content: m.content }))
      
      // Call API directly with proper message format
      console.log('[v0] Calling API with messages:', existingMessages.length + 1)
      const response = await fetch('/api/philosopher-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...existingMessages,
            { role: 'user', content: message }
          ],
          philosopherId: selectedPhilosopher.id,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || `API error: ${response.status}`)
      }

      console.log('[v0] API response received, reading stream')

      // Read the response stream (Groq SSE format)
      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')

      let assistantMessage = ''
      const decoder = new TextDecoder()
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              const content = data.choices?.[0]?.delta?.content
              if (content) {
                assistantMessage += content
              }
            } catch (e) {
              // Ignore parse errors for non-JSON lines
            }
          }
        }
      }

      console.log('[v0] Assistant message received:', assistantMessage.substring(0, 50))

      // Save assistant message to database
      if (assistantMessage) {
        await saveHappeningsMessage(conversationId, 'assistant', assistantMessage, selectedPhilosopher.id)
        console.log('[v0] Assistant message saved')
      }

      // Add messages to chat display
      const newMessages: ChatMessage[] = [
        ...messages,
        { role: 'user', content: message },
        { role: 'assistant', content: assistantMessage }
      ]
      setMessages(newMessages)
      console.log('[v0] Messages updated:', newMessages.length)

    } catch (error) {
      console.error('[v0] Message send failed:', error)
      setUserInput(message) // Restore input on error
      alert('Failed to send message: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsLoadingMessage(false)
    }
  }

  return (
    <>
      {isAuthChecking ? (
        <main className="min-h-screen bg-black flex items-center justify-center">
          <StarField />
          <div className="relative z-10 text-center">
            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
              <p className="text-amber-400">Authenticating...</p>
            </motion.div>
          </div>
        </main>
      ) : (
        <main className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-foreground relative overflow-hidden">
          <StarField />

          <div className="relative z-10 flex flex-col md:flex-row h-screen">
            {/* Left Sidebar - Philosopher Picker (Hidden on mobile, visible on md+) */}
            <div className="hidden md:flex md:w-72 bg-black/40 border-r border-purple-500/10 overflow-y-auto flex-col">
              <div className="p-4 border-b border-purple-500/10">
                <h3 className="text-xs font-bold text-purple-400 mb-3">Choose a Philosopher</h3>
              </div>
              <div className="flex-1 space-y-2 p-4 overflow-y-auto">
                {PHILOSOPHERS.map((philosopher) => (
                  <button
                    key={philosopher.id}
                    onClick={() => handleSelectPhilosopher(philosopher)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all text-xs ${
                      selectedPhilosopher?.id === philosopher.id
                        ? 'bg-purple-600/30 border-purple-500/50 text-purple-100'
                        : 'bg-card/20 border-card/30 text-muted-foreground hover:bg-card/40 hover:border-purple-500/30'
                    }`}
                  >
                    <p className="font-semibold">{philosopher.name}</p>
                    <p className="text-xs opacity-75">{philosopher.era}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
              {/* Mobile Philosopher Selector (Sticky) */}
              <div className="md:hidden sticky top-0 z-20 border-b border-purple-500/10 bg-black/40 backdrop-blur-sm p-3">
                <select
                  value={selectedPhilosopher?.id || ''}
                  onChange={(e) => {
                    const phil = PHILOSOPHERS.find((p) => p.id === e.target.value)
                    if (phil) handleSelectPhilosopher(phil)
                  }}
                  className="w-full bg-black/30 border border-purple-500/20 rounded-lg px-3 py-2 text-sm text-foreground font-semibold"
                >
                  <option value="">👤 Select a Philosopher...</option>
                  {PHILOSOPHERS.map((philosopher) => (
                    <option key={philosopher.id} value={philosopher.id}>
                      {philosopher.name} ({philosopher.era})
                    </option>
                  ))}
                </select>
              </div>

              {/* Chat Header */}
              {selectedPhilosopher && (
                <div className="border-b border-amber-500/10 bg-black/20 p-3 md:p-4">
                  <h2 className="text-base md:text-lg font-bold text-purple-300">{selectedPhilosopher.name}</h2>
                  <p className="text-xs text-muted-foreground">{selectedPhilosopher.description}</p>
                </div>
              )}

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                {!selectedPhilosopher ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                    <h1 className="text-2xl md:text-3xl font-bold text-amber-400 mb-2">Ask the Philosophers</h1>
                    <p className="text-muted-foreground text-xs md:text-sm mb-4">
                      Select a philosopher {window.innerWidth < 768 ? 'above' : 'from the left'} to begin your conversation
                    </p>
                    <p className="text-muted-foreground text-xs">Choose from ancient to modern thinkers and explore their perspectives</p>
                  </motion.div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Start a conversation with {selectedPhilosopher.name}</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const content = msg.content || ''
                    if (!content) return null
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs md:max-w-md px-4 py-3 rounded-lg text-sm break-words ${
                            msg.role === 'user'
                              ? 'bg-amber-600/30 border border-amber-500/30 text-amber-100'
                              : 'bg-purple-600/20 border border-purple-500/30 text-purple-100'
                          }`}
                        >
                          {content}
                        </div>
                      </motion.div>
                    )
                  })
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              {selectedPhilosopher && (
                <form onSubmit={handleSendMessage} className="border-t border-amber-500/10 bg-black/20 p-3 md:p-4 flex gap-2">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Ask your question..."
                    className="flex-1 bg-black/30 border border-amber-500/20 rounded-lg px-3 md:px-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-amber-500/50 focus:outline-none"
                    disabled={isLoadingMessage}
                  />
                  <Button
                    type="submit"
                    disabled={isLoadingMessage || !(userInput?.trim())}
                    className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-black font-semibold h-10 px-4 md:px-6 flex-shrink-0"
                  >
                    {isLoadingMessage ? '...' : <Send className="w-4 h-4" />}
                  </Button>
                </form>
              )}
            </div>

            {/* Right Sidebar - Conversation History (Hidden on mobile, visible on md+) */}
            <div className="hidden md:flex md:w-72 bg-black/40 border-l border-amber-500/10 overflow-y-auto flex-col">
              <div className="p-4 border-b border-amber-500/10">
                <h2 className="text-sm font-bold text-amber-400 mb-3">Conversations</h2>
                <Button
                  onClick={() => {
                    setConversationId(null)
                    setSelectedPhilosopher(null)
                    setMessages([])
                    setUserInput('')
                  }}
                  className="w-full h-9 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 text-amber-400 text-xs"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Chat
                </Button>
              </div>

              {isLoadingConversations ? (
                <div className="p-4 text-muted-foreground text-sm">Loading...</div>
              ) : conversations.length === 0 ? (
                <div className="p-4 text-muted-foreground text-xs">No conversations yet. Start chatting to create one.</div>
              ) : (
                <div className="flex-1 space-y-2 p-4 overflow-y-auto">
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      className={`group p-3 rounded-lg cursor-pointer transition-all ${
                        conversationId === conv.id
                          ? 'bg-amber-500/20 border border-amber-500/40'
                          : 'bg-card/20 border border-card/30 hover:bg-card/40'
                      }`}
                      onClick={() => handleLoadConversation(conv)}
                    >
                      <p className="text-xs font-semibold text-amber-400 truncate">{conv.philosopher_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{conv.title}</p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-muted-foreground">{new Date(conv.updated_at).toLocaleDateString()}</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteConversation(conv.id)
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3 text-red-400/60 hover:text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      )}
    </>
  )
}
