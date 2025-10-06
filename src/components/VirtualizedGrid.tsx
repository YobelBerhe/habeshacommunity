import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

interface VirtualizedGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  estimateSize?: number;
  columns?: number;
  gap?: number;
  className?: string;
}

export function VirtualizedGrid<T>({
  items,
  renderItem,
  estimateSize = 400,
  columns = 3,
  gap = 24,
  className = '',
}: VirtualizedGridProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  // Group items into rows
  const rows = [];
  for (let i = 0; i < items.length; i += columns) {
    rows.push(items.slice(i, i + columns));
  }

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan: 2,
  });

  return (
    <div
      ref={parentRef}
      className={`overflow-auto virtual-scroll-container ${className}`}
      style={{ height: '100%' }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const rowItems = rows[virtualRow.index];
          return (
            <div
              key={virtualRow.key}
              className="virtual-item"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div
                className="grid"
                style={{
                  gridTemplateColumns: `repeat(${columns}, 1fr)`,
                  gap: `${gap}px`,
                }}
              >
                {rowItems.map((item, idx) => (
                  <div key={virtualRow.index * columns + idx}>
                    {renderItem(item, virtualRow.index * columns + idx)}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
