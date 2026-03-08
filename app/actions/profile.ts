'use server'

import { createClient } from '@/lib/supabase/server'
import type { UserProfile } from '@/lib/types'

export async function updateProfile(profileData: Partial<UserProfile>) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function getProfile() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return null
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    return null
  }

  return profile
}

export async function uploadProfileImage(file: File) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: 'Unauthorized' }
  }

  // Create a unique file name
  const fileExt = file.name.split('.').pop()
  const fileName = `${user.id}-${Date.now()}.${fileExt}`
  const filePath = `${user.id}/${fileName}`

  // Upload image to storage
  const { error: uploadError } = await supabase.storage
    .from('profile-pictures')
    .upload(filePath, file, { upsert: true })

  if (uploadError) {
    return { error: uploadError.message }
  }

  // Get public URL
  const { data } = supabase.storage
    .from('profile-pictures')
    .getPublicUrl(filePath)

  // Update profile with image URL
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ profile_image_url: data.publicUrl })
    .eq('id', user.id)

  if (updateError) {
    return { error: updateError.message }
  }

  return { success: true, imageUrl: data.publicUrl }
}
