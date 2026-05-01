import { acceptDonation, declineDonation } from "@/app/donations/actions";
import { StatusPill } from "@/components/shared/status-pill";

type DonationDecisionButtonsProps = {
  donationId: string;
  redirectTo: string;
  status: string;
};

export function DonationDecisionButtons({
  donationId,
  redirectTo,
  status,
}: DonationDecisionButtonsProps) {
  if (status !== "submitted") {
    return <StatusPill kind="status" label={status} />;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <form action={acceptDonation}>
        <input type="hidden" name="donationId" value={donationId} />
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-brand-forest px-5 py-2 font-ui text-sm font-bold text-brand-cream"
        >
          Accept
        </button>
      </form>
      <form action={declineDonation}>
        <input type="hidden" name="donationId" value={donationId} />
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full border border-border-accent px-5 py-2 font-ui text-sm font-bold text-brand-teal"
        >
          Decline
        </button>
      </form>
    </div>
  );
}
