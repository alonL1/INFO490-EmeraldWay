import type { ReactNode } from "react";
import { SiteHeader } from "@/components/navigation/site-header";
import type { AppRole } from "@/lib/types/app-role";
import type { NavKey } from "@/lib/types/nav";
import { cn } from "@/lib/utils/cn";

type PageShellProps = {
  activeKey?: NavKey;
  children: ReactNode;
  className?: string;
  role: AppRole;
};

export function PageShell({
  activeKey,
  children,
  className,
  role,
}: PageShellProps) {
  return (
    <div className="min-h-screen bg-surface-canvas">
      <SiteHeader activeKey={activeKey} role={role} />
      <main className={cn("page-shell", className)}>
        {children}
      </main>
    </div>
  );
}
