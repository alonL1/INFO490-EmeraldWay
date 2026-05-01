import Link from "next/link";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { ProfileSections } from "@/components/profile/profile-sections";
import { requireViewer } from "@/lib/server/viewer";

function formatDateLabel(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default async function ProfilePage() {
  const viewer = await requireViewer();

  if (viewer.role === "organization") {
    const [
      { data: profile },
      { count: listingCount },
      { count: incomingCount },
      { count: pendingIntakeCount },
      { data: recentListings },
      { data: recentDonations },
    ] = await Promise.all([
      viewer.supabase.from("profiles").select("*").eq("id", viewer.user.id).maybeSingle(),
      viewer.supabase
        .from("listings")
        .select("*", { count: "exact", head: true })
        .eq("profile_id", viewer.user.id),
      viewer.supabase
        .from("donations")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", viewer.user.id),
      viewer.supabase
        .from("donations")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", viewer.user.id)
        .in("status", ["submitted", "accepted"]),
      viewer.supabase
        .from("listings")
        .select("id, title, location, priority, status")
        .eq("profile_id", viewer.user.id)
        .order("created_at", { ascending: false })
        .limit(3),
      viewer.supabase
        .from("donations")
        .select("id, donor_display_name, confirmation_code, status, created_at, listings(title)")
        .eq("organization_id", viewer.user.id)
        .order("created_at", { ascending: false })
        .limit(3),
    ]);

    if (!profile) {
      redirect("/onboarding");
    }

    return (
      <PageShell activeKey="profile" role={viewer.role}>
        <section className="dashboard-shell">
          <div className="dashboard-hero">
            <div className="dashboard-hero__copy">
              <p className="section-eyebrow">Organization Profile</p>
              <h1 className="section-heading">{profile.org_name}</h1>
              <p className="section-copy">
                {profile.description ?? "Add a short description so donors understand your work."}
              </p>
            </div>
            <div className="dashboard-hero__actions">
              <Link
                href="/profile/edit"
                className="rounded-full bg-brand-forest px-5 py-3 font-ui text-sm font-bold text-brand-cream"
              >
                Edit Profile
              </Link>
              <Link
                href="/incoming-donations"
                className="rounded-full border border-border-accent px-5 py-3 font-ui text-sm font-bold text-brand-teal"
              >
                Incoming Donations
              </Link>
              <Link
                href="/wishlist"
                className="rounded-full border border-border-accent px-5 py-3 font-ui text-sm font-bold text-brand-teal"
              >
                Wishlist
              </Link>
            </div>
          </div>

          <div className="dashboard-stats">
            <article className="dashboard-stat">
              <p>Open Requests</p>
              <strong>{listingCount ?? 0}</strong>
            </article>
            <article className="dashboard-stat">
              <p>Incoming Donations</p>
              <strong>{incomingCount ?? 0}</strong>
            </article>
            <article className="dashboard-stat">
              <p>Needs Review</p>
              <strong>{pendingIntakeCount ?? 0}</strong>
            </article>
            <article className="dashboard-stat">
              <p>Location</p>
              <strong>{profile.location ?? "Not set"}</strong>
            </article>
          </div>

          <ProfileSections
            sections={[
              {
                title: "Incoming Donations",
                href: "/incoming-donations",
                description:
                  "Monitor new submissions, update statuses, and keep drop-off coordination moving.",
                emptyText: "No incoming donations yet.",
                items:
                  recentDonations?.map((donation) => {
                    const listingTitle =
                      (
                        donation.listings as unknown as
                          | { title?: string | null }
                          | null
                      )?.title ?? "Donation Request";

                    return {
                      id: donation.id,
                      href: `/incoming-donations/${donation.id}`,
                      title: `${donation.donor_display_name} · ${listingTitle}`,
                      subtitle: `${donation.confirmation_code} · ${formatDateLabel(donation.created_at)}`,
                      pills: [{ kind: "status" as const, label: donation.status }],
                    };
                  }) ?? [],
              },
              {
                title: "Wishlist",
                href: "/wishlist",
                description:
                  "Preview the latest requests and jump directly into item detail or edit flows.",
                emptyText: "No wishlist items yet.",
                items:
                  recentListings?.map((item) => ({
                    id: item.id,
                    href: `/wishlist/${item.id}`,
                    title: item.title,
                    subtitle: item.location ?? "Location to be confirmed",
                    pills: [
                      { kind: "priority" as const, label: item.priority ?? "Medium" },
                      { kind: "status" as const, label: item.status ?? "Open" },
                    ],
                  })) ?? [],
              },
            ]}
          />
        </section>
      </PageShell>
    );
  }

  const [
    { data: donorProfile },
    { count: savedCount },
    { count: donationCount },
    { count: activeDonationCount },
    { data: savedItems },
    { data: donations },
  ] = await Promise.all([
    viewer.supabase.from("donor_profiles").select("*").eq("id", viewer.user.id).maybeSingle(),
    viewer.supabase
      .from("saved_listings")
      .select("*", { count: "exact", head: true })
      .eq("donor_id", viewer.user.id),
    viewer.supabase
      .from("donations")
      .select("*", { count: "exact", head: true })
      .eq("donor_id", viewer.user.id),
    viewer.supabase
      .from("donations")
      .select("*", { count: "exact", head: true })
      .eq("donor_id", viewer.user.id)
      .in("status", ["submitted", "accepted"]),
    viewer.supabase
      .from("saved_listings")
      .select(
        "id, listing_id, listings(id, title, location, priority, status, profiles(org_name))",
      )
      .eq("donor_id", viewer.user.id)
      .order("created_at", { ascending: false })
      .limit(3),
    viewer.supabase
      .from("donations")
      .select(
        "id, confirmation_code, status, created_at, listings(id, title, location, profiles(org_name))",
      )
      .eq("donor_id", viewer.user.id)
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  if (!donorProfile) {
    redirect("/onboarding");
  }

  return (
    <PageShell activeKey="profile" role={viewer.role}>
      <section className="dashboard-shell">
        <div className="dashboard-hero">
          <div className="dashboard-hero__copy">
            <p className="section-eyebrow">Donor Profile</p>
            <h1 className="section-heading">{donorProfile.full_name}</h1>
            <p className="section-copy">
              {donorProfile.bio ??
                "Add a short donor bio so organizations know what kinds of requests you prefer."}
            </p>
          </div>
          <div className="dashboard-hero__actions">
            <Link
              href="/profile/edit"
              className="rounded-full bg-brand-forest px-5 py-3 font-ui text-sm font-bold text-brand-cream"
            >
              Edit Profile
            </Link>
            <Link
              href="/donations"
              className="rounded-full border border-border-accent px-5 py-3 font-ui text-sm font-bold text-brand-teal"
            >
              Donations
            </Link>
            <Link
              href="/saved-items"
              className="rounded-full border border-border-accent px-5 py-3 font-ui text-sm font-bold text-brand-teal"
            >
              Saved Items
            </Link>
          </div>
        </div>

        <div className="dashboard-stats">
          <article className="dashboard-stat">
            <p>Saved Items</p>
            <strong>{savedCount ?? 0}</strong>
          </article>
          <article className="dashboard-stat">
            <p>Total Donations</p>
            <strong>{donationCount ?? 0}</strong>
          </article>
            <article className="dashboard-stat">
              <p>Active Donations</p>
              <strong>{activeDonationCount ?? 0}</strong>
            </article>
          <article className="dashboard-stat">
            <p>Focus Area</p>
            <strong>{donorProfile.focus_area ?? "General support"}</strong>
          </article>
        </div>

        <ProfileSections
          sections={[
            {
              title: "Donations",
              href: "/donations",
              description:
                "Track donation submissions, confirmation codes, and the latest organization updates.",
              emptyText: "No donation submissions yet.",
              items:
                donations?.map((donation) => {
                  const listing =
                    (
                      donation.listings as unknown as
                        | {
                            id?: string | null;
                            location?: string | null;
                            profiles?: { org_name?: string | null } | null;
                            title?: string | null;
                          }
                        | null
                    ) ?? null;

                  return {
                    id: donation.id,
                    href: `/donations/${donation.id}`,
                    title: listing?.title ?? "Donation",
                    subtitle: `${listing?.profiles?.org_name ?? "Organization"} · ${donation.confirmation_code}`,
                    pills: [{ kind: "status" as const, label: donation.status }],
                  };
                }) ?? [],
            },
            {
              title: "Saved Items",
              href: "/saved-items",
              description:
                "Quick access to the listings you want to revisit or donate to later.",
              emptyText: "No saved items yet.",
              items:
                savedItems?.map((saved) => {
                  const listing =
                    (
                      saved.listings as unknown as
                        | {
                            id?: string | null;
                            location?: string | null;
                            priority?: string | null;
                            profiles?: { org_name?: string | null } | null;
                            status?: string | null;
                            title?: string | null;
                          }
                        | null
                    ) ?? null;

                  return {
                    id: saved.id,
                    href: `/listings/${listing?.id ?? saved.listing_id}`,
                    title: listing?.title ?? "Saved Request",
                    subtitle: `${listing?.profiles?.org_name ?? "Organization"} · ${listing?.location ?? "Location to be confirmed"}`,
                    pills: [
                      { kind: "priority" as const, label: listing?.priority ?? "Medium" },
                      { kind: "status" as const, label: listing?.status ?? "Open" },
                    ],
                  };
                }) ?? [],
            },
          ]}
        />
      </section>
    </PageShell>
  );
}
