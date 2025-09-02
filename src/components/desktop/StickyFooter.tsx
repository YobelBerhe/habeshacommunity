import { useAuth } from '@/store/auth';
import { Plus } from 'lucide-react';

export function StickyFooter() {
  const { user, openAuth, openPost } = useAuth();

  const handlePostClick = () => {
    if (user) {
      openPost();
    } else {
      openAuth();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-background border-t p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          © 2025 HabeshaCommunity — Connecting the global Habesha community • Rentals • Jobs • Services • Community
        </div>
        
        <button
          onClick={handlePostClick}
          className="flex items-center gap-2 px-6 py-3 text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Post your first listing
        </button>
      </div>
    </div>
  );
}