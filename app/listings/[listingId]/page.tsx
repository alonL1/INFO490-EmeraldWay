import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { ListingDetailView } from "@/components/listings/listing-detail-view";
import { StatusPill } from "@/components/shared/status-pill";
import { toggleSavedListing } from "@/app/donations/actions";
import { getViewerContext } from "@/lib/server/viewer";
import type { ItemRecord } from "@/lib/types/item";

type ListingPageProps = {
  params: Promise<{
    listingId: string;
  }>;
};

export default async function ListingPage({ params }: ListingPageProps) {
  const viewer = await getViewerContext();
  const { listingId } = await params;

  const { data: listing } = await viewer.supabase
    .from("listings")
    .select("*, profiles(org_name)")
    .eq("id", listingId)
    .single();

  if (!listing) {
    notFound();
  }

  const profiles = listing.profiles as unknown as { org_name: string } | null;
  const item: ItemRecord = {
    id: listing.id,
    profileId: listing.profile_id,
    title: listing.title,
    organization: profiles?.org_name ?? "Unknown Organization",
    imageSrc: listing.image_url,
    imageAlt: `${listing.title} donation request`,
    condition: listing.condition ?? "Not specified",
    description: listing.description ?? "",
    itemType: listing.item_type ?? "General",
    location: listing.location ?? "Seattle, WA",
    priority: listing.priority ?? "Medium",
    status: listing.status ?? "Open",
  };

  const isOwnerOrganization =
    viewer.isAuthenticated &&
    viewer.role === "organization" &&
    viewer.user?.id === item.profileId;

  const isDonorViewer = viewer.role === "donor";
  let isSaved = false;

  if (viewer.isAuthenticated && isDonorViewer && viewer.user) {
    const { data: savedListing } = await viewer.supabase
      .from("saved_listings")
      .select("id")
      .eq("donor_id", viewer.user.id)
      .eq("listing_id", item.id)
      .maybeSingle();

    isSaved = Boolean(savedListing);
  }

  return (
    <PageShell
      activeKey={isOwnerOrganization ? "wishlist" : "home"}
      role={viewer.role}
    >
      <section className="detail-shell">
        <div className="detail-shell__header">
          <div className="detail-shell__summary">
            <p className="section-eyebrow">
              {isOwnerOrganization ? "Request Details" : "Donation Opportunity"}
            </p>
            <h1 className="section-heading">{item.title}</h1>
            <p className="section-copy">
              <strong>{item.organization}</strong>
              {" · "}
              {item.location}
            </p>
          </div>

          <div className="detail-shell__header-actions">
            <Link
              href={isOwnerOrganization ? "/wishlist" : "/"}
              className="rounded-full border border-border-accent px-5 py-2 font-ui text-sm font-bold text-brand-teal transition hover:bg-brand-teal hover:text-white"
            >
              {isOwnerOrganization ? "Back to wishlist" : "Back to listings"}
            </Link>

            {viewer.isAuthenticated && isDonorViewer ? (
              <form action={toggleSavedListing}>
                <input type="hidden" name="listingId" value={item.id} />
                <button
                  type="submit"
                  className="bookmark-button"
                  aria-label={isSaved ? "Remove saved item" : "Save item"}
                >
                  {isSaved ? "★" : "☆"}
                </button>
              </form>
            ) : null}
          </div>
        </div>

        <ListingDetailView
          item={item}
          rightPanel={
            <>
              <div>
                <p className="section-eyebrow">
                  {isOwnerOrganization ? "Request Management" : "Complete To Donate"}
                </p>
                <h2 className="section-heading">
                  {isOwnerOrganization
                    ? "Keep this request visible and coordinated."
                    : "Confirm timing before you drop off."}
                </h2>
                <p className="section-copy">
                  {isOwnerOrganization
                    ? "Use the wishlist and incoming donations pages to update this request as donor coordination progresses."
                    : "Submit a donation form so the organization can review your offer and send the next handoff details."}
                </p>
              </div>

              <div className="detail-panel__actions">
                {isOwnerOrganization ? (
                  <>
                    <Link
                      href={`/wishlist/${item.id}/edit`}
                      className="rounded-full bg-brand-forest px-5 py-3 font-ui text-sm font-bold text-brand-cream"
                    >
                      Edit Item
                    </Link>
                    <Link
                      href="/incoming-donations"
                      className="rounded-full border border-border-accent px-5 py-3 font-ui text-sm font-bold text-brand-teal"
                    >
                      Open Incoming Donations
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href={
                        viewer.isAuthenticated && isDonorViewer
                          ? `/listings/${item.id}/donate`
                          : "/login"
                      }
                      className="rounded-full bg-brand-forest px-5 py-3 font-ui text-sm font-bold text-brand-cream"
                    >
                      {viewer.isAuthenticated && isDonorViewer
                        ? "Go to form"
                        : "Sign in to donate"}
                    </Link>
                    <Link
                      href={viewer.isAuthenticated ? "/messages" : "/login"}
                      className="rounded-full border border-border-accent px-5 py-3 font-ui text-sm font-bold text-brand-teal"
                    >
                      {viewer.isAuthenticated ? "Message organization" : "Sign in to message"}
                    </Link>
                  </>
                )}
              </div>

              <dl className="detail-meta-grid">
                <div>
                  <dt>Item Type</dt>
                  <dd>{item.itemType}</dd>
                </div>
                <div>
                  <dt>Condition</dt>
                  <dd>{item.condition}</dd>
                </div>
                <div>
                  <dt>Location</dt>
                  <dd>{item.location}</dd>
                </div>
                <div>
                  <dt>Next Step</dt>
                  <dd>
                    {isOwnerOrganization
                      ? "Review incoming submissions and keep status current."
                      : "Complete the donation form and wait for organization follow-up."}
                  </dd>
                </div>
              </dl>

              <div className="detail-chip-row">
                <StatusPill kind="priority" label={item.priority} />
                <StatusPill kind="status" label={item.status} />
              </div>
            </>
          }
        />
      </section>
    </PageShell>
  );
}
