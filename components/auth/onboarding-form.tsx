"use client";

import {
  saveDonorProfile,
  saveOrganizationProfile,
} from "@/app/onboarding/actions";

export function OrganizationOnboardingForm() {
  return (
    <div className="mx-auto mt-8 w-full max-w-2xl rounded-[28px] border border-brand-forest/10 bg-white p-8 shadow-panel">
      <h1 className="font-ui text-2xl font-black text-brand-teal">
        Set Up Your Organization
      </h1>
      <p className="mt-2 font-body text-sm text-text-primary/65">
        Add the public details donors need before they respond to your requests.
      </p>

      <form action={saveOrganizationProfile} className="mt-8 grid gap-5">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-1.5 md:col-span-2">
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

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label htmlFor="description" className="font-ui text-sm font-black uppercase tracking-wide text-brand-teal">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
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
        </div>

        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-brand-forest px-5 py-3 font-ui text-sm font-bold text-brand-cream"
        >
          Save Organization Profile
        </button>
      </form>
    </div>
  );
}

export function DonorOnboardingForm() {
  return (
    <div className="mx-auto mt-8 w-full max-w-2xl rounded-[28px] border border-brand-forest/10 bg-white p-8 shadow-panel">
      <h1 className="font-ui text-2xl font-black text-brand-teal">
        Set Up Your Donor Profile
      </h1>
      <p className="mt-2 font-body text-sm text-text-primary/65">
        Add the basic details that appear on your donation submissions and saved item views.
      </p>

      <form action={saveDonorProfile} className="mt-8 grid gap-5">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label htmlFor="full_name" className="font-ui text-sm font-black uppercase tracking-wide text-brand-teal">
              Full Name
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              required
              className="w-full rounded-[14px] border border-brand-forest/15 px-4 py-3 font-body text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
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

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label htmlFor="focus_area" className="font-ui text-sm font-black uppercase tracking-wide text-brand-teal">
              Focus Area
            </label>
            <input
              id="focus_area"
              name="focus_area"
              type="text"
              placeholder="e.g. Winter gear, pantry support, family supplies"
              className="w-full rounded-[14px] border border-brand-forest/15 px-4 py-3 font-body text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
            />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label htmlFor="bio" className="font-ui text-sm font-black uppercase tracking-wide text-brand-teal">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={5}
              className="w-full rounded-[14px] border border-brand-forest/15 px-4 py-3 font-body text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30 resize-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-brand-forest px-5 py-3 font-ui text-sm font-bold text-brand-cream"
        >
          Save Donor Profile
        </button>
      </form>
    </div>
  );
}
