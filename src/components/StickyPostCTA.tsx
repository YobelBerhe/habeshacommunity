import { useAuth } from '@/store/auth';
import { useLanguage } from '@/store/language';
import { t } from '@/lib/i18n';

export default function StickyPostCTA() {
  const { user, openAuth, openPost } = useAuth();
  const { language } = useLanguage();

  const handlePostClick = () => {
    if (user) {
      openPost();
    } else {
      openAuth();
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-background border-t p-4">
      <button
        onClick={handlePostClick}
        className="w-full py-3 px-4 border border-primary text-primary bg-background hover:bg-primary/5 rounded-lg transition-colors font-medium"
      >
        + {t(language, "post_listing")}
      </button>
    </div>
  );
}