export type AppRole = "donor" | "organization";

export function normalizeAppRole(value: unknown): AppRole {
  return value === "organization" ? "organization" : "donor";
}

export function getRoleLabel(role: AppRole) {
  return role === "organization" ? "Organization" : "Donor";
}
