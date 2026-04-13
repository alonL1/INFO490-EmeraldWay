'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
    router.push('/')
  }

  if (user) {
    return (
      <button
        onClick={handleSignOut}
        className="rounded-full border border-white/20 px-3 py-2 font-ui text-sm font-bold text-brand-cream transition hover:bg-white/10"
      >
        Sign Out
      </button>
    )
  }

  return (
    <Link
      href="/login"
      className="rounded-full border border-white/20 px-3 py-2 font-ui text-sm font-bold text-brand-cream transition hover:bg-white/10"
    >
      Sign In
    </Link>
  )
}
