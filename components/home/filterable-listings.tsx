"use client";

import { useMemo, useState } from "react";
import { FilterButton } from "@/components/home/filter-button";
import { ItemCard } from "@/components/home/item-card";
import { filterDefinitions } from "@/lib/constants/filters";
import type { FilterKey } from "@/lib/types/filters";
import type { ItemSummary } from "@/lib/types/item";

const PRIORITY_ORDER = ["Critical", "High", "Medium", "Low"];
const STATUS_ORDER = ["Pending", "Open", "Fulfilled", "Closed"];

type Filters = {
  search: string;
  priority: string | null;
  status: string | null;
  itemType: string | null;
};

const EMPTY_FILTERS: Filters = {
  search: "",
  priority: null,
  status: null,
  itemType: null,
};

type Props = {
  items: ItemSummary[];
};

export function FilterableListings({ items }: Props) {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [openPicker, setOpenPicker] = useState<FilterKey | null>(null);

  const priorityOptions = useMemo(
    () => orderedUnique(items.map((i) => i.priority), PRIORITY_ORDER),
    [items],
  );
  const statusOptions = useMemo(
    () => orderedUnique(items.map((i) => i.status), STATUS_ORDER),
    [items],
  );
  const itemTypeOptions = useMemo(
    () => orderedUnique(items.map((i) => i.itemType), []),
    [items],
  );

  const filtered = useMemo(() => {
    const query = filters.search.trim().toLowerCase();
    return items.filter((item) => {
      if (filters.priority && item.priority !== filters.priority) return false;
      if (filters.status && item.status !== filters.status) return false;
      if (filters.itemType && item.itemType !== filters.itemType) return false;
      if (query) {
        const haystack = `${item.title} ${item.organization} ${item.location}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [items, filters]);

  const activeCount =
    (filters.search ? 1 : 0) +
    (filters.priority ? 1 : 0) +
    (filters.status ? 1 : 0) +
    (filters.itemType ? 1 : 0);

  function togglePicker(key: FilterKey) {
    setOpenPicker((current) => (current === key ? null : key));
  }

  function applyValue(key: keyof Filters, value: string | null) {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setOpenPicker(null);
  }

  function valueLabelFor(key: FilterKey): string | undefined {
    if (key === "search" && filters.search) return `“${truncate(filters.search, 12)}”`;
    if (key === "priority" && filters.priority) return filters.priority;
    if (key === "status" && filters.status) return filters.status;
    if (key === "itemType" && filters.itemType) return truncate(filters.itemType, 14);
    return undefined;
  }

  function isActive(key: FilterKey): boolean {
    if (key === "all") return activeCount === 0;
    if (key === "search") return Boolean(filters.search);
    if (key === "priority") return Boolean(filters.priority);
    if (key === "status") return Boolean(filters.status);
    if (key === "itemType") return Boolean(filters.itemType);
    return false;
  }

  return (
    <section className="home-layout">
      <aside className="filter-sidebar">
        <div className="filter-panel">
          <div className="filter-panel__heading">
            <p className="filter-panel__eyebrow">Browse Requests</p>
            <h2 className="filter-panel__title">Filters</h2>
          </div>
          <div className="filter-panel__grid">
            {filterDefinitions.map((filter) => (
              <FilterButton
                key={filter.key}
                filter={filter}
                active={isActive(filter.key)}
                disabled={filter.key === "distance"}
                valueLabel={valueLabelFor(filter.key)}
                onClick={() => {
                  if (filter.key === "all") {
                    setFilters(EMPTY_FILTERS);
                    setOpenPicker(null);
                    return;
                  }
                  if (filter.key === "distance") return;
                  togglePicker(filter.key);
                }}
              />
            ))}
          </div>

          {openPicker === "search" && (
            <PickerShell title="Search">
              <input
                type="text"
                autoFocus
                value={filters.search}
                onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
                placeholder="Search by title, org, or location"
                className="w-full rounded-2xl border border-brand-teal/30 bg-white px-4 py-2 font-body text-sm focus:border-brand-teal focus:outline-none"
              />
              <div className="mt-3 flex justify-end gap-2">
                <PickerActionButton onClick={() => applyValue("search", "")}>
                  Clear
                </PickerActionButton>
                <PickerActionButton primary onClick={() => setOpenPicker(null)}>
                  Done
                </PickerActionButton>
              </div>
            </PickerShell>
          )}

          {openPicker === "priority" && (
            <OptionPicker
              title="Priority"
              options={priorityOptions}
              selected={filters.priority}
              onSelect={(v) => applyValue("priority", v)}
              onClear={() => applyValue("priority", null)}
            />
          )}

          {openPicker === "status" && (
            <OptionPicker
              title="Status"
              options={statusOptions}
              selected={filters.status}
              onSelect={(v) => applyValue("status", v)}
              onClear={() => applyValue("status", null)}
            />
          )}

          {openPicker === "itemType" && (
            <OptionPicker
              title="Item type"
              options={itemTypeOptions}
              selected={filters.itemType}
              onSelect={(v) => applyValue("itemType", v)}
              onClear={() => applyValue("itemType", null)}
            />
          )}
        </div>
      </aside>

      {filtered.length === 0 ? (
        <section className="empty-state rounded-[28px] border bg-white p-6 text-center font-body text-sm text-text-primary/70">
          <p>No listings match the current filters.</p>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={() => setFilters(EMPTY_FILTERS)}
              className="mt-3 font-ui text-xs font-extrabold uppercase tracking-[0.2em] text-brand-teal underline"
            >
              Clear filters
            </button>
          )}
        </section>
      ) : (
        <section className="item-grid">
          {filtered.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </section>
      )}
    </section>
  );
}

function OptionPicker({
  title,
  options,
  selected,
  onSelect,
  onClear,
}: {
  title: string;
  options: string[];
  selected: string | null;
  onSelect: (value: string) => void;
  onClear: () => void;
}) {
  return (
    <PickerShell title={title}>
      {options.length === 0 ? (
        <p className="font-body text-sm text-text-primary/60">No values available.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {options.map((opt) => {
            const isSelected = selected === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => onSelect(opt)}
                className={
                  "rounded-full border px-3 py-1 font-ui text-xs font-extrabold uppercase tracking-[0.16em] transition " +
                  (isSelected
                    ? "border-brand-teal bg-brand-teal text-white"
                    : "border-brand-teal/30 bg-white text-brand-teal hover:bg-brand-teal/10")
                }
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}
      {selected && (
        <div className="mt-3 flex justify-end">
          <PickerActionButton onClick={onClear}>Clear</PickerActionButton>
        </div>
      )}
    </PickerShell>
  );
}

function PickerShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-2xl border border-brand-teal/15 bg-brand-cream/40 p-4">
      <p className="mb-2 font-body text-xs font-medium uppercase tracking-[0.24em] text-brand-teal/75">
        {title}
      </p>
      {children}
    </div>
  );
}

function PickerActionButton({
  children,
  onClick,
  primary,
}: {
  children: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "rounded-full px-4 py-1 font-ui text-xs font-extrabold uppercase tracking-[0.16em] transition " +
        (primary
          ? "bg-brand-teal text-white hover:bg-brand-forest"
          : "border border-brand-teal/30 bg-white text-brand-teal hover:bg-brand-teal/10")
      }
    >
      {children}
    </button>
  );
}

function orderedUnique(values: string[], preferredOrder: string[]): string[] {
  const set = new Set(values.filter(Boolean));
  const ordered: string[] = [];
  for (const v of preferredOrder) {
    if (set.has(v)) {
      ordered.push(v);
      set.delete(v);
    }
  }
  return [...ordered, ...Array.from(set).sort()];
}

function truncate(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}
