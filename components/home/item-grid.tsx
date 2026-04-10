import type { ItemSummary } from "@/lib/types/item";
import { ItemCard } from "@/components/home/item-card";

type ItemGridProps = {
  items: ItemSummary[];
};

export function ItemGrid({ items }: ItemGridProps) {
  return (
    <section className="item-grid">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </section>
  );
}
