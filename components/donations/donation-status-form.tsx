import { updateDonationStatus } from "@/app/donations/actions";

type DonationStatusFormProps = {
  compact?: boolean;
  defaultResponse?: string | null;
  defaultScheduledFor?: string | null;
  donationId: string;
  redirectTo: string;
  status: string;
};

function toDateTimeLocal(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString().slice(0, 16);
}

export function DonationStatusForm({
  compact = false,
  defaultResponse,
  defaultScheduledFor,
  donationId,
  redirectTo,
  status,
}: DonationStatusFormProps) {
  return (
    <form action={updateDonationStatus} className="grid gap-3">
      <input type="hidden" name="donationId" value={donationId} />
      <input type="hidden" name="redirectTo" value={redirectTo} />

      <div className={`grid gap-3 ${compact ? "md:grid-cols-[1fr_auto]" : "md:grid-cols-2"}`}>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`status-${donationId}`} className="font-ui text-xs font-black uppercase tracking-wide text-brand-teal">
            Status
          </label>
          <select
            id={`status-${donationId}`}
            name="status"
            defaultValue={status}
            className="rounded-[14px] border border-brand-forest/15 px-4 py-3 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
          >
            <option value="submitted">Submitted</option>
            <option value="reviewing">Reviewing</option>
            <option value="scheduled">Scheduled</option>
            <option value="received">Received</option>
            <option value="declined">Declined</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`scheduled_for-${donationId}`} className="font-ui text-xs font-black uppercase tracking-wide text-brand-teal">
            Scheduled For
          </label>
          <input
            id={`scheduled_for-${donationId}`}
            name="scheduled_for"
            type="datetime-local"
            defaultValue={toDateTimeLocal(defaultScheduledFor)}
            className="rounded-[14px] border border-brand-forest/15 px-4 py-3 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
          />
        </div>
      </div>

      {!compact ? (
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`organization_response-${donationId}`} className="font-ui text-xs font-black uppercase tracking-wide text-brand-teal">
            Organization Response
          </label>
          <textarea
            id={`organization_response-${donationId}`}
            name="organization_response"
            rows={4}
            defaultValue={defaultResponse ?? ""}
            className="rounded-[14px] border border-brand-forest/15 px-4 py-3 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30 resize-none"
          />
        </div>
      ) : null}

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-full bg-brand-forest px-5 py-3 font-ui text-sm font-bold text-brand-cream"
      >
        Update Donation
      </button>
    </form>
  );
}
