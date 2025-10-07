import { useEffect, useRef } from 'react';
import { draftStorage } from '@/utils/draftStorage';
import { useDebounce } from './useDebounce';

export function useAutoSaveDraft(
  type: 'message' | 'listing' | 'review',
  content: any,
  draftId?: string,
  delay: number = 2000
) {
  const debouncedContent = useDebounce(content, delay);
  const savedIdRef = useRef<string | null>(draftId || null);

  useEffect(() => {
    if (debouncedContent && Object.keys(debouncedContent).length > 0) {
      const id = draftStorage.saveDraft(type, debouncedContent, savedIdRef.current || undefined);
      savedIdRef.current = id;
      console.log('[Draft] Auto-saved:', type, id);
    }
  }, [debouncedContent, type]);

  const deleteDraft = () => {
    if (savedIdRef.current) {
      draftStorage.deleteDraft(savedIdRef.current);
      savedIdRef.current = null;
    }
  };

  return {
    draftId: savedIdRef.current,
    deleteDraft,
  };
}
