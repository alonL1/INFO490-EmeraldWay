import type { ReactNode } from "react";
import { SiteHeader } from "@/components/navigation/site-header";
import type { NavKey, NavVariant } from "@/lib/types/nav";
import { cn } from "@/lib/utils/cn";

type PageShellProps = {
  activeKey?: NavKey;
  children: ReactNode;
  className?: string;
  variant: NavVariant;
};

export function PageShell({
  activeKey,
  children,
  className,
  variant,
}: PageShellProps) {
  return (
    <div className="min-h-screen bg-surface-canvas">
      <SiteHeader activeKey={activeKey} variant={variant} />
      <main
        className={cn(
          "mx-auto w-full max-w-layout-max px-4 pb-12 pt-6 sm:px-6 sm:pt-8 lg:px-page-gutter lg:pb-16",
          className,
        )}
      >
        {children}
      </main>
    </div>
  );
}
