"use client";

import Link from "next/link";
import type { NavKey, NavVariant } from "@/lib/types/nav";
import { navItemsByVariant } from "@/lib/constants/nav";
import { cn } from "@/lib/utils/cn";

type RoleNavProps = {
  activeKey?: NavKey;
  className?: string;
  onNavigate?: () => void;
  variant: NavVariant;
};

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10.5V20h13V10.5" />
      <path d="M9.5 20v-5.5h5V20" />
    </svg>
  );
}

function EnvelopeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m5 7 7 6 7-6" />
    </svg>
  );
}

function ProfileIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="3.25" />
      <path d="M5 20c0-4 2.9-6 7-6s7 2 7 6" />
      <rect x="4" y="3.5" width="16" height="17" rx="3" />
    </svg>
  );
}

function WishlistIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 5.5h12" />
      <path d="M8 5.5V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1.5" />
      <path d="M5 5.5h14l-1.2 13.2A2 2 0 0 1 15.8 20.5H8.2a2 2 0 0 1-1.99-1.8z" />
      <path d="M10 10.5v5" />
      <path d="M14 10.5v5" />
    </svg>
  );
}

function DonationIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 21s-6.5-4.35-8.8-8A4.88 4.88 0 0 1 4.4 6.4 4.8 4.8 0 0 1 12 7.8a4.8 4.8 0 0 1 7.6-1.4A4.88 4.88 0 0 1 20.8 13C18.5 16.65 12 21 12 21Z" />
    </svg>
  );
}

function iconFor(key: NavKey) {
  switch (key) {
    case "home":
      return HomeIcon;
    case "wishlist":
      return WishlistIcon;
    case "donations":
      return DonationIcon;
    case "profile":
      return ProfileIcon;
    case "messages":
      return EnvelopeIcon;
    default:
      return HomeIcon;
  }
}

export function RoleNav({ activeKey, className, onNavigate, variant }: RoleNavProps) {
  const items = navItemsByVariant[variant];

  return (
    <nav
      aria-label={`${variant} primary navigation`}
      data-variant={variant}
      className={cn("site-nav", className)}
    >
      {items.map((item) => {
        const Icon = iconFor(item.key);
        const isActive = item.key === activeKey;

        return (
          <Link
            key={item.key}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            onClick={onNavigate}
            className={cn(
              "site-nav__link",
              isActive && "site-nav__link--active",
            )}
          >
            <Icon className="site-nav__icon" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
