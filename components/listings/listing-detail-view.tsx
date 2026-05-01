import Image from "next/image";
import type { ReactNode } from "react";
import type { ItemRecord } from "@/lib/types/item";

type ListingDetailViewProps = {
  item: ItemRecord;
  rightPanel: ReactNode;
};

export function ListingDetailView({ item, rightPanel }: ListingDetailViewProps) {
  return (
    <div className="detail-shell__grid">
      <section className="detail-shell__media-card">
        <div className="detail-shell__media">
          {item.imageSrc ? (
            <Image
              src={item.imageSrc}
              alt={item.imageAlt}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 48vw, 100vw"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-brand-cream/35" />
          )}
        </div>
        <div className="detail-shell__copy">
          <p>{item.description || "No description has been added to this request yet."}</p>
        </div>
      </section>

      <aside className="detail-panel">{rightPanel}</aside>
    </div>
  );
}
