import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { StatusPill } from "@/components/shared/status-pill";
import { deleteListing } from "@/app/wishlist/actions";
import { requireRole } from "@/lib/server/viewer";

export default async function WishlistPage() {
  const viewer = await requireRole("organization");

  const { data: listings } = await viewer.supabase
    .from("listings")
    .select("*")
    .eq("profile_id", viewer.user.id)
    .order("created_at", { ascending: false });

  return (
    <PageShell activeKey="wishlist" role={viewer.role}>
      <section className="wishlist-shell">
        <div className="wishlist-shell__header">
          <div>
            <p className="section-eyebrow">Organization Wishlist</p>
            <h1 className="section-heading">Wishlist</h1>
            <p className="section-copy">
              Review live requests, open each item detail, or jump into editing without leaving the queue.
            </p>
          </div>
          <Link
            href="/wishlist/new"
            className="rounded-full bg-brand-forest px-5 py-3 font-ui text-sm font-bold text-brand-cream"
          >
            Add Item
          </Link>
        </div>

        {listings && listings.length > 0 ? (
          <div className="wishlist-list">
            {listings.map((item) => (
              <article key={item.id} className="wishlist-row">
                <Link href={`/wishlist/${item.id}`} className="wishlist-row__media">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={`${item.title} request`}
                      fill
                      className="object-cover"
                      sizes="(min-width: 900px) 160px, 100vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-brand-cream/45" />
                  )}
                </Link>

                <Link href={`/wishlist/${item.id}`} className="wishlist-row__content">
                  <h2>{item.title}</h2>
                  <p>{item.location ?? "Location to be confirmed"}</p>
                  <div className="detail-chip-row">
                    <StatusPill kind="priority" label={item.priority ?? "Medium"} />
                    <StatusPill kind="status" label={item.status ?? "Open"} />
                  </div>
                </Link>

                <div className="wishlist-row__actions">
                  <Link
                    href={`/wishlist/${item.id}/edit`}
                    className="rounded-full bg-brand-forest px-5 py-3 text-center font-ui text-sm font-bold text-brand-cream"
                  >
                    Edit
                  </Link>
                  <form action={deleteListing}>
                    <input type="hidden" name="listingId" value={item.id} />
                    <button
                      type="submit"
                      className="w-full rounded-full border border-border-accent px-5 py-3 font-ui text-sm font-bold text-brand-teal"
                    >
                      Remove
                    </button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No items yet. Add your first wishlist item.</p>
            <Link
              href="/wishlist/new"
              className="rounded-full bg-brand-forest px-5 py-3 font-ui text-sm font-bold text-brand-cream"
            >
              Add Item
            </Link>
          </div>
        )}
      </section>
    </PageShell>
  );
}
