'use server'

import { createClient } from '@/lib/supabase/server'
import { UIMessage } from 'ai'

export async function createHappeningsConversation(philosopherId: string, philosopherName: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { data: conversation, error } = await supabase
    .from('happenings_conversations')
    .insert([
      {
        user_id: user.id,
        philosopher_id: philosopherId,
        philosopher_name: philosopherName,
        title: `Chat with ${philosopherName}`,
      },
    ])
    .select()
    .single()

  if (error) throw error
  return conversation
}

export async function saveHappeningsMessage(
  conversationId: string,
  role: 'user' | 'assistant',
  content: string,
  philosopherId?: string
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { data: message, error } = await supabase
    .from('happenings_messages')
    .insert([
      {
        conversation_id: conversationId,
        user_id: user.id,
        role,
        content,
      },
    ])
    .select()
    .single()

  if (error) throw error
  return message
}

export async function getHappeningsConversations() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { data: conversations, error } = await supabase
    .from('happenings_conversations')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  if (error) throw error
  return conversations
}

export async function getHappeningsMessages(conversationId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  // Verify user owns this conversation
  const { data: conversation, error: convError } = await supabase
    .from('happenings_conversations')
    .select('id')
    .eq('id', conversationId)
    .eq('user_id', user.id)
    .single()

  if (convError || !conversation) throw new Error('Conversation not found or unauthorized')

  const { data: messages, error } = await supabase
    .from('happenings_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) throw error

  // Convert to format expected by useChat
  const uiMessages: UIMessage[] = messages.map((msg) => ({
    id: msg.id,
    role: msg.role as 'user' | 'assistant',
    content: msg.content,
  }))

  return uiMessages
}

export async function deleteHappeningsConversation(conversationId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('happenings_conversations')
    .delete()
    .eq('id', conversationId)
    .eq('user_id', user.id)

  if (error) throw error
  return { success: true }
}
