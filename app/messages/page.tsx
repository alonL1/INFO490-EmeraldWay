import { PageShell } from "@/components/layout/page-shell";

const threads = [
  {
    name: "Amanda",
    preview: "I can drop them off tonight at 5 PM!",
  },
  {
    name: "Raizel",
    preview: "Thank you!",
  },
  {
    name: "Helen",
    preview: "I'll be at Maple around 7 PM.",
  },
];

export default function MessagesPage() {
  return (
    <PageShell activeKey="messages" variant="nonprofit">
      <section className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="rounded-[28px] border border-brand-forest/10 bg-white p-5 shadow-panel">
          <h1 className="font-ui text-3xl font-black text-brand-teal">Messages</h1>
          <div className="mt-6 space-y-3">
            {threads.map((thread) => (
              <article
                key={thread.name}
                className="rounded-[22px] border border-brand-forest/10 px-4 py-4"
              >
                <h2 className="font-ui text-lg font-bold text-text-primary">
                  {thread.name}
                </h2>
                <p className="mt-1 font-body text-sm text-text-primary/70">
                  {thread.preview}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-brand-forest/10 bg-white p-6 shadow-panel">
          <div className="space-y-4">
            <div className="ml-auto max-w-[320px] rounded-[22px] bg-brand-forest px-4 py-3 font-body text-sm text-brand-cream">
              Any updates on when you can drop off those socks?
            </div>
            <div className="max-w-[320px] rounded-[22px] bg-brand-cream px-4 py-3 font-body text-sm text-text-primary">
              I can drop them off tonight at 5 PM.
            </div>
            <div className="ml-auto max-w-[320px] rounded-[22px] bg-brand-forest px-4 py-3 font-body text-sm text-brand-cream">
              Perfect, thank you so much.
            </div>
          </div>
          <div className="mt-6 rounded-full border border-border-accent px-4 py-3 font-body text-sm text-text-primary/45">
            Message composer placeholder
          </div>
        </div>
      </section>
    </PageShell>
  );
}

