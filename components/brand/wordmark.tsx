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
        "min-w-0 truncate font-display text-[clamp(1.4rem,3.6vw,3rem)] italic leading-none tracking-[-0.03em] text-brand-cream",
        className,
      )}
    >
      community compass
    </Link>
  );
}
