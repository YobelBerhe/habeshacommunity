import { useAuth } from '@/store/auth';

export default function StickyPostCTA() {
  const { user, openAuth, openPost } = useAuth();

  const handlePostClick = () => {
    if (user) {
      openPost();
    } else {
      openAuth();
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t p-4">
      <button
        onClick={handlePostClick}
        className="w-full py-3 px-4 border border-primary text-primary bg-white hover:bg-primary/5 rounded-lg transition-colors font-medium"
      >
        + Post your first listing
      </button>
    </div>
  );
}