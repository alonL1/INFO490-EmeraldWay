import Link from "next/link";
import type { NavKey, NavVariant } from "@/lib/types/nav";
import { navItemsByVariant } from "@/lib/constants/nav";
import { cn } from "@/lib/utils/cn";

type RoleNavProps = {
  activeKey?: NavKey;
  className?: string;
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

function iconFor(key: NavKey) {
  switch (key) {
    case "home":
      return HomeIcon;
    case "profile":
      return EnvelopeIcon;
    case "messages":
      return ProfileIcon;
    default:
      return HomeIcon;
  }
}

export function RoleNav({ activeKey, className, variant }: RoleNavProps) {
  const items = navItemsByVariant[variant];

  return (
    <nav
      aria-label={`${variant} primary navigation`}
      data-variant={variant}
      className={cn(
        "flex flex-wrap items-center gap-3 sm:gap-4 lg:gap-5",
        className,
      )}
    >
      {items.map((item) => {
        const Icon = iconFor(item.key);
        const isActive = item.key === activeKey;

        return (
          <Link
            key={item.key}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "group inline-flex items-center gap-2 rounded-full border border-transparent px-3 py-2 font-ui text-base font-bold capitalize text-brand-cream transition duration-200 hover:bg-white/10 hover:text-white sm:text-lg lg:px-4 lg:py-2.5 lg:text-xl",
              isActive && "bg-white/10 text-white",
            )}
          >
            <Icon className="h-4 w-4 shrink-0 sm:h-5 sm:w-5 lg:h-5 lg:w-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
