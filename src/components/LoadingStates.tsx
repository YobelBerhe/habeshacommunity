import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

// Page loader with spinner
export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
      </div>
    </div>
  );
}

// Card skeleton loader
export function CardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="h-48 bg-gradient-to-br from-muted via-muted/80 to-muted animate-pulse" />
      <CardHeader className="space-y-2">
        <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
        <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="h-3 w-full bg-muted rounded animate-pulse" />
        <div className="h-3 w-5/6 bg-muted rounded animate-pulse" />
      </CardContent>
      <CardFooter className="gap-2">
        <div className="h-9 flex-1 bg-muted rounded animate-pulse" />
        <div className="h-9 flex-1 bg-muted rounded animate-pulse" />
      </CardFooter>
    </Card>
  );
}

// List item skeleton
export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg">
      <div className="w-12 h-12 bg-muted rounded-full animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/3 bg-muted rounded animate-pulse" />
        <div className="h-3 w-2/3 bg-muted rounded animate-pulse" />
      </div>
      <div className="w-20 h-8 bg-muted rounded animate-pulse" />
    </div>
  );
}

// Table row skeleton
export function TableRowSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-4 p-4 border-b">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-4 bg-muted rounded animate-pulse" />
      ))}
    </div>
  );
}

// Grid skeleton loader
export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

// List skeleton loader
export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <ListItemSkeleton key={i} />
      ))}
    </div>
  );
}
