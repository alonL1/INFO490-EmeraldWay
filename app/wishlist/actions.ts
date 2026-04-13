'use server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function createListing(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase.from('listings').insert({
    profile_id: user.id,
    title: formData.get('title') as string,
    description: (formData.get('description') as string) || null,
    item_type: (formData.get('item_type') as string) || null,
    condition: (formData.get('condition') as string) || null,
    location: (formData.get('location') as string) || null,
    priority: (formData.get('priority') as string) || 'Medium',
    image_url: (formData.get('image_url') as string) || null,
  })

  redirect('/wishlist')
}

export async function deleteListing(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const listingId = formData.get('listingId') as string

  await supabase
    .from('listings')
    .delete()
    .eq('id', listingId)
    .eq('profile_id', user.id) // ownership check required for RLS to match

  redirect('/wishlist')
}
