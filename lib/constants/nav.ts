import type { NavItem, NavVariant } from "@/lib/types/nav";

export const navItemsByVariant: Record<NavVariant, readonly NavItem[]> = {
  nonprofit: [
    { key: "home", href: "/", label: "Home" },
    { key: "profile", href: "/profile", label: "Profile" },
    { key: "messages", href: "/messages", label: "Messages" },
  ],
  donor: [
    { key: "home", href: "/", label: "Home" },
    { key: "profile", href: "/profile", label: "Profile" },
    { key: "messages", href: "/messages", label: "Messages" },
  ],
};

