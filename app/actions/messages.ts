'use server'

import { createClient } from '@/lib/supabase/server'

export async function getConversations() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated', conversations: [] }
  }

  const { data: conversations, error } = await supabase
    .from('conversations')
    .select(`
      id,
      user1_id,
      user2_id,
      last_message_at,
      created_at
    `)
    .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
    .order('last_message_at', { ascending: false })

  if (error) {
    return { error: error.message, conversations: [] }
  }

  // Get profile info for conversation partners
  const conversationsWithProfiles = await Promise.all(
    (conversations || []).map(async (conv) => {
      const partnerId = conv.user1_id === user.id ? conv.user2_id : conv.user1_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, profile_image_url, moon_sign')
        .eq('id', partnerId)
        .single()

      // Get last message (may be null if conversation is empty)
      const { data: lastMessage } = await supabase
        .from('messages')
        .select('content, created_at, sender_id')
        .eq('conversation_id', conv.id)
        .order('created_at', { ascending: false })
        .limit(1)

      // Get unread count (messages where read_at is null)
      const { count: unreadCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('conversation_id', conv.id)
        .is('read_at', null)
        .neq('sender_id', user.id)

      return {
        ...conv,
        partner: profile,
        lastMessage: lastMessage && lastMessage.length > 0 ? lastMessage[0] : null,
        unreadCount: unreadCount || 0
      }
    })
  )

  return { conversations: conversationsWithProfiles, currentUserId: user.id }
}

export async function getOrCreateConversation(partnerId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Check if conversation already exists
  const { data: existing, error: fetchError } = await supabase
    .from('conversations')
    .select('id')
    .or(`and(user1_id.eq.${user.id},user2_id.eq.${partnerId}),and(user1_id.eq.${partnerId},user2_id.eq.${user.id})`)

  if (fetchError) {
    console.error('[v0] Error fetching conversations:', fetchError)
  }

  // If conversation exists, return it
  if (existing && existing.length > 0) {
    return { conversationId: existing[0].id }
  }

  // Create new conversation
  const { data: newConv, error } = await supabase
    .from('conversations')
    .insert({
      user1_id: user.id,
      user2_id: partnerId
    })
    .select('id')
    .single()

  if (error) {
    return { error: error.message }
  }

  return { conversationId: newConv.id }
}

export async function getMessages(conversationId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated', messages: [] }
  }

  const { data: messages, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) {
    return { error: error.message, messages: [] }
  }

  // Mark messages as read (set read_at to current timestamp)
  await supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('conversation_id', conversationId)
    .is('read_at', null)
    .neq('sender_id', user.id)

  return { messages: messages || [], currentUserId: user.id }
}

export async function sendMessage(conversationId: string, content: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data: message, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content: content.trim()
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  // Update conversation last_message_at
  await supabase
    .from('conversations')
    .update({ last_message_at: new Date().toISOString() })
    .eq('id', conversationId)

  return { message }
}

export async function getConversationPartner(conversationId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data: conversation } = await supabase
    .from('conversations')
    .select('user1_id, user2_id')
    .eq('id', conversationId)
    .single()

  if (!conversation) {
    return { error: 'Conversation not found' }
  }

  const partnerId = conversation.user1_id === user.id 
    ? conversation.user2_id 
    : conversation.user1_id

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, profile_image_url, moon_sign, sun_sign')
    .eq('id', partnerId)
    .single()

  return { partner: profile, currentUserId: user.id }
}
