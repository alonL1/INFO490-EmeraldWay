import type { FilterDefinition } from "@/lib/types/filters";
import { cn } from "@/lib/utils/cn";

type FilterButtonProps = {
  filter: FilterDefinition;
  className?: string;
};

export function FilterButton({ filter, className }: FilterButtonProps) {
  return (
    <button
      type="button"
      className={cn("filter-button", className)}
    >
      {filter.label}
    </button>
  );
}
