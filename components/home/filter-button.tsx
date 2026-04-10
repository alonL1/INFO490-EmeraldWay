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
      className={cn(
        "flex min-h-[54px] w-full items-center justify-center rounded-2xl border border-border-accent/70 bg-white px-4 py-3 text-center font-ui text-base font-extrabold capitalize leading-tight text-brand-teal transition hover:bg-brand-teal hover:text-white sm:min-h-filter-h sm:text-lg",
        className,
      )}
    >
      {filter.label}
    </button>
  );
}
