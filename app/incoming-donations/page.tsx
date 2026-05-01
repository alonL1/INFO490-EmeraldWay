import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { StatusPill } from "@/components/shared/status-pill";
import { DonationDecisionButtons } from "@/components/donations/donation-decision-buttons";
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
      "id, donor_display_name, status, confirmation_code, created_at, listings(title)",
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
              Accept or decline incoming donations. Click a row to see the full item and donor details.
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
                (donation.listings as unknown as { title?: string | null } | null) ?? null;
              const title = listing?.title ?? "Donation Request";

              return (
                <article key={donation.id} className="wishlist-row relative">
                  <Link
                    aria-label={`Open donation from ${donation.donor_display_name}`}
                    className="absolute inset-0 rounded-[24px]"
                    href={`/incoming-donations/${donation.id}`}
                  />
                  <div className="wishlist-row__content md:col-span-2">
                    <h2>{title}</h2>
                    <p>
                      {donation.donor_display_name}
                      {" · "}
                      {donation.confirmation_code}
                      {" · "}
                      {formatDateLabel(donation.created_at)}
                    </p>
                  </div>

                  <div className="wishlist-row__actions relative z-10">
                    <DonationDecisionButtons
                      donationId={donation.id}
                      redirectTo="/incoming-donations"
                      status={donation.status}
                    />
                    <Link
                      href={`/incoming-donations/${donation.id}`}
                      className="text-center font-ui text-xs font-bold uppercase tracking-wide text-brand-teal/70 hover:text-brand-teal"
                    >
                      See more details →
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
