/**
 * Reading Plans List Component
 * Browse all reading plans with filters, search, and categories
 */

import { useState } from 'react';
import { PlanCard } from './PlanCard';
import type { ReadingPlan } from '@/types/spiritual';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

interface PlansListProps {
  plans: ReadingPlan[];
  isLoading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export function PlansList({ plans, isLoading = false, onLoadMore, hasMore = false }: PlansListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'shortest' | 'longest'>('popular');

  const allCategories = Array.from(new Set(plans.flatMap((p) => p.categories || [])));
  const allLanguages = Array.from(new Set(plans.flatMap((p) => p.languages || [])));

  const filteredPlans = plans
    .filter((plan) => {
      if (searchQuery && !plan.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (selectedCategory && !plan.categories?.includes(selectedCategory)) {
        return false;
      }
      if (selectedLanguage && !plan.languages?.includes(selectedLanguage)) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return a.popularity_rank - b.popularity_rank;
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'shortest':
          return a.days_count - b.days_count;
        case 'longest':
          return b.days_count - a.days_count;
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search reading plans..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">Filter:</span>
          
          {allCategories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
            >
              {category}
            </Badge>
          ))}

          {selectedCategory && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedCategory(null);
                setSelectedLanguage(null);
              }}
            >
              Clear filters
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
          {(['popular', 'newest', 'shortest', 'longest'] as const).map((sort) => (
            <Button
              key={sort}
              variant={sortBy === sort ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy(sort)}
            >
              {sort.charAt(0).toUpperCase() + sort.slice(1)}
            </Button>
          ))}
        </div>
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-muted rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredPlans.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No plans found. Try adjusting your filters.</p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>

          {hasMore && onLoadMore && (
            <div className="text-center">
              <Button onClick={onLoadMore} variant="outline" size="lg">
                Load More Plans
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
