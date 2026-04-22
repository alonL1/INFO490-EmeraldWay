import { cn } from "@/lib/utils/cn";

type LoadingSpinnerProps = {
  className?: string;
  label?: string;
};

export function LoadingSpinner({
  className,
  label = "Loading",
}: LoadingSpinnerProps) {
  return (
    <span
      role="status"
      aria-live="polite"
      className={cn("inline-flex items-center justify-center", className)}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-4 w-4 animate-spin"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          className="stroke-current opacity-20"
          strokeWidth="3"
        />
        <path
          d="M21 12a9 9 0 0 0-9-9"
          className="stroke-current"
          strokeLinecap="round"
          strokeWidth="3"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}
