'use client'
import { createProfile } from '@/app/onboarding/actions'

export function OnboardingForm() {
  return (
    <div className="max-w-lg mx-auto mt-8 rounded-[28px] border border-brand-forest/10 bg-white p-8 shadow-panel">
      <h1 className="font-ui text-2xl font-black text-brand-teal">
        Set Up Your Organization
      </h1>
      <p className="font-body text-sm text-text-primary/65 mt-2 mb-6">
        Tell donors about your organization.
      </p>

      <form action={createProfile} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="org_name" className="font-ui text-sm font-black uppercase tracking-wide text-brand-teal">
            Organization Name
          </label>
          <input
            id="org_name"
            name="org_name"
            type="text"
            required
            className="w-full rounded-[14px] border border-brand-forest/15 px-4 py-3 font-body text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className="font-ui text-sm font-black uppercase tracking-wide text-brand-teal">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="w-full rounded-[14px] border border-brand-forest/15 px-4 py-3 font-body text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30 resize-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="location" className="font-ui text-sm font-black uppercase tracking-wide text-brand-teal">
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            placeholder="e.g. Seattle, WA"
            className="w-full rounded-[14px] border border-brand-forest/15 px-4 py-3 font-body text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact_email" className="font-ui text-sm font-black uppercase tracking-wide text-brand-teal">
            Contact Email
          </label>
          <input
            id="contact_email"
            name="contact_email"
            type="email"
            className="w-full rounded-[14px] border border-brand-forest/15 px-4 py-3 font-body text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
          />
        </div>

        <button
          type="submit"
          className="self-start rounded-full bg-brand-forest px-5 py-3 font-ui text-sm font-bold text-brand-cream"
        >
          Create Profile
        </button>
      </form>
    </div>
  )
}
