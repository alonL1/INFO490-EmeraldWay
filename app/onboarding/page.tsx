import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import {
  DonorOnboardingForm,
  OrganizationOnboardingForm,
} from "@/components/auth/onboarding-form";
import { requireViewer } from "@/lib/server/viewer";

export default async function OnboardingPage() {
  const viewer = await requireViewer();

  if (viewer.role === "organization") {
    const { data: profile } = await viewer.supabase
      .from("profiles")
      .select("id")
      .eq("id", viewer.user.id)
      .maybeSingle();

    if (profile) {
      redirect("/profile");
    }

    return (
      <PageShell role={viewer.role}>
        <OrganizationOnboardingForm />
      </PageShell>
    );
  }

  const { data: donorProfile } = await viewer.supabase
    .from("donor_profiles")
    .select("id")
    .eq("id", viewer.user.id)
    .maybeSingle();

  if (donorProfile) {
    redirect("/profile");
  }

  return (
    <PageShell role={viewer.role}>
      <DonorOnboardingForm />
    </PageShell>
  );
}
