import Image from "next/image";
import Link from "next/link";
import type { ItemSummary } from "@/lib/types/item";

type ItemCardProps = {
  item: ItemSummary;
};

export function ItemCard({ item }: ItemCardProps) {
  return (
    <article>
      <Link
        href={`/listings/${item.id}`}
        className="item-card group"
        aria-label={`View ${item.title}`}
      >
        <div className="item-card__media">
          {item.imageSrc ? (
            <Image
              src={item.imageSrc}
              alt={item.imageAlt}
              fill
              className="object-cover transition duration-300 group-hover:scale-[1.02]"
              sizes="(min-width: 1200px) 22vw, (min-width: 900px) 34vw, (min-width: 640px) 28vw, 44vw"
            />
          ) : (
            <div className="absolute inset-0 bg-brand-cream/35" />
          )}
        </div>
        <div className="item-card__content">
          <h3 className="item-card__title">
            {item.title}
          </h3>
          <p className="item-card__meta">
            {item.organization}
          </p>
        </div>
      </Link>
    </article>
  );
}
