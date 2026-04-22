import Link from "next/link";
import { notFound } from "next/navigation";
import { DonationStatusForm } from "@/components/donations/donation-status-form";
import { PageShell } from "@/components/layout/page-shell";
import { StatusPill } from "@/components/shared/status-pill";
import { requireRole } from "@/lib/server/viewer";

type IncomingDonationDetailPageProps = {
  params: Promise<{
    donationId: string;
  }>;
};

function formatDateLabel(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default async function IncomingDonationDetailPage({
  params,
}: IncomingDonationDetailPageProps) {
  const viewer = await requireRole("organization");
  const { donationId } = await params;

  const { data: donation } = await viewer.supabase
    .from("donations")
    .select(
      "*, listings(id, title, location, description, priority, status, profiles(org_name))",
    )
    .eq("id", donationId)
    .eq("organization_id", viewer.user.id)
    .single();

  if (!donation) {
    notFound();
  }

  const listing =
    (
      donation.listings as unknown as
        | {
            id?: string | null;
            location?: string | null;
            priority?: string | null;
            profiles?: { org_name?: string | null } | null;
            status?: string | null;
            title?: string | null;
          }
        | null
    ) ?? null;

  return (
    <PageShell activeKey="profile" role={viewer.role}>
      <section className="detail-shell">
        <div className="detail-shell__header">
          <div className="detail-shell__summary">
            <p className="section-eyebrow">Incoming Donation</p>
            <h1 className="section-heading">{listing?.title ?? "Donation Request"}</h1>
            <p className="section-copy">
              <strong>{donation.donor_display_name}</strong>
              {" · "}
              {donation.confirmation_code}
            </p>
          </div>
          <div className="detail-shell__header-actions">
            <Link
              href="/incoming-donations"
              className="rounded-full border border-border-accent px-5 py-2 font-ui text-sm font-bold text-brand-teal"
            >
              Back to incoming donations
            </Link>
            {listing?.id ? (
              <Link
                href={`/wishlist/${listing.id}`}
                className="rounded-full border border-border-accent px-5 py-2 font-ui text-sm font-bold text-brand-teal"
              >
                View wishlist item
              </Link>
            ) : null}
          </div>
        </div>

        <div className="detail-shell__grid">
          <aside className="detail-panel">
            <div>
              <p className="section-eyebrow">Donation Summary</p>
              <h2 className="section-heading">Update this intake record.</h2>
              <p className="section-copy">
                Submitted on {formatDateLabel(donation.created_at)} by {donation.donor_email}.
              </p>
            </div>

            <div className="detail-chip-row">
              <StatusPill kind="status" label={donation.status} />
              <StatusPill kind="priority" label={listing?.priority ?? "Medium"} />
            </div>

            <dl className="detail-meta-grid">
              <div>
                <dt>Organization</dt>
                <dd>{listing?.profiles?.org_name ?? "Organization"}</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>{listing?.location ?? "To be confirmed"}</dd>
              </div>
              <div>
                <dt>Preferred Drop-off</dt>
                <dd>{donation.preferred_dropoff_window ?? "Not provided"}</dd>
              </div>
              <div>
                <dt>Scheduled For</dt>
                <dd>
                  {donation.scheduled_for
                    ? formatDateLabel(donation.scheduled_for)
                    : "Not scheduled yet"}
                </dd>
              </div>
            </dl>

            <div className="rounded-[22px] border border-brand-forest/10 p-4">
              <p className="font-ui text-xs font-black uppercase tracking-[0.18em] text-brand-teal">
                Donor Message
              </p>
              <p className="mt-2 font-body text-sm leading-7 text-text-primary/80">
                {donation.message ?? "No message included."}
              </p>
            </div>
          </aside>

          <aside className="detail-panel">
            <div>
              <p className="section-eyebrow">Status Update</p>
              <h2 className="section-heading">Keep this submission moving.</h2>
              <p className="section-copy">
                Update the donation workflow, schedule timing, and leave a response for the donor.
              </p>
            </div>
            <DonationStatusForm
              defaultResponse={donation.organization_response}
              defaultScheduledFor={donation.scheduled_for}
              donationId={donation.id}
              redirectTo={`/incoming-donations/${donation.id}`}
              status={donation.status}
            />
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
