import type { ItemSummary } from "@/lib/types/item";
import { ItemCard } from "@/components/home/item-card";

type ItemGridProps = {
  items: ItemSummary[];
};

export function ItemGrid({ items }: ItemGridProps) {
  return (
    <section className="grid gap-5 sm:grid-cols-2 lg:gap-6 xl:grid-cols-3">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </section>
  );
}
