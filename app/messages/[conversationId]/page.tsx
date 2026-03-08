'use client'

import React from "react"

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { StarField } from '@/components/star-field'
import { getMessages, sendMessage, getConversationPartner } from '@/app/actions/messages'
import { ArrowLeft, Send, Sparkles } from 'lucide-react'

interface Message {
  id: string
  content: string
  sender_id: string
  created_at: string
  is_read: boolean
}

interface Partner {
  id: string
  first_name: string
  last_name?: string
  profile_image_url?: string
  moon_sign?: string
  sun_sign?: string
}

export default function ChatPage({ params }: { params: { conversationId: string } }) {
  const conversationId = params.conversationId
  const [messages, setMessages] = useState<Message[]>([])
  const [partner, setPartner] = useState<Partner | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    async function loadChat() {
      const [messagesResult, partnerResult] = await Promise.all([
        getMessages(conversationId),
        getConversationPartner(conversationId)
      ])

      if (messagesResult.messages) {
        setMessages(messagesResult.messages)
      }
      if (messagesResult.currentUserId) {
        setCurrentUserId(messagesResult.currentUserId)
      }
      if (partnerResult.partner) {
        setPartner(partnerResult.partner)
      }
      setLoading(false)
    }
    loadChat()
  }, [conversationId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Poll for new messages every 5 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      const result = await getMessages(conversationId)
      if (result.messages) {
        setMessages(result.messages)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [conversationId])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)
    const result = await sendMessage(conversationId, newMessage)
    
    if (result.message) {
      setMessages([...messages, result.message])
      setNewMessage('')
    }
    setSending(false)
  }

  function formatTime(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    }
    return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })
  }

  // Group messages by date
  function groupMessagesByDate(msgs: Message[]) {
    const groups: { date: string; messages: Message[] }[] = []
    let currentDate = ''

    msgs.forEach((msg) => {
      const msgDate = new Date(msg.created_at).toDateString()
      if (msgDate !== currentDate) {
        currentDate = msgDate
        groups.push({ date: msg.created_at, messages: [msg] })
      } else {
        groups[groups.length - 1].messages.push(msg)
      }
    })

    return groups
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading conversation...</div>
      </div>
    )
  }

  const messageGroups = groupMessagesByDate(messages)

  return (
    <div className="min-h-screen bg-background relative flex flex-col">
      <StarField />
      
      {/* Header */}
      <div className="relative z-10 border-b border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/messages')}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          {partner && (
            <div 
              className="flex items-center gap-3 flex-1 cursor-pointer"
              onClick={() => router.push(`/compatibility/me/${partner.id}`)}
            >
              <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                {partner.profile_image_url ? (
                  <Image
                    src={partner.profile_image_url || "/placeholder.svg"}
                    alt={partner.first_name}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg font-bold text-muted-foreground">
                    {partner.first_name[0]}
                  </div>
                )}
              </div>
              <div>
                <h2 className="font-semibold">
                  {partner.first_name} {partner.last_name || ''}
                </h2>
                {partner.moon_sign && (
                  <p className="text-xs text-primary flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {partner.sun_sign} Sun, {partner.moon_sign} Moon
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="relative z-10 flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-4 space-y-6">
          {messages.length === 0 ? (
            <Card className="bg-card/60 backdrop-blur-sm border-border/50 p-6 text-center my-8">
              <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Start the cosmic connection</h3>
              <p className="text-sm text-muted-foreground">
                Send your first message to {partner?.first_name}!
              </p>
            </Card>
          ) : (
            messageGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                {/* Date separator */}
                <div className="flex items-center gap-4 my-4">
                  <div className="flex-1 h-px bg-border/50" />
                  <span className="text-xs text-muted-foreground px-2">
                    {formatDate(group.date)}
                  </span>
                  <div className="flex-1 h-px bg-border/50" />
                </div>

                {/* Messages for this date */}
                <div className="space-y-3">
                  {group.messages.map((msg) => {
                    const isOwn = msg.sender_id === currentUserId
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                            isOwn
                              ? 'bg-primary text-primary-foreground rounded-br-md'
                              : 'bg-card border border-border/50 rounded-bl-md'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                          <p className={`text-xs mt-1 ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                            {formatTime(msg.created_at)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="relative z-10 border-t border-border/50 bg-card/80 backdrop-blur-sm">
        <form onSubmit={handleSend} className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-input border-border/50"
              disabled={sending}
            />
            <Button 
              type="submit" 
              size="icon"
              disabled={!newMessage.trim() || sending}
              className="shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
