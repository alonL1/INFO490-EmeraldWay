import Link from "next/link";
import { StatusPill } from "@/components/shared/status-pill";
import type { ItemSummary } from "@/lib/types/item";

type OrganizationDashboardProps = {
  communityCount: number;
  isAuthenticated: boolean;
  items: ItemSummary[];
};

export function OrganizationDashboard({
  communityCount,
  isAuthenticated,
  items,
}: OrganizationDashboardProps) {
  const urgentCount = items.filter((item) =>
    ["high", "critical"].includes(item.priority.toLowerCase()),
  ).length;
  const pendingCount = items.filter((item) =>
    ["pending", "not received", "open"].includes(item.status.toLowerCase()),
  ).length;

  return (
    <section className="dashboard-shell">
      <div className="dashboard-hero">
        <div className="dashboard-hero__copy">
          <p className="section-eyebrow">Organization Workspace</p>
          <h1 className="section-heading">Keep requests visible and donor coordination moving.</h1>
          <p className="section-copy">
            Review open items, jump into conversations, and publish new needs without leaving the
            main workspace.
          </p>
        </div>
        <div className="dashboard-hero__actions">
          {isAuthenticated ? (
            <>
              <Link
                href="/wishlist/new"
                className="rounded-full bg-brand-forest px-5 py-3 font-ui text-sm font-bold text-brand-cream"
              >
                New Request
              </Link>
              <Link
                href="/wishlist"
                className="rounded-full border border-border-accent px-5 py-3 font-ui text-sm font-bold text-brand-teal"
              >
                Open Wishlist
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full bg-brand-forest px-5 py-3 font-ui text-sm font-bold text-brand-cream"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="rounded-full border border-border-accent px-5 py-3 font-ui text-sm font-bold text-brand-teal"
              >
                Create Account
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="dashboard-stats">
        <article className="dashboard-stat">
          <p>Open Requests</p>
          <strong>{isAuthenticated ? items.length : "Sign in"}</strong>
        </article>
        <article className="dashboard-stat">
          <p>Urgent Needs</p>
          <strong>{isAuthenticated ? urgentCount : communityCount}</strong>
        </article>
        <article className="dashboard-stat">
          <p>Needs Follow-up</p>
          <strong>{isAuthenticated ? pendingCount : "3"}</strong>
        </article>
        <article className="dashboard-stat">
          <p>Community Listings</p>
          <strong>{communityCount}</strong>
        </article>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-card">
          <div>
            <p className="section-eyebrow">
              {isAuthenticated ? "Recent Requests" : "Before You Manage Requests"}
            </p>
            <h2 className="section-heading">
              {isAuthenticated ? "Your latest listings" : "Organization accounts use a separate workspace"}
            </h2>
            <p className="section-copy">
              {isAuthenticated
                ? "Use the wishlist detail page for edits and intake updates."
                : "Switch to the organization experience and sign in to manage requests, messages, and intake status."}
            </p>
          </div>

          {isAuthenticated && items.length > 0 ? (
            <div className="dashboard-card__list">
              {items.slice(0, 4).map((item) => (
                <article key={item.id} className="dashboard-card__item">
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.location || "Location to be confirmed"}</p>
                  </div>
                  <div className="dashboard-card__meta">
                    <StatusPill kind="priority" label={item.priority} />
                    <StatusPill kind="status" label={item.status} />
                  </div>
                </article>
              ))}
            </div>
          ) : isAuthenticated ? (
            <div className="empty-state">
              <p>You do not have any requests yet.</p>
              <Link
                href="/wishlist/new"
                className="rounded-full bg-brand-forest px-5 py-3 font-ui text-sm font-bold text-brand-cream"
              >
                Add your first request
              </Link>
            </div>
          ) : (
            <div className="empty-state">
              <p>Once signed in, this panel becomes your request queue.</p>
            </div>
          )}
        </section>

        <section className="dashboard-card">
          <div>
            <p className="section-eyebrow">Quick Actions</p>
            <h2 className="section-heading">Stay on top of coordination.</h2>
            <p className="section-copy">
              Keep donor conversations active and move items through pending and received states.
            </p>
          </div>
          <div className="dashboard-card__list">
            <article className="dashboard-card__item">
              <div>
                <h3>Wishlist Management</h3>
                <p>Review every open request in one list.</p>
              </div>
              <Link href="/wishlist" className="dashboard-link">
                Open Wishlist
              </Link>
            </article>
            <article className="dashboard-card__item">
              <div>
                <h3>Donor Messages</h3>
                <p>Respond to handoff questions and confirm timing.</p>
              </div>
              <Link href="/messages" className="dashboard-link">
                Open Messages
              </Link>
            </article>
            <article className="dashboard-card__item">
              <div>
                <h3>Profile Details</h3>
                <p>Keep your organization description and location current.</p>
              </div>
              <Link href="/profile" className="dashboard-link">
                Open Profile
              </Link>
            </article>
          </div>
        </section>
      </div>
    </section>
  );
}
