import { filterDefinitions } from "@/lib/constants/filters";
import { FilterButton } from "@/components/home/filter-button";

export function FilterSidebar() {
  return (
    <aside className="w-full lg:sticky lg:top-6 lg:w-filter-w">
      <div className="rounded-[28px] border border-brand-forest/10 bg-white p-5 shadow-panel sm:p-6">
        <div className="mb-5">
          <p className="font-body text-xs font-medium uppercase tracking-[0.24em] text-brand-teal/75">
            Browse Requests
          </p>
          <h2 className="mt-2 font-ui text-3xl font-black leading-none text-brand-teal sm:text-[2.6rem]">
            Filters
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {filterDefinitions.map((filter) => (
            <FilterButton key={filter.key} filter={filter} />
          ))}
        </div>
      </div>
    </aside>
  );
}
