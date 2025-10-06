import { lazy, Suspense } from 'react';

const InteractiveListingMap = lazy(() => import('./InteractiveListingMap'));

export function LazyMap(props: any) {
  return (
    <Suspense fallback={
      <div className="w-full h-full bg-muted rounded-lg animate-pulse flex items-center justify-center">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    }>
      <InteractiveListingMap {...props} />
    </Suspense>
  );
}
