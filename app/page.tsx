import { FilterSidebar } from "@/components/home/filter-sidebar";
import { ItemGrid } from "@/components/home/item-grid";
import { PageShell } from "@/components/layout/page-shell";
import { createClient } from "@/lib/supabase/server";
import type { ItemSummary } from "@/lib/types/item";

export default async function HomePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("listings")
    .select("id, title, image_url, profiles(org_name)")
    .order("created_at", { ascending: false });

  const items: ItemSummary[] = (data ?? [])
    .filter((l) => l.profiles !== null)
    .map((l) => ({
      id: l.id,
      title: l.title,
      organization: (l.profiles as unknown as { org_name: string }).org_name,
      imageSrc: l.image_url,
      imageAlt: `${l.title} donation request`,
    }));

  return (
    <PageShell activeKey="home" variant="nonprofit">
      <section className="home-layout">
        <FilterSidebar />
        <ItemGrid items={items} />
      </section>
    </PageShell>
  );
}
