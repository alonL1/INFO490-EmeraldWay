import Link from "next/link";
import { redirect } from "next/navigation";
import { saveDonorProfile, saveOrganizationProfile } from "@/app/onboarding/actions";
import { PageShell } from "@/components/layout/page-shell";
import { requireViewer } from "@/lib/server/viewer";

export default async function EditProfilePage() {
  const viewer = await requireViewer();

  if (viewer.role === "organization") {
    const { data: profile } = await viewer.supabase
      .from("profiles")
      .select("*")
      .eq("id", viewer.user.id)
      .maybeSingle();

    if (!profile) {
      redirect("/onboarding");
    }

    return (
      <PageShell activeKey="profile" role={viewer.role}>
        <div className="mx-auto w-full max-w-3xl rounded-[28px] border border-brand-forest/10 bg-white p-8 shadow-panel">
          <div className="mb-8">
            <p className="section-eyebrow">Organization Profile</p>
            <h1 className="section-heading">Edit Profile</h1>
            <p className="section-copy">
              Keep the public organization details accurate so donors know what you support.
            </p>
          </div>

          <form action={saveOrganizationProfile} className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label htmlFor="org_name" className="font-ui text-sm font-black uppercase tracking-wide text-brand-teal">
                  Organization Name
                </label>
                <input
                  id="org_name"
                  name="org_name"
                  type="text"
                  required
                  defaultValue={profile.org_name}
                  className="w-full rounded-[14px] border border-brand-forest/15 px-4 py-3 font-body text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label htmlFor="description" className="font-ui text-sm font-black uppercase tracking-wide text-brand-teal">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  defaultValue={profile.description ?? ""}
                  className="w-full rounded-[14px] border border-brand-forest/15 px-4 py-3 font-body text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30 resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="location" className="font-ui text-sm font-black uppercase tracking-wide text-brand-teal">
                  Location
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  defaultValue={profile.location ?? ""}
                  className="w-full rounded-[14px] border border-brand-forest/15 px-4 py-3 font-body text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="contact_email" className="font-ui text-sm font-black uppercase tracking-wide text-brand-teal">
                  Contact Email
                </label>
                <input
                  id="contact_email"
                  name="contact_email"
                  type="email"
                  defaultValue={profile.contact_email ?? viewer.user.email ?? ""}
                  className="w-full rounded-[14px] border border-brand-forest/15 px-4 py-3 font-body text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
                />
              </div>
            </div>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-brand-forest px-6 py-3 font-ui text-sm font-bold text-brand-cream"
              >
                Save Changes
              </button>
              <Link
                href="/profile"
                className="inline-flex items-center justify-center rounded-full border border-border-accent px-6 py-3 font-ui text-sm font-bold text-brand-teal"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </PageShell>
    );
  }

  const { data: donorProfile } = await viewer.supabase
    .from("donor_profiles")
    .select("*")
    .eq("id", viewer.user.id)
    .maybeSingle();

  if (!donorProfile) {
    redirect("/onboarding");
  }

  return (
    <PageShell activeKey="profile" role={viewer.role}>
      <div className="mx-auto w-full max-w-3xl rounded-[28px] border border-brand-forest/10 bg-white p-8 shadow-panel">
        <div className="mb-8">
          <p className="section-eyebrow">Donor Profile</p>
          <h1 className="section-heading">Edit Profile</h1>
          <p className="section-copy">
            Update the donor details that appear on submissions and saved-item flows.
          </p>
        </div>

        <form action={saveDonorProfile} className="grid gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="full_name" className="font-ui text-sm font-black uppercase tracking-wide text-brand-teal">
                Full Name
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                defaultValue={donorProfile.full_name}
                className="w-full rounded-[14px] border border-brand-forest/15 px-4 py-3 font-body text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="location" className="font-ui text-sm font-black uppercase tracking-wide text-brand-teal">
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                defaultValue={donorProfile.location ?? ""}
                className="w-full rounded-[14px] border border-brand-forest/15 px-4 py-3 font-body text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact_email" className="font-ui text-sm font-black uppercase tracking-wide text-brand-teal">
                Contact Email
              </label>
              <input
                id="contact_email"
                name="contact_email"
                type="email"
                defaultValue={donorProfile.contact_email ?? viewer.user.email ?? ""}
                className="w-full rounded-[14px] border border-brand-forest/15 px-4 py-3 font-body text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
              />
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="focus_area" className="font-ui text-sm font-black uppercase tracking-wide text-brand-teal">
                Focus Area
              </label>
              <input
                id="focus_area"
                name="focus_area"
                type="text"
                defaultValue={donorProfile.focus_area ?? ""}
                className="w-full rounded-[14px] border border-brand-forest/15 px-4 py-3 font-body text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
              />
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="bio" className="font-ui text-sm font-black uppercase tracking-wide text-brand-teal">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={5}
                defaultValue={donorProfile.bio ?? ""}
                className="w-full rounded-[14px] border border-brand-forest/15 px-4 py-3 font-body text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30 resize-none"
              />
            </div>
          </div>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-brand-forest px-6 py-3 font-ui text-sm font-bold text-brand-cream"
            >
              Save Changes
            </button>
            <Link
              href="/profile"
              className="inline-flex items-center justify-center rounded-full border border-border-accent px-6 py-3 font-ui text-sm font-bold text-brand-teal"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </PageShell>
  );
}
