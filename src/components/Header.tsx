import CitySearch from "@/components/CitySearch";
import DonationButton from "@/components/DonationButton";

export default function Header({
  currentCity, onCityChange, onAccountClick, onPostClick, onLogoClick, rightExtra
}: {
  currentCity: string;
  onCityChange: (city: string, lat?: number, lon?: number) => void;
  onAccountClick: () => void;
  onPostClick: () => void;
  onLogoClick: () => void;
  rightExtra?: React.ReactNode;
}) {
  return (
    <header className="w-full border-b bg-background/70 backdrop-blur">
      <div className="container mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
        <button 
          className="flex items-center gap-2 font-bold hover:opacity-80 transition-opacity"
          onClick={onLogoClick}
        >
          <img 
            src="/lovable-uploads/b4a1d9ff-6ada-4004-84e1-e2a43ad47cc5.png" 
            alt="HabeshaNetwork Logo" 
            className="w-8 h-8 rounded-lg"
          />
          <span>HabeshaNetwork</span>
        </button>

        <div className="order-2 md:order-none flex-1 min-w-[260px] z-50">
          <CitySearch
            value={currentCity}
            onSelect={(c) => onCityChange(c.name, Number(c.lat), Number(c.lon))}
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <DonationButton variant="ghost" />
          {rightExtra}
          <button className="btn" onClick={() => window.location.href = '/forums'}>Forums</button>
          <button className="btn" onClick={onAccountClick} aria-label="Account">👤</button>
          <button className="btn btn-primary" onClick={onPostClick}>+ Post</button>
        </div>
      </div>
    </header>
  );
}

