import { PageShell } from "@/components/layout/page-shell"
import { SignupForm } from "@/components/auth/signup-form"

export default function SignupPage() {
  return (
    <PageShell activeKey="profile" variant="nonprofit">
      <SignupForm />
    </PageShell>
  )
}
