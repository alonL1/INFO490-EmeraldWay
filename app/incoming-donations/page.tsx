import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { StatusPill } from "@/components/shared/status-pill";
import { DonationStatusForm } from "@/components/donations/donation-status-form";
import { requireRole } from "@/lib/server/viewer";

function formatDateLabel(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export default async function IncomingDonationsPage() {
  const viewer = await requireRole("organization");

  const { data: donations } = await viewer.supabase
    .from("donations")
    .select(
      "id, donor_display_name, status, confirmation_code, preferred_dropoff_window, scheduled_for, organization_response, created_at, listings(title, location)",
    )
    .eq("organization_id", viewer.user.id)
    .order("created_at", { ascending: false });

  return (
    <PageShell activeKey="profile" role={viewer.role}>
      <section className="wishlist-shell">
        <div className="wishlist-shell__header">
          <div>
            <p className="section-eyebrow">Organization Workspace</p>
            <h1 className="section-heading">Incoming Donations</h1>
            <p className="section-copy">
              Review donor submissions, update statuses inline, or open a full donation detail page for more context.
            </p>
          </div>
          <Link
            href="/profile"
            className="rounded-full bg-brand-forest px-5 py-3 font-ui text-sm font-bold text-brand-cream"
          >
            Back to Profile
          </Link>
        </div>

        {donations && donations.length > 0 ? (
          <div className="wishlist-list">
            {donations.map((donation) => {
              const listing =
                (
                  donation.listings as unknown as
                    | {
                        location?: string | null;
                        title?: string | null;
                      }
                    | null
                ) ?? null;

              return (
                <article key={donation.id} className="wishlist-row">
                  <Link href={`/incoming-donations/${donation.id}`} className="wishlist-row__content md:col-span-2">
                    <h2>{listing?.title ?? "Donation Request"}</h2>
                    <p>
                      {donation.donor_display_name}
                      {" · "}
                      {donation.confirmation_code}
                      {" · "}
                      {formatDateLabel(donation.created_at)}
                    </p>
                    <div className="detail-chip-row">
                      <StatusPill kind="status" label={donation.status} />
                    </div>
                    <p className="mt-3 font-body text-sm text-text-primary/70">
                      Preferred drop-off:
                      {" "}
                      {donation.preferred_dropoff_window ?? "Not provided"}
                    </p>
                  </Link>

                  <div className="wishlist-row__actions">
                    <DonationStatusForm
                      compact
                      defaultResponse={donation.organization_response}
                      defaultScheduledFor={donation.scheduled_for}
                      donationId={donation.id}
                      redirectTo="/incoming-donations"
                      status={donation.status}
                    />
                    <Link
                      href={`/incoming-donations/${donation.id}`}
                      className="rounded-full border border-border-accent px-5 py-3 text-center font-ui text-sm font-bold text-brand-teal"
                    >
                      Open Detail
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <p>No incoming donations yet.</p>
          </div>
        )}
      </section>
    </PageShell>
  );
}
