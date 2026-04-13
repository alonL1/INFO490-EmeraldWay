import { CompassMark } from "@/components/brand/compass-mark";
import { Wordmark } from "@/components/brand/wordmark";
import { RoleNav } from "@/components/navigation/role-nav";
import { AuthButton } from "@/components/auth/auth-button";
import type { NavKey, NavVariant } from "@/lib/types/nav";

type SiteHeaderProps = {
  activeKey?: NavKey;
  variant: NavVariant;
};

export function SiteHeader({ activeKey, variant }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-header__brand">
          <CompassMark priority />
          <Wordmark />
        </div>
        <RoleNav variant={variant} activeKey={activeKey} />
        <AuthButton />
      </div>
    </header>
  );
}
