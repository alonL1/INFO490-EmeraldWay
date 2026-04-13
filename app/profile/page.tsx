import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageShell } from "@/components/layout/page-shell";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/onboarding");
  }

  const { count } = await supabase
    .from("listings")
    .select("*", { count: "exact", head: true })
    .eq("profile_id", user.id);

  return (
    <PageShell activeKey="profile" variant="nonprofit">
      <section className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="rounded-[28px] border border-brand-forest/10 bg-white p-6 shadow-panel">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-brand-cream font-ui text-3xl font-black text-brand-teal">
            {profile.org_name.slice(0, 2).toUpperCase()}
          </div>
          <h1 className="mt-5 text-center font-ui text-2xl font-black text-brand-teal">
            {profile.org_name}
          </h1>
          <p className="mt-2 text-center font-body text-sm text-text-primary/65">
            {profile.description ?? "No description provided."}
          </p>
        </aside>

        <div className="rounded-[28px] border border-brand-forest/10 bg-white p-6 shadow-panel">
          <h2 className="font-ui text-2xl font-black text-brand-teal">
            Account Overview
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[22px] bg-brand-cream/45 p-5">
              <p className="font-ui text-sm font-black uppercase tracking-wide text-brand-teal">
                Role
              </p>
              <p className="mt-2 font-body text-base text-text-primary">Nonprofit</p>
            </div>
            <div className="rounded-[22px] bg-brand-cream/45 p-5">
              <p className="font-ui text-sm font-black uppercase tracking-wide text-brand-teal">
                Region
              </p>
              <p className="mt-2 font-body text-base text-text-primary">
                {profile.location ?? "Not specified"}
              </p>
            </div>
            <div className="rounded-[22px] bg-brand-cream/45 p-5">
              <p className="font-ui text-sm font-black uppercase tracking-wide text-brand-teal">
                Open Requests
              </p>
              <p className="mt-2 font-body text-base text-text-primary">
                {`${count ?? 0} items`}
              </p>
            </div>
            <div className="rounded-[22px] bg-brand-cream/45 p-5">
              <p className="font-ui text-sm font-black uppercase tracking-wide text-brand-teal">
                Status
              </p>
              <p className="mt-2 font-body text-base text-text-primary">Active</p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
