import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { StatusPill } from "@/components/shared/status-pill";
import { toggleSavedListing } from "@/app/donations/actions";
import { requireRole } from "@/lib/server/viewer";

export default async function SavedItemsPage() {
  const viewer = await requireRole("donor");

  const { data: savedItems } = await viewer.supabase
    .from("saved_listings")
    .select(
      "id, listing_id, listings(id, title, location, priority, status, image_url, profiles(org_name))",
    )
    .eq("donor_id", viewer.user.id)
    .order("created_at", { ascending: false });

  return (
    <PageShell activeKey="profile" role={viewer.role}>
      <section className="wishlist-shell">
        <div className="wishlist-shell__header">
          <div>
            <p className="section-eyebrow">Donor Workspace</p>
            <h1 className="section-heading">Saved Items</h1>
            <p className="section-copy">
              Revisit listings you want to donate to later or remove items once you no longer need them saved.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-full bg-brand-forest px-5 py-3 font-ui text-sm font-bold text-brand-cream"
          >
            Browse Listings
          </Link>
        </div>

        {savedItems && savedItems.length > 0 ? (
          <div className="wishlist-list">
            {savedItems.map((saved) => {
              const listing =
                (
                  saved.listings as unknown as
                    | {
                        id?: string | null;
                        image_url?: string | null;
                        location?: string | null;
                        priority?: string | null;
                        profiles?: { org_name?: string | null } | null;
                        status?: string | null;
                        title?: string | null;
                      }
                    | null
                ) ?? null;

              const listingId = listing?.id ?? saved.listing_id;

              return (
                <article key={saved.id} className="wishlist-row">
                  <Link href={`/listings/${listingId}`} className="wishlist-row__media">
                    {listing?.image_url ? (
                      <Image
                        src={listing.image_url}
                        alt={`${listing.title} request`}
                        fill
                        className="object-cover"
                        sizes="(min-width: 900px) 160px, 100vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-brand-cream/45" />
                    )}
                  </Link>

                  <Link href={`/listings/${listingId}`} className="wishlist-row__content">
                    <h2>{listing?.title ?? "Saved Request"}</h2>
                    <p>
                      {listing?.profiles?.org_name ?? "Organization"}
                      {" · "}
                      {listing?.location ?? "Location to be confirmed"}
                    </p>
                    <div className="detail-chip-row">
                      <StatusPill kind="priority" label={listing?.priority ?? "Medium"} />
                      <StatusPill kind="status" label={listing?.status ?? "Open"} />
                    </div>
                  </Link>

                  <div className="wishlist-row__actions">
                    <Link
                      href={`/listings/${listingId}`}
                      className="rounded-full bg-brand-forest px-5 py-3 text-center font-ui text-sm font-bold text-brand-cream"
                    >
                      View Listing
                    </Link>
                    <form action={toggleSavedListing}>
                      <input type="hidden" name="listingId" value={listingId} />
                      <button
                        type="submit"
                        className="w-full rounded-full border border-border-accent px-5 py-3 font-ui text-sm font-bold text-brand-teal"
                      >
                        Remove Saved
                      </button>
                    </form>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <p>No saved items yet. Save a listing from its detail page.</p>
          </div>
        )}
      </section>
    </PageShell>
  );
}
