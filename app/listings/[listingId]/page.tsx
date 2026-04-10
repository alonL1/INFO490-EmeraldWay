import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { itemsById } from "@/lib/mock/items";

type ListingPageProps = {
  params: Promise<{
    listingId: string;
  }>;
};

export async function generateStaticParams() {
  return Object.keys(itemsById).map((listingId) => ({ listingId }));
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { listingId } = await params;
  const item = itemsById[listingId];

  if (!item) {
    notFound();
  }

  return (
    <PageShell activeKey="home" variant="nonprofit">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-body text-sm uppercase tracking-[0.24em] text-brand-teal">
                Listing Details
              </p>
              <h1 className="font-body text-3xl font-medium text-text-primary sm:text-4xl">
                {item.title}
              </h1>
              <p className="mt-2 font-body text-base text-text-primary/70">
                {item.organization}
              </p>
            </div>
            <Link
              href="/"
              className="rounded-full border border-border-accent px-5 py-2 font-ui text-sm font-bold text-brand-teal transition hover:bg-brand-teal hover:text-white"
            >
              Back to listings
            </Link>
          </div>
          <div className="overflow-hidden rounded-[28px] border border-brand-forest/10 bg-white shadow-panel">
            <div className="relative aspect-[4/3] w-full bg-brand-cream/35">
              <Image
                src={item.imageSrc}
                alt={item.imageAlt}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 58vw, 100vw"
                priority
              />
            </div>
            <div className="space-y-4 p-6">
              <p className="font-body text-base leading-7 text-text-primary/80">
                {item.description}
              </p>
            </div>
          </div>
        </section>

        <aside className="rounded-[28px] border border-brand-forest/10 bg-white p-6 shadow-panel">
          <h2 className="font-ui text-xl font-black text-brand-teal">
            Donation Snapshot
          </h2>
          <dl className="mt-6 space-y-4">
            <div className="grid grid-cols-[110px_1fr] gap-3">
              <dt className="font-ui text-sm font-black uppercase tracking-wide text-brand-teal">
                Item Type
              </dt>
              <dd className="font-body text-base text-text-primary">{item.itemType}</dd>
            </div>
            <div className="grid grid-cols-[110px_1fr] gap-3">
              <dt className="font-ui text-sm font-black uppercase tracking-wide text-brand-teal">
                Condition
              </dt>
              <dd className="font-body text-base text-text-primary">{item.condition}</dd>
            </div>
            <div className="grid grid-cols-[110px_1fr] gap-3">
              <dt className="font-ui text-sm font-black uppercase tracking-wide text-brand-teal">
                Location
              </dt>
              <dd className="font-body text-base text-text-primary">{item.location}</dd>
            </div>
            <div className="grid grid-cols-[110px_1fr] gap-3">
              <dt className="font-ui text-sm font-black uppercase tracking-wide text-brand-teal">
                Priority
              </dt>
              <dd className="font-body text-base text-text-primary">{item.priority}</dd>
            </div>
            <div className="grid grid-cols-[110px_1fr] gap-3">
              <dt className="font-ui text-sm font-black uppercase tracking-wide text-brand-teal">
                Status
              </dt>
              <dd className="font-body text-base text-text-primary">{item.status}</dd>
            </div>
          </dl>
          <div className="mt-8 rounded-[22px] border border-brand-forest/15 bg-brand-cream/45 p-5">
            <p className="font-ui text-sm font-black uppercase tracking-wide text-brand-teal">
              Next Step
            </p>
            <p className="mt-2 font-body text-sm leading-6 text-text-primary/75">
              This route is wired and ready for real backend data once the donation
              workflow is connected.
            </p>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}

