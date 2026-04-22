import { donorThreads, organizationThreads } from "@/lib/mock/messages";
import type { AppRole } from "@/lib/types/app-role";

type MessageHubProps = {
  role: AppRole;
};

export function MessageHub({ role }: MessageHubProps) {
  const threads = role === "organization" ? organizationThreads : donorThreads;
  const activeThread = threads[0];

  return (
    <section className="messages-shell">
      <div className="messages-thread-list">
        <div>
          <p className="section-eyebrow">
            {role === "organization" ? "Donor Coordination" : "Organization Conversations"}
          </p>
          <h1 className="section-heading">Messages</h1>
        </div>
        <div className="messages-thread-list__stack">
          {threads.map((thread, index) => (
            <article
              key={thread.id}
              className={`messages-thread${index === 0 ? " messages-thread--active" : ""}`}
            >
              <div className="messages-thread__avatar" aria-hidden="true">
                {thread.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="messages-thread__meta">
                <div className="messages-thread__header">
                  <h2>{thread.name}</h2>
                  {thread.unread ? <span className="messages-thread__dot" /> : null}
                </div>
                <p className="messages-thread__subtitle">{thread.subtitle}</p>
                <p className="messages-thread__preview">{thread.preview}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="messages-conversation">
        <div>
          <p className="section-eyebrow">Active Thread</p>
          <h2 className="section-heading">{activeThread.name}</h2>
          <p className="section-copy">{activeThread.subtitle}</p>
        </div>

        <div className="messages-conversation__stack">
          {activeThread.messages.map((message) => (
            <div
              key={message.id}
              className={`message-bubble ${
                message.direction === "outgoing"
                  ? "message-bubble--sent"
                  : "message-bubble--received"
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>

        <div className="message-composer">
          <span>
            {role === "organization"
              ? "Draft a donor follow-up"
              : "Draft a note to the organization"}
          </span>
          <span aria-hidden="true">›</span>
        </div>
      </div>
    </section>
  );
}
