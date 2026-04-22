import { cn } from "@/lib/utils/cn";

type StatusPillProps = {
  kind?: "priority" | "status";
  label: string;
  className?: string;
};

function toneFor(kind: "priority" | "status", label: string) {
  const normalized = label.toLowerCase();

  if (kind === "priority") {
    if (normalized.includes("critical")) return "critical";
    if (normalized.includes("high")) return "high";
    if (normalized.includes("medium")) return "medium";
    if (normalized.includes("low")) return "low";
  }

  if (normalized.includes("received")) return "received";
  if (normalized.includes("open")) return "open";
  if (normalized.includes("pending")) return "pending";
  if (normalized.includes("not received")) return "attention";

  return "neutral";
}

export function StatusPill({
  kind = "status",
  label,
  className,
}: StatusPillProps) {
  const tone = toneFor(kind, label);

  return (
    <span className={cn("status-pill", `status-pill--${tone}`, className)}>
      {label}
    </span>
  );
}
