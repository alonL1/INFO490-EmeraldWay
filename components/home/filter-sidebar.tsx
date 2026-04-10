import { filterDefinitions } from "@/lib/constants/filters";
import { FilterButton } from "@/components/home/filter-button";

export function FilterSidebar() {
  return (
    <aside className="filter-sidebar">
      <div className="filter-panel">
        <div className="filter-panel__heading">
          <p className="filter-panel__eyebrow">
            Browse Requests
          </p>
          <h2 className="filter-panel__title">
            Filters
          </h2>
        </div>
        <div className="filter-panel__grid">
          {filterDefinitions.map((filter) => (
            <FilterButton key={filter.key} filter={filter} />
          ))}
        </div>
      </div>
    </aside>
  );
}
