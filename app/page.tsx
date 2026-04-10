import { FilterSidebar } from "@/components/home/filter-sidebar";
import { ItemGrid } from "@/components/home/item-grid";
import { PageShell } from "@/components/layout/page-shell";
import { featuredItems } from "@/lib/mock/items";

export default function HomePage() {
  return (
    <PageShell activeKey="home" variant="nonprofit">
      <section className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start xl:grid-cols-[300px_minmax(0,1fr)] xl:gap-10">
        <FilterSidebar />
        <ItemGrid items={featuredItems} />
      </section>
    </PageShell>
  );
}
