import CitySearch from "@/components/CitySearch";

export default function Header({
  currentCity, onCityChange, onAccountClick, onPostClick
}: {
  currentCity: string;
  onCityChange: (city: string, lat?: number, lon?: number) => void;
  onAccountClick: () => void;
  onPostClick: () => void;
}) {
  return (
    <header className="w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3 flex items-center gap-3">
        <div className="flex items-center gap-2 font-bold">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white grid place-items-center">H</div>
          <span>HabeshaNetwork</span>
        </div>
        <div className="flex-1" />
        <CitySearch
          value={currentCity}
          onSelect={(c) => onCityChange(c.name, Number(c.lat), Number(c.lon))}
        />
        <button className="btn" onClick={onAccountClick} aria-label="Account">👤</button>
        <button className="btn btn-primary" onClick={onPostClick}>+ Post</button>
      </div>
    </header>
  );
}

