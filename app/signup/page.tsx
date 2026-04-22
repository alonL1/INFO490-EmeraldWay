import { SignupForm } from "@/components/auth/signup-form";
import { PageShell } from "@/components/layout/page-shell";
import { getViewerContext } from "@/lib/server/viewer";

export default async function SignupPage() {
  const viewer = await getViewerContext();

  return (
    <PageShell role={viewer.role}>
      <SignupForm />
    </PageShell>
  );
}
