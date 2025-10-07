import { useMemo } from 'react';
import { sanitizeHTML } from '@/utils/sanitize';

export function useSafeHTML(html: string) {
  return useMemo(() => sanitizeHTML(html), [html]);
}
