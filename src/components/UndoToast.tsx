import { toast } from 'sonner';
import { Undo2 } from 'lucide-react';

interface UndoToastOptions {
  message: string;
  onUndo: () => void | Promise<void>;
  duration?: number;
}

export function showUndoToast({ message, onUndo, duration = 5000 }: UndoToastOptions) {
  toast.success(message, {
    action: {
      label: (
        <div className="flex items-center gap-1.5">
          <Undo2 className="w-3.5 h-3.5" />
          Undo
        </div>
      ),
      onClick: async () => {
        try {
          await onUndo();
          toast.success('Undone successfully');
        } catch (error) {
          toast.error('Failed to undo');
        }
      },
    },
    duration,
    closeButton: true,
  });
}
