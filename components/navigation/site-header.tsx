import { CompassMark } from "@/components/brand/compass-mark";
import { Wordmark } from "@/components/brand/wordmark";
import { RoleNav } from "@/components/navigation/role-nav";
import type { NavKey, NavVariant } from "@/lib/types/nav";

type SiteHeaderProps = {
  activeKey?: NavKey;
  variant: NavVariant;
};

export function SiteHeader({ activeKey, variant }: SiteHeaderProps) {
  return (
    <header className="w-full bg-surface-header text-text-inverse shadow-[0_8px_24px_rgba(65,93,67,0.16)]">
      <div className="mx-auto flex max-w-layout-max flex-col gap-5 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-page-gutter lg:py-5">
        <div className="flex items-center gap-3 sm:gap-4">
          <CompassMark priority />
          <Wordmark />
        </div>
        <RoleNav variant={variant} activeKey={activeKey} className="justify-start lg:justify-end" />
      </div>
    </header>
  );
}
