'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(email: string, password: string) {
  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // Check for server unavailable errors
      if (error.message.includes('521') || error.message.includes('Web server is down')) {
        return { error: 'Authentication service is temporarily unavailable. Please try again in a few minutes.' }
      }
      return { error: error.message }
    }

    return { success: true }
  } catch (err: any) {
    // Handle network/server errors
    if (err?.message?.includes('521') || err?.message?.includes('fetch')) {
      return { error: 'Authentication service is temporarily unavailable. Please try again in a few minutes.' }
    }
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}

export async function signup(email: string, password: string, firstName: string) {
  try {
    const supabase = await createClient()

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://theaineed.com'

    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${appUrl}/auth/callback`,
        data: {
          first_name: firstName,
        },
      },
    })

    if (error) {
      if (error.message.includes('521') || error.message.includes('Web server is down')) {
        return { error: 'Authentication service is temporarily unavailable. Please try again in a few minutes.' }
      }
      return { error: error.message }
    }

    if (data.user?.identities?.length === 0) {
      return { error: 'User already exists' }
    }

    return { success: true, message: 'Check your email to confirm your account' }
  } catch (err: any) {
    if (err?.message?.includes('521') || err?.message?.includes('fetch')) {
      return { error: 'Authentication service is temporarily unavailable. Please try again in a few minutes.' }
    }
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

export async function resetPassword(email: string) {
  const supabase = await createClient()

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://theaineed.com'

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${appUrl}/auth/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true, message: 'Check your email for password reset instructions' }
}

export async function updatePassword(password: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    password: password,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function signInWithGoogle() {
  const supabase = await createClient()

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://theaineed.com'

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${appUrl}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  return data
}

export async function getUser() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('[v0] Error getting user:', error.message)
      return null
    }

    return user || null
  } catch (error) {
    console.error('[v0] Error in getUser:', error)
    return null
  }
}
