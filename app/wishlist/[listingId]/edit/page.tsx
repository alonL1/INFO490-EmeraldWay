import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { updateListing } from "@/app/wishlist/actions";
import { AddItemForm } from "@/components/wishlist/add-item-form";
import { requireRole } from "@/lib/server/viewer";

type EditWishlistItemPageProps = {
  params: Promise<{
    listingId: string;
  }>;
};

export default async function EditWishlistItemPage({ params }: EditWishlistItemPageProps) {
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
      <AddItemForm
        action={updateListing}
        cancelHref={`/wishlist/${listing.id}`}
        heading="Edit Wishlist Item"
        description="Update the request details and keep the wishlist aligned with current needs."
        initialValues={listing}
        submitLabel="Save Changes"
      />
    </PageShell>
  );
}
