import { useEffect, useRef } from 'react';

interface InfiniteScrollProps {
  children: React.ReactNode;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  threshold?: number;
}

export function InfiniteScroll({
  children,
  onLoadMore,
  hasMore,
  isLoading,
  threshold = 300,
}: InfiniteScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    function handleScroll() {
      if (!element || isLoading || !hasMore) return;

      const { scrollTop, scrollHeight, clientHeight } = element;
      if (scrollHeight - scrollTop - clientHeight < threshold) {
        onLoadMore();
      }
    }

    element.addEventListener('scroll', handleScroll);
    return () => element.removeEventListener('scroll', handleScroll);
  }, [isLoading, hasMore, threshold, onLoadMore]);

  return (
    <div ref={scrollRef} className="overflow-auto h-full">
      {children}
      {isLoading && (
        <div className="text-center py-4">
          <div className="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
