import Link from "next/link";
import { ensureThread } from "@/app/messages/actions";

export function MessageDonorButton({
  donationId,
  threadId,
  redirectTo,
}: {
  donationId: string;
  threadId: string | null;
  redirectTo?: string;
}) {
  if (threadId) {
    return (
      <Link
        href={`/messages?thread=${threadId}`}
        className="inline-flex items-center justify-center rounded-full border border-border-accent px-5 py-2 font-ui text-sm font-bold text-brand-teal"
      >
        Open thread
      </Link>
    );
  }
  return (
    <form action={ensureThread}>
      <input type="hidden" name="donationId" value={donationId} />
      {redirectTo ? (
        <input type="hidden" name="redirectTo" value={redirectTo} />
      ) : null}
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-full bg-brand-forest px-5 py-2 font-ui text-sm font-bold text-brand-cream"
      >
        Message donor
      </button>
    </form>
  );
}
