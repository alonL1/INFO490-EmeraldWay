import { LoginForm } from "@/components/auth/login-form";
import { PageShell } from "@/components/layout/page-shell";
import { getViewerContext } from "@/lib/server/viewer";

export default async function LoginPage() {
  const viewer = await getViewerContext();

  return (
    <PageShell role={viewer.role}>
      <LoginForm />
    </PageShell>
  );
}
