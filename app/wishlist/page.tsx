import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteListing } from "@/app/wishlist/actions";
import { PageShell } from "@/components/layout/page-shell";

export default async function WishlistPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: listings } = user
    ? await supabase
        .from("listings")
        .select("*")
        .eq("profile_id", user.id)
        .order("created_at", { ascending: false })
    : { data: [] };

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
          <Link
            href="/wishlist/new"
            className="rounded-full bg-brand-forest px-5 py-3 font-ui text-sm font-bold text-brand-cream"
          >
            Add Item
          </Link>
        </div>

        <div className="mt-8 space-y-5">
          {listings && listings.length > 0 ? (
            listings.map((item) => (
              <article
                key={item.id}
                className="flex flex-col gap-4 rounded-[24px] border border-brand-forest/10 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h2 className="font-body text-xl font-medium text-text-primary">
                    {item.title}
                  </h2>
                  <p className="mt-2 font-body text-sm text-text-primary/65">
                    Priority: {item.priority} · Status: {item.status}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link
                    href={"/listings/" + item.id}
                    className="rounded-full bg-brand-forest px-4 py-2 font-ui text-sm font-bold text-brand-cream"
                  >
                    View
                  </Link>
                  <form action={deleteListing}>
                    <input type="hidden" name="listingId" value={item.id} />
                    <button
                      type="submit"
                      className="rounded-full border border-border-accent px-4 py-2 font-ui text-sm font-bold text-brand-teal"
                    >
                      Remove
                    </button>
                  </form>
                </div>
              </article>
            ))
          ) : (
            <p className="font-body text-base text-text-primary/65">
              No items yet. Add your first wishlist item.
            </p>
          )}
        </div>
      </section>
    </PageShell>
  );
}
