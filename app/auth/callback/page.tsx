import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AuthCallbackPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getSession()
  
  if (error || !data.session) {
    redirect('/auth/error?error=callback_failed')
  }

  // Redirect to onboarding after email confirmation
  redirect('/onboarding')
}
