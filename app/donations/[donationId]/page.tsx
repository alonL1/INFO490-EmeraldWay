import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { StatusPill } from "@/components/shared/status-pill";
import { requireRole } from "@/lib/server/viewer";

type DonationDetailPageProps = {
  params: Promise<{
    donationId: string;
  }>;
  searchParams: Promise<{
    submitted?: string;
  }>;
};

function formatDateLabel(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default async function DonationDetailPage({
  params,
  searchParams,
}: DonationDetailPageProps) {
  const viewer = await requireRole("donor");
  const { donationId } = await params;
  const { submitted } = await searchParams;

  const { data: donation } = await viewer.supabase
    .from("donations")
    .select(
      "*, listings(id, title, location, profiles(org_name))",
    )
    .eq("id", donationId)
    .eq("donor_id", viewer.user.id)
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
            profiles?: { org_name?: string | null } | null;
            title?: string | null;
          }
        | null
    ) ?? null;

  return (
    <PageShell activeKey="donations" role={viewer.role}>
      <section className="detail-shell">
        {submitted === "1" ? (
          <div className="dashboard-hero">
            <div className="dashboard-hero__copy">
              <p className="section-eyebrow">Thank You</p>
              <h1 className="section-heading">Donation submitted</h1>
              <p className="section-copy">
                Your confirmation code is <strong>{donation.confirmation_code}</strong>. The organization can now review your submission and respond with scheduling details.
              </p>
            </div>
          </div>
        ) : null}

        <div className="detail-shell__header">
          <div className="detail-shell__summary">
            <p className="section-eyebrow">Donation Detail</p>
            <h1 className="section-heading">{listing?.title ?? "Donation"}</h1>
            <p className="section-copy">
              <strong>{listing?.profiles?.org_name ?? "Organization"}</strong>
              {" · "}
              {donation.confirmation_code}
            </p>
          </div>
          <div className="detail-shell__header-actions">
            <Link
              href="/donations"
              className="rounded-full border border-border-accent px-5 py-2 font-ui text-sm font-bold text-brand-teal"
            >
              Back to donations
            </Link>
            {listing?.id ? (
              <Link
                href={`/listings/${listing.id}`}
                className="rounded-full border border-border-accent px-5 py-2 font-ui text-sm font-bold text-brand-teal"
              >
                View listing
              </Link>
            ) : null}
          </div>
        </div>

        <div className="detail-shell__grid">
          <aside className="detail-panel md:col-span-2">
            <div>
              <p className="section-eyebrow">Current Status</p>
              <h2 className="section-heading">Track the organization response.</h2>
              <p className="section-copy">
                Submitted on {formatDateLabel(donation.created_at)}. Watch for updates as the organization reviews, schedules, or completes the handoff.
              </p>
            </div>

            <div className="detail-chip-row">
              <StatusPill kind="status" label={donation.status} />
            </div>

            <dl className="detail-meta-grid">
              <div>
                <dt>Preferred Drop-off</dt>
                <dd>{donation.preferred_dropoff_window ?? "Pending confirmation"}</dd>
              </div>
              <div>
                <dt>Listing Location</dt>
                <dd>{listing?.location ?? "To be confirmed"}</dd>
              </div>
              <div>
                <dt>Organization Response</dt>
                <dd>{donation.organization_response ?? "No response yet."}</dd>
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
                Your Message
              </p>
              <p className="mt-2 font-body text-sm leading-7 text-text-primary/80">
                {donation.message ?? "No message was included with this donation."}
              </p>
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
