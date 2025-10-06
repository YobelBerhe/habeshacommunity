import CitySearch from "@/components/CitySearch";
import ThemeToggle from "@/components/ThemeToggle";
import AuthButtons from "@/components/AuthButtons";
import DonateButton from "@/components/DonateButton";
import NotifyBell from "@/components/NotifyBell";
import { useAuth } from '@/store/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/store/language';
import { t } from '@/lib/i18n';
import { logger } from '@/utils/logger';

export default function Header({
  currentCity, onCityChange, onAccountClick, onLogoClick, rightExtra
}: {
  currentCity: string;
  onCityChange: (city: string, lat?: number, lon?: number) => void;
  onAccountClick: () => void;
  onLogoClick: () => void;
  rightExtra?: React.ReactNode;
}) {
  const { user, openAuth, openPost } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMatchRoute = location.pathname.startsWith('/match');
  const { language: lang } = useLanguage();
  

  const handlePostClick = () => {
    logger.log('📌 Post button clicked, user:', user);
    if (user) {
      logger.log('✅ User found, opening post modal');
      openPost();
    } else {
      logger.log('❌ No user, opening auth modal');
      openAuth();
    }
  };
  return (
    <header className="w-full border-b bg-background/70 backdrop-blur relative z-[9999]">
      <div className="container mx-auto px-4 py-3 flex items-center gap-3 justify-between">
        <button 
          className="flex items-center gap-2 font-bold hover:opacity-80 transition-opacity cursor-pointer flex-shrink-0"
          onClick={() => navigate('/')}
          title="Go to Homepage"
        >
          <img 
            src="/lovable-uploads/d2261896-ec85-45d6-8ecf-9928fb132004.png" 
            alt="HabeshaCommunity Logo" 
            className="w-8 h-8 rounded-lg"
          />
          <span className="hover:text-primary transition-colors">HabeshaCommunity</span>
        </button>

        {!isMatchRoute && (
          <div className="flex-1 max-w-[300px] min-w-[200px] mx-4">
            <CitySearch
              value={currentCity}
              onSelect={(c) => onCityChange(c.name, Number(c.lat), Number(c.lon))}
            />
          </div>
        )}

        {!isMatchRoute && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <ThemeToggle />
            {rightExtra}
            <DonateButton />
            <NotifyBell />
            <button className="btn" onClick={() => navigate('/chat')}>{t(lang, "chat")}</button>
            <button className="btn btn-primary" onClick={handlePostClick}>+ {t(lang, "post")}</button>
            <AuthButtons />
          </div>
        )}
      </div>
    </header>
  );
}

