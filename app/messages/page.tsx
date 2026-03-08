'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { StarField } from '@/components/star-field'
import { getConversations } from '@/app/actions/messages'
import { MessageCircle, Clock } from 'lucide-react'

interface Conversation {
  id: string
  partner: {
    id: string
    first_name: string
    last_name?: string
    profile_image_url?: string
    moon_sign?: string
  } | null
  lastMessage?: {
    content: string
    created_at: string
    sender_id: string
  }
  unreadCount: number
  last_message_at: string
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function loadConversations() {
      const result = await getConversations()
      if (result.conversations) {
        setConversations(result.conversations as Conversation[])
      }
      if (result.currentUserId) {
        setCurrentUserId(result.currentUserId)
      }
      setLoading(false)
    }
    loadConversations()
  }, [])

  function formatTime(dateString: string) {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffDays === 1) {
      return 'Yesterday'
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' })
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading conversations...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative">
      <StarField />
      
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Cosmic <span className="text-primary">Messages</span>
          </h1>
          <p className="text-muted-foreground">
            Connect with your celestial matches
          </p>
        </div>

        {conversations.length === 0 ? (
          <Card className="bg-card/80 backdrop-blur-sm border-border/50 p-8 text-center">
            <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
            <p className="text-muted-foreground mb-4">
              Start a conversation by messaging one of your cosmic matches!
            </p>
            <button
              onClick={() => router.push('/matches')}
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Browse Matches
            </button>
          </Card>
        ) : (
          <div className="space-y-3">
            {conversations.map((conv) => (
              <Card
                key={conv.id}
                className="bg-card/80 backdrop-blur-sm border-border/50 p-4 cursor-pointer hover:bg-card/90 transition-colors"
                onClick={() => router.push(`/messages/${conv.id}`)}
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-muted">
                      {conv.partner?.profile_image_url ? (
                        <Image
                          src={conv.partner.profile_image_url || "/placeholder.svg"}
                          alt={conv.partner.first_name || 'User'}
                          width={56}
                          height={56}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl font-bold text-muted-foreground">
                          {conv.partner?.first_name?.[0] || '?'}
                        </div>
                      )}
                    </div>
                    {conv.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-accent-foreground">
                        {conv.unreadCount}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold truncate">
                        {conv.partner?.first_name || 'Unknown'}{' '}
                        {conv.partner?.last_name || ''}
                      </h3>
                      {conv.lastMessage && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(conv.lastMessage.created_at)}
                        </span>
                      )}
                    </div>
                    
                    {conv.partner?.moon_sign && (
                      <p className="text-xs text-primary mb-1">
                        Moon in {conv.partner.moon_sign}
                      </p>
                    )}
                    
                    {conv.lastMessage && (
                      <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                        {conv.lastMessage.sender_id === currentUserId ? 'You: ' : ''}
                        {conv.lastMessage.content}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
