'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const [isCheckingUser, setIsCheckingUser] = useState(true)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setIsCheckingUser(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setIsCheckingUser(false)

      if (!session) {
        setIsSigningOut(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function handleSignOut() {
    setIsSigningOut(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      setIsSigningOut(false)
      return
    }

    setUser(null)
    router.replace('/')
    router.refresh()
  }

  if (isCheckingUser) {
    return (
      <span className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-3 py-2 font-ui text-sm font-bold text-brand-cream/90">
        <LoadingSpinner className="text-brand-cream" label="Checking session" />
        <span>Loading</span>
      </span>
    )
  }

  if (user) {
    return (
      <button
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-3 py-2 font-ui text-sm font-bold text-brand-cream transition hover:bg-white/10 disabled:cursor-wait disabled:opacity-70"
      >
        {isSigningOut ? (
          <>
            <LoadingSpinner className="text-brand-cream" label="Signing out" />
            <span>Signing Out...</span>
          </>
        ) : (
          'Sign Out'
        )}
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
