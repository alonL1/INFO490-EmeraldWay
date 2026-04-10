import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type WordmarkProps = {
  className?: string;
};

export function Wordmark({ className }: WordmarkProps) {
  return (
    <Link
      href="/"
      aria-label="Community Compass home"
      className={cn(
        "font-display text-[clamp(1.75rem,3.8vw,3.3rem)] italic leading-none tracking-[-0.03em] text-brand-cream",
        className,
      )}
    >
      community compass
    </Link>
  );
}
