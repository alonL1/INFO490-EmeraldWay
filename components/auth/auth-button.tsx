'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

type AuthButtonProps = {
  appearance?: 'dark' | 'light'
}

const APPEARANCE_CLASSES = {
  dark: {
    base: 'border-white/20 text-brand-cream hover:bg-white/10',
    spinner: 'text-brand-cream',
    loading: 'border-white/20 text-brand-cream/90',
  },
  light: {
    base: 'border-brand-teal/40 bg-white text-brand-teal hover:bg-brand-teal hover:text-white',
    spinner: 'text-brand-teal',
    loading: 'border-brand-teal/30 text-brand-teal/80',
  },
} as const

export function AuthButton({ appearance = 'dark' }: AuthButtonProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isCheckingUser, setIsCheckingUser] = useState(true)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const router = useRouter()
  const styles = APPEARANCE_CLASSES[appearance]

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
      <span
        className={`inline-flex items-center justify-center gap-2 rounded-full border px-3 py-2 font-ui text-sm font-bold ${styles.loading}`}
      >
        <LoadingSpinner className={styles.spinner} label="Checking session" />
        <span>Loading</span>
      </span>
    )
  }

  if (user) {
    return (
      <button
        onClick={handleSignOut}
        disabled={isSigningOut}
        className={`inline-flex items-center justify-center gap-2 rounded-full border px-3 py-2 font-ui text-sm font-bold transition disabled:cursor-wait disabled:opacity-70 ${styles.base}`}
      >
        {isSigningOut ? (
          <>
            <LoadingSpinner className={styles.spinner} label="Signing out" />
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
      className={`inline-flex items-center justify-center rounded-full border px-3 py-2 font-ui text-sm font-bold transition ${styles.base}`}
    >
      Sign In
    </Link>
  )
}
