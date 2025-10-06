import { useState, useEffect } from 'react';

export function useResponsiveColumns() {
  const [columns, setColumns] = useState(getColumns());

  function getColumns() {
    const width = window.innerWidth;
    if (width < 768) return 1;
    if (width < 1024) return 2;
    return 3;
  }

  useEffect(() => {
    function handleResize() {
      setColumns(getColumns());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return columns;
}
