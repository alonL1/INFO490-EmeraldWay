import type { AppRole } from "@/lib/types/app-role";

export type NavVariant = AppRole;

export type NavKey = "home" | "profile" | "messages" | "wishlist" | "donations";

export type NavItem = {
  href: string;
  key: NavKey;
  label: string;
};
