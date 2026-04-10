import Image from "next/image";
import Link from "next/link";
import type { ItemSummary } from "@/lib/types/item";

type ItemCardProps = {
  item: ItemSummary;
};

export function ItemCard({ item }: ItemCardProps) {
  return (
    <article className="w-full">
      <Link
        href={`/listings/${item.id}`}
        className="group block overflow-hidden rounded-[28px] border border-brand-forest/10 bg-white shadow-panel transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_45px_rgba(65,93,67,0.14)]"
        aria-label={`View ${item.title}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-brand-cream/50">
          <Image
            src={item.imageSrc}
            alt={item.imageAlt}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
            sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
          />
        </div>
        <div className="space-y-1 px-4 pb-5 pt-4 sm:px-5">
          <h3 className="font-body text-xl font-medium leading-tight text-text-primary sm:text-2xl">
            {item.title}
          </h3>
          <p className="font-body text-sm font-medium text-text-primary/70 sm:text-base">
            {item.organization}
          </p>
        </div>
      </Link>
    </article>
  );
}
