import { FilterSidebar } from "@/components/home/filter-sidebar";
import { ItemGrid } from "@/components/home/item-grid";
import { PageShell } from "@/components/layout/page-shell";
import { featuredItems } from "@/lib/mock/items";

export default function HomePage() {
  return (
    <PageShell activeKey="home" variant="nonprofit">
      <section className="home-layout">
        <FilterSidebar />
        <ItemGrid items={featuredItems} />
      </section>
    </PageShell>
  );
}
