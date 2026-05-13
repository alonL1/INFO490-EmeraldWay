import type { FilterDefinition } from "@/lib/types/filters";
import { cn } from "@/lib/utils/cn";

type FilterButtonProps = {
  filter: FilterDefinition;
  className?: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  valueLabel?: string;
};

export function FilterButton({
  filter,
  className,
  active,
  disabled,
  onClick,
  valueLabel,
}: FilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={cn(
        "filter-button",
        active && "bg-brand-teal text-white",
        disabled && "cursor-not-allowed opacity-50 hover:bg-white hover:text-brand-teal",
        className,
      )}
    >
      <span className="flex flex-col items-center leading-tight">
        <span>{filter.label}</span>
        {valueLabel && (
          <span className="mt-0.5 text-[0.65rem] font-medium uppercase tracking-[0.18em] opacity-80">
            {valueLabel}
          </span>
        )}
      </span>
    </button>
  );
}
