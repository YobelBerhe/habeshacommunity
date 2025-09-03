import CitySearch from "@/components/CitySearch";
import ThemeToggle from "@/components/ThemeToggle";
import AuthButtons from "@/components/AuthButtons";
import DonateButton from "@/components/DonateButton";
import { useAuth } from '@/store/auth';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/store/language';
import { t } from '@/lib/i18n';

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
  const { language: lang } = useLanguage();
  
  console.log('🎯 Header render - user:', user);
  console.log('🎯 Header render - user type:', typeof user);

  const handlePostClick = () => {
    console.log('📌 Post button clicked, user:', user);
    if (user) {
      console.log('✅ User found, opening post modal');
      openPost();
    } else {
      console.log('❌ No user, opening auth modal');
      openAuth();
    }
  };
  return (
    <header className="w-full border-b bg-background/70 backdrop-blur">
      <div className="container mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
        <button 
          className="flex items-center gap-2 font-bold hover:opacity-80 transition-opacity cursor-pointer"
          onClick={onLogoClick}
          title="Go to Homepage"
        >
          <img 
            src="/lovable-uploads/d2261896-ec85-45d6-8ecf-9928fb132004.png" 
            alt="HabeshaCommunity Logo" 
            className="w-8 h-8 rounded-lg"
          />
          <span className="hover:text-primary transition-colors">HabeshaCommunity</span>
        </button>

        <div className="order-2 md:order-none flex-1 min-w-[260px] z-50">
          <CitySearch
            value={currentCity}
            onSelect={(c) => onCityChange(c.name, Number(c.lat), Number(c.lon))}
          />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <ThemeToggle />
          {rightExtra}
          <DonateButton />
          <button className="btn" onClick={() => navigate('/chat')}>{t(lang, "chat")}</button>
          <button className="btn btn-primary" onClick={handlePostClick}>+ {t(lang, "post")}</button>
          <AuthButtons />
        </div>
      </div>
    </header>
  );
}

