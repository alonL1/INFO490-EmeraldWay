import { FilterSidebar } from "@/components/home/filter-sidebar";
import { ItemGrid } from "@/components/home/item-grid";
import { PageShell } from "@/components/layout/page-shell";
import { getViewerContext } from "@/lib/server/viewer";
import type { ItemSummary } from "@/lib/types/item";

export default async function HomePage() {
  const viewer = await getViewerContext();
  const { data } = await viewer.supabase
      .from("listings")
      .select("id, profile_id, title, image_url, location, priority, status, profiles(org_name)")
      .order("created_at", { ascending: false });

  const items: ItemSummary[] = (data ?? [])
    .filter((listing) => listing.profiles !== null)
    .map((listing) => ({
      id: listing.id,
      profileId: listing.profile_id,
      title: listing.title,
      organization: (listing.profiles as unknown as { org_name: string }).org_name,
      imageSrc: listing.image_url,
      imageAlt: `${listing.title} donation request`,
      location: listing.location ?? "Seattle, WA",
      priority: listing.priority ?? "Medium",
      status: listing.status ?? "Pending",
    }));

  return (
    <PageShell activeKey="home" role={viewer.role}>
      <section className="home-shell">
        <div className="home-shell__intro">
          <div>
            <p className="section-eyebrow">Community Listings</p>
            <h1 className="section-heading">Browse active requests and match support quickly.</h1>
            <p className="section-copy">
              Explore open needs from local organizations, save the listings you want to revisit,
              and submit a donation form when you are ready to help.
            </p>
          </div>
        </div>

        <section className="home-layout">
        <FilterSidebar />
        <ItemGrid items={items} />
        </section>
      </section>
    </PageShell>
  );
}
