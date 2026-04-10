export type NavVariant = "nonprofit" | "donor";

export type NavKey = "home" | "profile" | "messages";

export type NavItem = {
  href: string;
  key: NavKey;
  label: string;
};

