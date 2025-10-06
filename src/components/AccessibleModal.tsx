import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { ReactNode } from 'react';

interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
}

/**
 * Fully accessible modal with focus trap and ARIA attributes
 */
export function AccessibleModal({
  isOpen,
  onClose,
  title,
  description,
  children,
}: AccessibleModalProps) {
  const trapRef = useFocusTrap(isOpen);
  useEscapeKey(onClose, isOpen);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        ref={trapRef as any}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={description ? "modal-description" : undefined}
      >
        <DialogHeader>
          <DialogTitle id="modal-title">{title}</DialogTitle>
          {description && (
            <p id="modal-description" className="sr-only">
              {description}
            </p>
          )}
        </DialogHeader>
        
        {children}
      </DialogContent>
    </Dialog>
  );
}
