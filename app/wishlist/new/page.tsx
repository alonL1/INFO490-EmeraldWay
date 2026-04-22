import { PageShell } from "@/components/layout/page-shell";
import { AddItemForm } from "@/components/wishlist/add-item-form";
import { requireRole } from "@/lib/server/viewer";

export default async function NewListingPage() {
  const viewer = await requireRole("organization");

  return (
    <PageShell activeKey="wishlist" role={viewer.role}>
      <AddItemForm
        heading="New Wishlist Item"
        description="Use the shared item form to publish a request and send it live to donors."
        submitLabel="Confirm Item"
      />
    </PageShell>
  );
}
