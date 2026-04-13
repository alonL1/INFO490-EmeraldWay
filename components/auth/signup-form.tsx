'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function SignupForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signUp({ email, password })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.refresh()
    router.push('/onboarding')
  }

  return (
    <div className="max-w-md mx-auto mt-12 rounded-[28px] border border-brand-forest/10 bg-white p-8 shadow-panel">
      <h1 className="font-ui text-2xl font-black text-brand-teal">Create an account</h1>
      <p className="mt-1 font-body text-sm text-text-primary/65">
        Join CommCompass today
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="font-ui text-sm font-bold text-brand-teal">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-full border border-brand-forest/20 bg-brand-cream/30 px-4 py-2.5 font-body text-sm text-text-primary outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="font-ui text-sm font-bold text-brand-teal">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-full border border-brand-forest/20 bg-brand-cream/30 px-4 py-2.5 font-body text-sm text-text-primary outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20"
          />
        </div>

        {error && (
          <p className="font-body text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-brand-forest px-5 py-3 font-ui text-sm font-bold text-brand-cream disabled:opacity-60"
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center font-body text-sm text-text-primary/65">
        Already have an account?{' '}
        <Link href="/login" className="font-bold text-brand-teal underline-offset-2 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
