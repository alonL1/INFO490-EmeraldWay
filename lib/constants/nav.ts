import type { NavItem, NavVariant } from "@/lib/types/nav";

export const navItemsByVariant: Record<NavVariant, readonly NavItem[]> = {
  organization: [
    { key: "home", href: "/", label: "Home" },
    { key: "wishlist", href: "/wishlist", label: "Wishlist" },
    { key: "messages", href: "/messages", label: "Messages" },
    { key: "profile", href: "/profile", label: "Profile" },
  ],
  donor: [
    { key: "home", href: "/", label: "Home" },
    { key: "donations", href: "/donations", label: "Donations" },
    { key: "messages", href: "/messages", label: "Messages" },
    { key: "profile", href: "/profile", label: "Profile" },
  ],
};
