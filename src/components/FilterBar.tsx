import type { FilterType } from "../utils/vaccine";

interface FilterBarProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const FILTERS: { key: FilterType; label: string }[] = [
  { key: "all", label: "\u5168\u90E8" },
  { key: "public", label: "\u516C\u8CBB" },
  { key: "self-paid", label: "\u81EA\u8CBB" },
  { key: "done", label: "\u5DF2\u5B8C\u6210" },
  { key: "upcoming", label: "\u5F85\u65BD\u6253" },
];

export function FilterBar({ currentFilter, onFilterChange }: FilterBarProps) {
  return (
    <div className="filter-bar">
      {FILTERS.map((f) => (
        <button
          key={f.key}
          className={`filter-btn${currentFilter === f.key ? " active" : ""}`}
          onClick={() => onFilterChange(f.key)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
