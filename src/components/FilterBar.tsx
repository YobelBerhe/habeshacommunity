import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, Grid, Map, SlidersHorizontal } from "lucide-react";
import { CATEGORIES, JOB_SUBCATEGORIES } from "@/data/categories";
import { SearchFilters } from "@/types";

interface FilterBarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  viewMode: "grid" | "map";
  onViewModeChange: (mode: "grid" | "map") => void;
  resultsCount: number;
}

const FilterBar = ({ 
  filters, 
  onFiltersChange, 
  viewMode, 
  onViewModeChange, 
  resultsCount 
}: FilterBarProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== "" && value !== null
  );

  const jobSubcategories = JOB_SUBCATEGORIES.filter(sub => 
    filters.category === "jobs"
  );

  return (
    <div className="sticky top-[73px] z-40 bg-gradient-card/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3">
        {/* Main Filter Row */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Category */}
          <Select 
            value={filters.category || ""} 
            onValueChange={(value) => handleFilterChange("category", value || undefined)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All categories</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Job Subcategory (only show if jobs category selected) */}
          {filters.category === "jobs" && (
            <Select 
              value={filters.jobSubcategory || ""} 
              onValueChange={(value) => handleFilterChange("jobSubcategory", value || undefined)}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder="All job types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All job types</SelectItem>
                {jobSubcategories.map((sub) => (
                  <SelectItem key={sub.id} value={sub.id}>
                    {sub.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Input
              placeholder="Search listings..."
              value={filters.query || ""}
              onChange={(e) => handleFilterChange("query", e.target.value || undefined)}
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>

          {/* Advanced Filters Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={showAdvanced ? "bg-primary/10" : ""}
          >
            <SlidersHorizontal className="w-4 h-4 mr-1" />
            Filters
          </Button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}

          {/* View Mode & Results */}
          <div className="flex items-center gap-2 ml-auto">
            <Badge variant="secondary" className="hidden sm:flex">
              {resultsCount} results
            </Badge>
            
            <div className="flex bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange("grid")}
                className="h-8 px-3"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "map" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange("map")}
                className="h-8 px-3"
              >
                <Map className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Advanced Filters Row */}
        {showAdvanced && (
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/50">
            <Input
              type="number"
              placeholder="Min price"
              value={filters.minPrice || ""}
              onChange={(e) => handleFilterChange("minPrice", e.target.value ? Number(e.target.value) : undefined)}
              className="w-32"
            />
            <Input
              type="number"
              placeholder="Max price"
              value={filters.maxPrice || ""}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
              className="w-32"
            />
            <Input
              placeholder="Tags (comma separated)"
              value={filters.tags?.join(", ") || ""}
              onChange={(e) => {
                const tags = e.target.value.split(",").map(tag => tag.trim()).filter(Boolean);
                handleFilterChange("tags", tags.length > 0 ? tags : undefined);
              }}
              className="flex-1"
            />
          </div>
        )}

        {/* Active Filter Tags */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {filters.category && (
              <Badge variant="outline" className="gap-1">
                {CATEGORIES.find(c => c.id === filters.category)?.name}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-destructive" 
                  onClick={() => handleFilterChange("category", undefined)}
                />
              </Badge>
            )}
            {filters.jobSubcategory && (
              <Badge variant="outline" className="gap-1">
                {JOB_SUBCATEGORIES.find(s => s.id === filters.jobSubcategory)?.name}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-destructive" 
                  onClick={() => handleFilterChange("jobSubcategory", undefined)}
                />
              </Badge>
            )}
            {filters.query && (
              <Badge variant="outline" className="gap-1">
                "{filters.query}"
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-destructive" 
                  onClick={() => handleFilterChange("query", undefined)}
                />
              </Badge>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <Badge variant="outline" className="gap-1">
                ${filters.minPrice || 0} - ${filters.maxPrice || "∞"}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-destructive" 
                  onClick={() => {
                    handleFilterChange("minPrice", undefined);
                    handleFilterChange("maxPrice", undefined);
                  }}
                />
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;