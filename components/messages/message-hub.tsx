"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  markThreadRead,
  reportMessage,
  sendMessage,
} from "@/app/messages/actions";
import type { MessageRow, MessageThreadRow } from "@/lib/types/message";
import type { AppRole } from "@/lib/types/app-role";

type MessageHubProps = {
  role: AppRole;
  viewerId: string;
  threads: MessageThreadRow[];
  initialActiveThreadId: string | null;
  initialMessages: MessageRow[];
};

// Convert a raw DB/realtime row (snake_case) into a MessageRow (camelCase).
function mapMessage(row: {
  id: string;
  thread_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  deleted_at: string | null;
}): MessageRow {
  return {
    id: row.id,
    threadId: row.thread_id,
    senderId: row.sender_id,
    body: row.body,
    createdAt: row.created_at,
    deletedAt: row.deleted_at,
  };
}

export function MessageHub({
  role,
  viewerId,
  threads: initialThreads,
  initialActiveThreadId,
  initialMessages,
}: MessageHubProps) {
  const supabase = useMemo(() => createClient(), []);

  const [threads, setThreads] = useState<MessageThreadRow[]>(initialThreads);
  const [activeId, setActiveId] = useState<string | null>(initialActiveThreadId);
  const [messagesByThread, setMessagesByThread] = useState<
    Record<string, MessageRow[]>
  >(initialActiveThreadId ? { [initialActiveThreadId]: initialMessages } : {});
  const [composerValue, setComposerValue] = useState("");
  const [isSending, startSending] = useTransition();
  const [pendingReportId, setPendingReportId] = useState<string | null>(null);

  // Refs for stale-closure protection in realtime callback.
  const activeIdRef = useRef(activeId);
  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  const messagesByThreadRef = useRef(messagesByThread);
  useEffect(() => {
    messagesByThreadRef.current = messagesByThread;
  }, [messagesByThread]);

  // Stable key representing the current set of thread ids.
  const threadIdsKey = threads
    .map((t) => t.id)
    .sort()
    .join(",");

  // ── Realtime subscription ─────────────────────────────────────────────────
  useEffect(() => {
    if (!threadIdsKey) return;
    const threadIds = threadIdsKey.split(",");

    const channel = supabase
      .channel(`messages-${viewerId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `thread_id=in.(${threadIds.join(",")})`,
        },
        (payload) => {
          const m = mapMessage(
            payload.new as {
              id: string;
              thread_id: string;
              sender_id: string;
              body: string;
              created_at: string;
              deleted_at: string | null;
            },
          );
          setMessagesByThread((prev) => ({
            ...prev,
            [m.threadId]: [...(prev[m.threadId] ?? []), m],
          }));
          // Only flip unread if the message is for a different thread than the
          // one currently open, and it wasn't sent by this user.
          if (
            m.threadId !== activeIdRef.current &&
            m.senderId !== viewerId
          ) {
            setThreads((prev) =>
              prev.map((t) =>
                t.id === m.threadId
                  ? {
                      ...t,
                      [role === "donor" ? "donorUnread" : "orgUnread"]: true,
                    }
                  : t,
              ),
            );
          }
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [supabase, viewerId, threadIdsKey, role]);

  // ── Active-thread sync: lazy-fetch + mark-read ────────────────────────────
  useEffect(() => {
    if (!activeId) return;

    // Lazy-fetch if not yet cached.
    if (!messagesByThreadRef.current[activeId]) {
      void (async () => {
        const { data } = await supabase
          .from("messages")
          .select("id, thread_id, sender_id, body, created_at, deleted_at")
          .eq("thread_id", activeId)
          .order("created_at", { ascending: true });
        setMessagesByThread((p) =>
          p[activeId] ? p : { ...p, [activeId]: (data ?? []).map(mapMessage) },
        );
      })();
    }

    // Mark read on the server (fire-and-forget).
    const fd = new FormData();
    fd.set("threadId", activeId);
    void markThreadRead(fd);

    // NOTE: The local unread dot for the active thread is suppressed at
    // render time (see `hasUnread` below) rather than via a synchronous
    // setState here, which would trigger the react-hooks/set-state-in-effect
    // lint rule and cascade an extra render.
  }, [activeId, supabase]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const activeThread = threads.find((t) => t.id === activeId) ?? null;
  const activeMessages = activeId ? (messagesByThread[activeId] ?? []) : [];

  // ── Composer submit ───────────────────────────────────────────────────────
  function handleComposerSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!activeId || !composerValue.trim()) return;
    const fd = new FormData(e.currentTarget);
    startSending(async () => {
      await sendMessage(fd);
      setComposerValue("");
    });
  }

  function handleComposerKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!activeId || !composerValue.trim() || isSending) return;
      const fd = new FormData();
      fd.set("threadId", activeId);
      fd.set("body", composerValue);
      startSending(async () => {
        await sendMessage(fd);
        setComposerValue("");
      });
    }
  }

  // ── Report helpers ────────────────────────────────────────────────────────
  function handleReportClick(
    e: React.MouseEvent<HTMLButtonElement>,
    messageId: string,
  ) {
    if (pendingReportId !== messageId) {
      e.preventDefault();
      setPendingReportId(messageId);
      setTimeout(() => {
        setPendingReportId((p) => (p === messageId ? null : p));
      }, 4000);
    }
    // If pendingReportId === messageId, allow the form to submit naturally.
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <section className="messages-shell">
      {/* ── Left column: thread list ── */}
      <div className="messages-thread-list">
        <div>
          <p className="section-eyebrow">
            {role === "organization"
              ? "Donor Coordination"
              : "Organization Conversations"}
          </p>
          <h1 className="section-heading">Messages</h1>
        </div>

        {threads.length === 0 ? (
          <p className="messages-empty">
            {role === "donor"
              ? "No conversations yet. Your matched organization will start the chat when they're ready."
              : 'No conversations yet. Open a donation and click "Message donor" to start.'}
          </p>
        ) : (
          <div className="messages-thread-list__stack">
            {threads.map((thread) => {
              const isActive = thread.id === activeId;
              // Suppress the unread dot for the currently-active thread: we
              // fire markThreadRead in the effect, so the stored boolean will
              // lag by one render. Deriving it here avoids a synchronous
              // setState inside an effect (react-hooks/set-state-in-effect).
              const hasUnread =
                !isActive &&
                (role === "donor" ? thread.donorUnread : thread.orgUnread);
              const cachedMessages = messagesByThread[thread.id];
              const lastMessage = cachedMessages
                ? cachedMessages[cachedMessages.length - 1]
                : null;
              const preview = lastMessage
                ? lastMessage.deletedAt
                  ? "This message was removed."
                  : lastMessage.body
                : "";

              return (
                <button
                  key={thread.id}
                  type="button"
                  className={`messages-thread messages-thread--button${isActive ? " messages-thread--active" : ""}`}
                  onClick={() => setActiveId(thread.id)}
                >
                  <div
                    className="messages-thread__avatar"
                    aria-hidden="true"
                  >
                    {thread.counterpartyName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="messages-thread__meta">
                    <div className="messages-thread__header">
                      <h2>{thread.counterpartyName}</h2>
                      {hasUnread ? (
                        <span className="messages-thread__dot" />
                      ) : null}
                    </div>
                    <p className="messages-thread__subtitle">
                      {thread.listingTitle ?? "Donation Request"}
                    </p>
                    {preview ? (
                      <p className="messages-thread__preview">{preview}</p>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Right column: conversation ── */}
      <div className="messages-conversation">
        {activeThread === null ? (
          <div className="messages-empty">
            Select a conversation to get started.
          </div>
        ) : (
          <>
            <div>
              <p className="section-eyebrow">Active Thread</p>
              <h2 className="section-heading">
                {activeThread.counterpartyName}
              </h2>
              <p className="section-copy">
                {activeThread.listingTitle ?? "Donation Request"}
              </p>
            </div>

            <div className="messages-conversation__stack">
              {activeMessages.map((m) => (
                <div key={m.id} className="message-bubble__row">
                  <div
                    className={`message-bubble message-bubble--${m.senderId === viewerId ? "sent" : "received"}`}
                  >
                    {m.deletedAt ? (
                      <em>This message was removed.</em>
                    ) : (
                      m.body
                    )}
                  </div>
                  {/* Two-tap report: first click sets pendingReportId, second submits */}
                  {!m.deletedAt && m.senderId !== viewerId ? (
                    <form
                      action={reportMessage}
                      onSubmit={() => setPendingReportId(null)}
                    >
                      <input type="hidden" name="messageId" value={m.id} />
                      <button
                        type="submit"
                        className="message-bubble__report"
                        onClick={(e) => handleReportClick(e, m.id)}
                      >
                        {pendingReportId === m.id
                          ? "Tap again to confirm"
                          : "Report"}
                      </button>
                    </form>
                  ) : null}
                </div>
              ))}
            </div>

            <form
              className="message-composer__form"
              onSubmit={handleComposerSubmit}
            >
              <input type="hidden" name="threadId" value={activeId ?? ""} />
              <textarea
                name="body"
                className="message-composer__input"
                rows={2}
                value={composerValue}
                onChange={(e) => setComposerValue(e.target.value)}
                onKeyDown={handleComposerKeyDown}
                disabled={isSending}
                placeholder={
                  role === "organization"
                    ? "Draft a donor follow-up"
                    : "Draft a note to the organization"
                }
              />
              <button
                type="submit"
                className="message-composer__submit"
                disabled={isSending || !composerValue.trim()}
              >
                Send
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
