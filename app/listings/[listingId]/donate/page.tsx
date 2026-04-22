import { notFound, redirect } from "next/navigation";
import { DonationSubmissionForm } from "@/components/donations/donation-submission-form";
import { PageShell } from "@/components/layout/page-shell";
import { requireRole } from "@/lib/server/viewer";

type DonatePageProps = {
  params: Promise<{
    listingId: string;
  }>;
};

export default async function DonatePage({ params }: DonatePageProps) {
  const viewer = await requireRole("donor");
  const { listingId } = await params;

  const [{ data: listing }, { data: donorProfile }] = await Promise.all([
    viewer.supabase
      .from("listings")
      .select("id, title, profiles(org_name)")
      .eq("id", listingId)
      .single(),
    viewer.supabase
      .from("donor_profiles")
      .select("full_name, contact_email")
      .eq("id", viewer.user.id)
      .maybeSingle(),
  ]);

  if (!listing) {
    notFound();
  }

  if (!donorProfile) {
    redirect("/onboarding");
  }

  const organizationName =
    (listing.profiles as unknown as { org_name?: string | null } | null)?.org_name ??
    "Organization";

  return (
    <PageShell activeKey="donations" role={viewer.role}>
      <section className="dashboard-shell">
        <div className="dashboard-hero">
          <div className="dashboard-hero__copy">
            <p className="section-eyebrow">Donation Opportunity</p>
            <h1 className="section-heading">{listing.title}</h1>
            <p className="section-copy">
              You are submitting a donation for <strong>{organizationName}</strong>.
            </p>
          </div>
        </div>

        <DonationSubmissionForm
          donorEmail={donorProfile.contact_email ?? viewer.user.email ?? ""}
          donorName={donorProfile.full_name}
          listingId={listing.id}
        />
      </section>
    </PageShell>
  );
}
