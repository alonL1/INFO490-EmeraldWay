import { headers } from "next/headers";
import { FilterSidebar } from "@/components/home/filter-sidebar";
import { ItemGrid } from "@/components/home/item-grid";
import { PageShell } from "@/components/layout/page-shell";
import { getViewerContext } from "@/lib/server/viewer";
import type { ItemSummary } from "@/lib/types/item";

const COMMUNITY_COMPASS_URL = "https://comm-compass.vercel.app";
const CAPSTONE_HOST = "info-490-emerald-way.vercel.app";

export default async function HomePage() {
  const host = (await headers()).get("host") ?? "";
  const isCapstoneSite = host === CAPSTONE_HOST;
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
        {isCapstoneSite && (
          <aside
            className="rounded-[28px] border border-amber-300/70 bg-amber-50 p-5 shadow-panel"
            role="note"
            aria-label="Project continuation notice"
          >
            <p className="font-body text-xs font-medium uppercase tracking-[0.24em] text-amber-800">
              iSchool Capstone Notice
            </p>
            <h2 className="mt-2 font-ui text-2xl font-black leading-tight text-brand-teal">
              This project is continuing as Community Compass.
            </h2>
            <p className="mt-3 max-w-2xl font-body text-sm leading-6 text-text-primary/80">
              The site you are on was built for the University of Washington iSchool
              Capstone. The project lives on beyond the capstone as{" "}
              <strong>Community Compass</strong> — same mission, same team, new home.
              Visit the live project site for the latest updates, partner organizations,
              and ways to get involved.
            </p>
            <a
              href={COMMUNITY_COMPASS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-teal px-5 py-2 font-ui text-sm font-extrabold uppercase tracking-[0.16em] text-white transition hover:bg-brand-forest"
            >
              Visit Community Compass →
            </a>
          </aside>
        )}

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
