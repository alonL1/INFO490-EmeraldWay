import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { StatusPill } from "@/components/shared/status-pill";
import { deleteListing } from "@/app/wishlist/actions";
import { requireRole } from "@/lib/server/viewer";

type WishlistDetailPageProps = {
  params: Promise<{
    listingId: string;
  }>;
};

export default async function WishlistDetailPage({ params }: WishlistDetailPageProps) {
  const viewer = await requireRole("organization");
  const { listingId } = await params;

  const { data: listing } = await viewer.supabase
    .from("listings")
    .select("*")
    .eq("id", listingId)
    .eq("profile_id", viewer.user.id)
    .maybeSingle();

  if (!listing) {
    notFound();
  }

  return (
    <PageShell activeKey="wishlist" role={viewer.role}>
      <div className="mx-auto w-full max-w-3xl rounded-[28px] border border-brand-forest/10 bg-white p-8 shadow-panel">
        <div className="mb-8">
          <p className="section-eyebrow">Wishlist Item</p>
          <h1 className="section-heading">{listing.title}</h1>
          <p className="section-copy">
            Review the item details in the same structured layout used for creation and editing.
          </p>
        </div>

        <div className="grid gap-6">
          <div className="relative overflow-hidden rounded-[24px] bg-brand-cream/45">
            {listing.image_url ? (
              <div className="relative aspect-[16/9]">
                <Image
                  src={listing.image_url}
                  alt={`${listing.title} request`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 900px) 60vw, 100vw"
                />
              </div>
            ) : (
              <div className="aspect-[16/9]" />
            )}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-[20px] border border-brand-forest/10 p-4">
              <p className="font-ui text-xs font-black uppercase tracking-[0.18em] text-brand-teal">
                Item Type
              </p>
              <p className="mt-2 font-body text-base text-text-primary">
                {listing.item_type ?? "Not provided"}
              </p>
            </div>
            <div className="rounded-[20px] border border-brand-forest/10 p-4">
              <p className="font-ui text-xs font-black uppercase tracking-[0.18em] text-brand-teal">
                Condition
              </p>
              <p className="mt-2 font-body text-base text-text-primary">
                {listing.condition ?? "Not provided"}
              </p>
            </div>
            <div className="rounded-[20px] border border-brand-forest/10 p-4">
              <p className="font-ui text-xs font-black uppercase tracking-[0.18em] text-brand-teal">
                Location
              </p>
              <p className="mt-2 font-body text-base text-text-primary">
                {listing.location ?? "Not provided"}
              </p>
            </div>
            <div className="rounded-[20px] border border-brand-forest/10 p-4">
              <p className="font-ui text-xs font-black uppercase tracking-[0.18em] text-brand-teal">
                Status
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <StatusPill kind="priority" label={listing.priority ?? "Medium"} />
                <StatusPill kind="status" label={listing.status ?? "Open"} />
              </div>
            </div>
            <div className="rounded-[20px] border border-brand-forest/10 p-4 md:col-span-2">
              <p className="font-ui text-xs font-black uppercase tracking-[0.18em] text-brand-teal">
                Description
              </p>
              <p className="mt-2 font-body text-base leading-7 text-text-primary/80">
                {listing.description ?? "No description has been added for this request yet."}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/wishlist"
              className="inline-flex items-center justify-center rounded-full bg-brand-forest px-6 py-3 font-ui text-sm font-bold text-brand-cream"
            >
              Confirm
            </Link>
            <Link
              href={`/wishlist/${listing.id}/edit`}
              className="inline-flex items-center justify-center rounded-full border border-border-accent px-6 py-3 font-ui text-sm font-bold text-brand-teal"
            >
              Edit Item
            </Link>
            <form action={deleteListing} className="sm:ml-auto">
              <input type="hidden" name="listingId" value={listing.id} />
              <button
                type="submit"
                className="w-full rounded-full border border-border-accent px-6 py-3 font-ui text-sm font-bold text-brand-teal"
              >
                Remove
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
