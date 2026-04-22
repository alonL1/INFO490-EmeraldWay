"use client";

import { useState } from "react";
import { CompassMark } from "@/components/brand/compass-mark";
import { Wordmark } from "@/components/brand/wordmark";
import { RoleNav } from "@/components/navigation/role-nav";
import { AuthButton } from "@/components/auth/auth-button";
import type { AppRole } from "@/lib/types/app-role";
import type { NavKey } from "@/lib/types/nav";
import { cn } from "@/lib/utils/cn";

type SiteHeaderProps = {
  activeKey?: NavKey;
  role: AppRole;
};

export function SiteHeader({ activeKey, role }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-header__bar">
          <div className="site-header__brand">
            <CompassMark priority />
            <Wordmark />
          </div>
          <button
            type="button"
            className="site-header__menu"
            onClick={() => setIsMenuOpen((current) => !current)}
            aria-expanded={isMenuOpen}
            aria-controls="site-header-nav"
            aria-label="Toggle navigation"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
        <div
          id="site-header-nav"
          className={cn(
            "site-header__nav-wrap",
            isMenuOpen && "site-header__nav-wrap--open",
          )}
        >
          <RoleNav
            variant={role}
            activeKey={activeKey}
            onNavigate={() => setIsMenuOpen(false)}
          />
          <div className="site-header__controls">
            <p className="site-header__role-label">
              {role === "organization" ? "Organization" : "Donor"}
            </p>
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
}
