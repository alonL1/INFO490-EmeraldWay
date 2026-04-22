import { PageShell } from "@/components/layout/page-shell";
import { MessageHub } from "@/components/messages/message-hub";
import { requireViewer } from "@/lib/server/viewer";

export default async function MessagesPage() {
  const viewer = await requireViewer();

  return (
    <PageShell activeKey="messages" role={viewer.role}>
      <MessageHub role={viewer.role} />
    </PageShell>
  );
}
