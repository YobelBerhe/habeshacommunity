import { motion, AnimatePresence } from 'framer-motion';
import { Undo2, Redo2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UndoBannerProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onDismiss: () => void;
}

export function UndoBanner({ canUndo, canRedo, onUndo, onRedo, onDismiss }: UndoBannerProps) {
  const isVisible = canUndo || canRedo;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="bg-card border border-border rounded-full shadow-lg px-4 py-2 flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={onUndo}
              disabled={!canUndo}
              className="rounded-full"
            >
              <Undo2 className="w-4 h-4 mr-1" />
              Undo
            </Button>
            
            <div className="w-px h-6 bg-border" />
            
            <Button
              size="sm"
              variant="ghost"
              onClick={onRedo}
              disabled={!canRedo}
              className="rounded-full"
            >
              <Redo2 className="w-4 h-4 mr-1" />
              Redo
            </Button>

            <button
              onClick={onDismiss}
              className="ml-2 p-1 hover:bg-accent rounded-full"
              aria-label="Dismiss undo banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
