import SearchWithHints from "@/components/SearchWithHints";
import { SearchFilters } from "@/types";

export default function FilterBar({
  filters, onFiltersChange, viewMode, onViewModeChange, resultsCount
}: {
  filters: SearchFilters;
  onFiltersChange: (f: SearchFilters) => void;
  viewMode: "grid" | "map" | undefined;
  onViewModeChange: (m: "grid" | "map") => void;
  resultsCount: number;
}) {
  return (
    <div className="container mx-auto px-4 pt-4">
      <div className="flex flex-col md:flex-row gap-3 items-stretch">
        <select
          className="field md:max-w-[220px]"
          value={filters.category || ""}
          onChange={e => onFiltersChange({ ...filters, category: e.target.value || undefined })}
        >
          <option value="">All categories</option>
          <option value="housing">Housing & Rentals</option>
          <option value="jobs">Jobs</option>
          <option value="forsale">For Sale</option>
          <option value="services">Services</option>
          <option value="community">Community</option>
        </select>

        <SearchWithHints
          value={filters.query || ""}
          category={filters.category}
          onChange={(v)=> onFiltersChange({ ...filters, query: v || undefined })}
        />

        <div className="flex items-center gap-2">
          <button
            className={`btn ${viewMode!=="map" ? "btn-primary" : ""}`}
            onClick={()=>onViewModeChange("grid")}
          >Grid</button>
          <button
            className={`btn ${viewMode==="map" ? "btn-primary" : ""}`}
            onClick={()=>onViewModeChange("map")}
          >Map</button>
          <span className="text-sm text-muted-foreground ml-2">{resultsCount} results</span>
        </div>
      </div>
    </div>
  );
}

