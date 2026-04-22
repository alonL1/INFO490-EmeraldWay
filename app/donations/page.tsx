import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { StatusPill } from "@/components/shared/status-pill";
import { requireRole } from "@/lib/server/viewer";

function formatDateLabel(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default async function DonationsPage() {
  const viewer = await requireRole("donor");

  const { data: donations } = await viewer.supabase
    .from("donations")
    .select(
      "id, confirmation_code, status, preferred_dropoff_window, created_at, listings(id, title, location, profiles(org_name))",
    )
    .eq("donor_id", viewer.user.id)
    .order("created_at", { ascending: false });

  return (
    <PageShell activeKey="donations" role={viewer.role}>
      <section className="wishlist-shell">
        <div className="wishlist-shell__header">
          <div>
            <p className="section-eyebrow">Donor Workspace</p>
            <h1 className="section-heading">Donations</h1>
            <p className="section-copy">
              Track every donation submission, its confirmation code, and the latest organization response.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-full bg-brand-forest px-5 py-3 font-ui text-sm font-bold text-brand-cream"
          >
            Browse More Listings
          </Link>
        </div>

        {donations && donations.length > 0 ? (
          <div className="wishlist-list">
            {donations.map((donation) => {
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
                <article key={donation.id} className="wishlist-row">
                  <div className="wishlist-row__content md:col-span-2">
                    <h2>{listing?.title ?? "Donation"}</h2>
                    <p>
                      {listing?.profiles?.org_name ?? "Organization"}
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
                      {donation.preferred_dropoff_window ?? "Pending confirmation"}
                    </p>
                  </div>

                  <div className="wishlist-row__actions">
                    <Link
                      href={`/donations/${donation.id}`}
                      className="rounded-full bg-brand-forest px-5 py-3 text-center font-ui text-sm font-bold text-brand-cream"
                    >
                      View Donation
                    </Link>
                    {listing?.id ? (
                      <Link
                        href={`/listings/${listing.id}`}
                        className="rounded-full border border-border-accent px-5 py-3 text-center font-ui text-sm font-bold text-brand-teal"
                      >
                        View Listing
                      </Link>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <p>You have not submitted any donations yet.</p>
          </div>
        )}
      </section>
    </PageShell>
  );
}
