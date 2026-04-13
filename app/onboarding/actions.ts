'use server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function createProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase.from('profiles').insert({
    id: user.id,
    org_name: formData.get('org_name') as string,
    description: (formData.get('description') as string) || null,
    location: (formData.get('location') as string) || null,
    contact_email: (formData.get('contact_email') as string) || null,
  })

  if (error) throw error
  redirect('/profile')
}
