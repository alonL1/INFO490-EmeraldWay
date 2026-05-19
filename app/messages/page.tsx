import { PageShell } from "@/components/layout/page-shell";
import { MessageHub } from "@/components/messages/message-hub";
import { requireViewer } from "@/lib/server/viewer";
import type { MessageRow, MessageThreadRow } from "@/lib/types/message";
import type { AppRole } from "@/lib/types/app-role";

// Shape of the raw row returned by the joined select.
type RawThread = {
  id: string;
  donation_id: string;
  donor_id: string;
  organization_id: string;
  donor_unread: boolean;
  org_unread: boolean;
  created_at: string;
  donations: {
    status: string;
    donor_display_name: string;
    listings: { title: string } | null;
  };
  profiles: { org_name: string | null } | null;
};

type RawMessage = {
  id: string;
  thread_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  deleted_at: string | null;
};

function mapThreads(raw: RawThread[], role: AppRole): MessageThreadRow[] {
  return raw.map((t) => ({
    id: t.id,
    donationId: t.donation_id,
    donorId: t.donor_id,
    organizationId: t.organization_id,
    donorUnread: t.donor_unread,
    orgUnread: t.org_unread,
    createdAt: t.created_at,
    counterpartyName:
      role === "organization"
        ? t.donations.donor_display_name
        : (t.profiles?.org_name ?? "Organization"),
    listingTitle: t.donations.listings?.title ?? null,
    status: t.donations.status,
  }));
}

function mapMessage(row: RawMessage): MessageRow {
  return {
    id: row.id,
    threadId: row.thread_id,
    senderId: row.sender_id,
    body: row.body,
    createdAt: row.created_at,
    deletedAt: row.deleted_at,
  };
}

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ thread?: string }>;
}) {
  const viewer = await requireViewer();
  const { thread: initialThreadId } = await searchParams;

  const baseSelect = `
    id, donation_id, donor_id, organization_id, donor_unread, org_unread, created_at,
    donations!inner(status, donor_display_name, listings(title)),
    profiles(org_name)
  `;

  const { data: rawThreads } = await viewer.supabase
    .from("message_threads")
    .select(baseSelect)
    .order("updated_at", { ascending: false });

  let visibleRaw = (rawThreads ?? []) as unknown as RawThread[];

  if (viewer.role === "donor" && visibleRaw.length > 0) {
    const threadIds = visibleRaw.map((t) => t.id);
    const { data: orgMsgs } = await viewer.supabase
      .from("messages")
      .select("thread_id")
      .in("thread_id", threadIds)
      .neq("sender_id", viewer.user.id);
    const allowed = new Set((orgMsgs ?? []).map((m) => m.thread_id));
    visibleRaw = visibleRaw.filter((t) => allowed.has(t.id));
  }

  const threads = mapThreads(visibleRaw, viewer.role);

  const activeId =
    initialThreadId && threads.some((t) => t.id === initialThreadId)
      ? initialThreadId
      : (threads[0]?.id ?? null);

  let initialMessages: MessageRow[] = [];
  if (activeId) {
    const { data } = await viewer.supabase
      .from("messages")
      .select("id, thread_id, sender_id, body, created_at, deleted_at")
      .eq("thread_id", activeId)
      .order("created_at", { ascending: true });
    initialMessages = ((data ?? []) as unknown as RawMessage[]).map(mapMessage);
  }

  return (
    <PageShell activeKey="messages" role={viewer.role}>
      <MessageHub
        role={viewer.role}
        viewerId={viewer.user.id}
        threads={threads}
        initialActiveThreadId={activeId}
        initialMessages={initialMessages}
      />
    </PageShell>
  );
}
