import Link from "next/link";
import { notFound } from "next/navigation";
import { DonationDecisionButtons } from "@/components/donations/donation-decision-buttons";
import { PageShell } from "@/components/layout/page-shell";
import { ListingDetailView } from "@/components/listings/listing-detail-view";
import { StatusPill } from "@/components/shared/status-pill";
import { requireRole } from "@/lib/server/viewer";
import type { ItemRecord } from "@/lib/types/item";

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
      "*, listings(id, title, description, item_type, condition, location, priority, status, image_url, profiles(org_name))",
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
            condition?: string | null;
            description?: string | null;
            id?: string | null;
            image_url?: string | null;
            item_type?: string | null;
            location?: string | null;
            priority?: string | null;
            profiles?: { org_name?: string | null } | null;
            status?: string | null;
            title?: string | null;
          }
        | null
    ) ?? null;

  const orgName = listing?.profiles?.org_name ?? "Organization";
  const title = listing?.title ?? "Donation Request";

  const item: ItemRecord = {
    id: listing?.id ?? donation.listing_id,
    profileId: donation.organization_id,
    title,
    organization: orgName,
    imageSrc: listing?.image_url ?? null,
    imageAlt: `${title} donation request`,
    condition: listing?.condition ?? "Not specified",
    description: listing?.description ?? "",
    itemType: listing?.item_type ?? "General",
    location: listing?.location ?? "Seattle, WA",
    priority: listing?.priority ?? "Medium",
    status: listing?.status ?? "Open",
  };

  return (
    <PageShell activeKey="profile" role={viewer.role}>
      <section className="detail-shell">
        <div className="detail-shell__header">
          <div className="detail-shell__summary">
            <p className="section-eyebrow">Incoming Donation</p>
            <h1 className="section-heading">{title}</h1>
            <p className="section-copy">
              <strong>{orgName}</strong>
              {" · "}
              {item.location}
            </p>
          </div>
          <div className="detail-shell__header-actions">
            <Link
              href="/incoming-donations"
              className="rounded-full border border-border-accent px-5 py-2 font-ui text-sm font-bold text-brand-teal"
            >
              Back to incoming donations
            </Link>
          </div>
        </div>

        <ListingDetailView
          item={item}
          rightPanel={
            <>
              <div>
                <p className="section-eyebrow">Donor Submission</p>
                <h2 className="section-heading">{donation.donor_display_name}</h2>
                <p className="section-copy">
                  Submitted {formatDateLabel(donation.created_at)} · {donation.confirmation_code}
                </p>
              </div>

              <div className="detail-panel__actions">
                <DonationDecisionButtons
                  donationId={donation.id}
                  redirectTo="/incoming-donations"
                  status={donation.status}
                />
              </div>

              <dl className="detail-meta-grid">
                <div>
                  <dt>Donor Email</dt>
                  <dd>{donation.donor_email}</dd>
                </div>
                <div>
                  <dt>Preferred Drop-off</dt>
                  <dd>{donation.preferred_dropoff_window ?? "Not provided"}</dd>
                </div>
                <div>
                  <dt>Item Type</dt>
                  <dd>{item.itemType}</dd>
                </div>
                <div>
                  <dt>Condition</dt>
                  <dd>{item.condition}</dd>
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

              <div className="detail-chip-row">
                <StatusPill kind="priority" label={item.priority} />
                <StatusPill kind="status" label={donation.status} />
              </div>
            </>
          }
        />
      </section>
    </PageShell>
  );
}
