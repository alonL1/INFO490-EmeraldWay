import Link from "next/link";
import { createDonation } from "@/app/donations/actions";

type DonationSubmissionFormProps = {
  donorEmail: string;
  donorName: string;
  listingId: string;
};

export function DonationSubmissionForm({
  donorEmail,
  donorName,
  listingId,
}: DonationSubmissionFormProps) {
  return (
    <div className="mx-auto w-full max-w-3xl rounded-[28px] border border-brand-forest/10 bg-white p-8 shadow-panel">
      <div className="mb-8">
        <p className="section-eyebrow">Donation Form</p>
        <h1 className="section-heading">Submit Donation</h1>
        <p className="section-copy">
          Share who you are, the handoff timing you prefer, and any context the organization should know.
        </p>
      </div>

      <form action={createDonation} className="grid gap-5">
        <input type="hidden" name="listingId" value={listingId} />

        <div className="grid gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="donor_display_name" className="font-ui text-sm font-black uppercase tracking-wide text-brand-teal">
              Your Name
            </label>
            <input
              id="donor_display_name"
              name="donor_display_name"
              type="text"
              required
              defaultValue={donorName}
              className="w-full rounded-[14px] border border-brand-forest/15 px-4 py-3 font-body text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="donor_email" className="font-ui text-sm font-black uppercase tracking-wide text-brand-teal">
              Your Email
            </label>
            <input
              id="donor_email"
              name="donor_email"
              type="email"
              required
              defaultValue={donorEmail}
              className="w-full rounded-[14px] border border-brand-forest/15 px-4 py-3 font-body text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
            />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label htmlFor="preferred_dropoff_window" className="font-ui text-sm font-black uppercase tracking-wide text-brand-teal">
              Preferred Drop-off Window
            </label>
            <input
              id="preferred_dropoff_window"
              name="preferred_dropoff_window"
              type="text"
              placeholder="e.g. Thursday 5:30 PM - 7:00 PM"
              className="w-full rounded-[14px] border border-brand-forest/15 px-4 py-3 font-body text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
            />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label htmlFor="message" className="font-ui text-sm font-black uppercase tracking-wide text-brand-teal">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              placeholder="Share quantity, item condition, or any questions about handoff timing."
              className="w-full rounded-[14px] border border-brand-forest/15 px-4 py-3 font-body text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30 resize-none"
            />
          </div>
        </div>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-brand-forest px-6 py-3 font-ui text-sm font-bold text-brand-cream"
          >
            Submit Donation
          </button>
          <Link
            href={`/listings/${listingId}`}
            className="inline-flex items-center justify-center rounded-full border border-border-accent px-6 py-3 font-ui text-sm font-bold text-brand-teal"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
