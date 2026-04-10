import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { featuredItems } from "@/lib/mock/items";

export default function WishlistPage() {
  return (
    <PageShell activeKey="home" variant="nonprofit">
      <section className="rounded-[28px] border border-brand-forest/10 bg-white p-6 shadow-panel sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-body text-sm uppercase tracking-[0.24em] text-brand-teal">
              Wishlist
            </p>
            <h1 className="font-ui text-3xl font-black text-brand-teal">Saved Items</h1>
          </div>
          <button
            type="button"
            className="rounded-full bg-brand-forest px-5 py-3 font-ui text-sm font-bold text-brand-cream"
          >
            Add Item
          </button>
        </div>

        <div className="mt-8 space-y-5">
          {featuredItems.slice(0, 2).map((item) => (
            <article
              key={item.id}
              className="flex flex-col gap-4 rounded-[24px] border border-brand-forest/10 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h2 className="font-body text-xl font-medium text-text-primary">
                  {item.title} - {item.organization}
                </h2>
                <p className="mt-2 font-body text-sm text-text-primary/65">
                  Priority: {item.priority} · Status: {item.status}
                </p>
              </div>
              <div className="flex gap-3">
                <Link
                  href={`/listings/${item.id}`}
                  className="rounded-full bg-brand-forest px-4 py-2 font-ui text-sm font-bold text-brand-cream"
                >
                  View
                </Link>
                <button
                  type="button"
                  className="rounded-full border border-border-accent px-4 py-2 font-ui text-sm font-bold text-brand-teal"
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

