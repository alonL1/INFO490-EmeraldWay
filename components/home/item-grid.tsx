import type { ItemSummary } from "@/lib/types/item";
import { ItemCard } from "@/components/home/item-card";

type ItemGridProps = {
  items: ItemSummary[];
};

export function ItemGrid({ items }: ItemGridProps) {
  if (items.length === 0) {
    return (
      <section className="empty-state">
        <p>No active requests are visible yet.</p>
      </section>
    );
  }

  return (
    <section className="item-grid">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </section>
  );
}
