import CitySearch from "@/components/CitySearch";

export default function Header({
  currentCity, onCityChange, onAccountClick, onPostClick, rightExtra
}: {
  currentCity: string;
  onCityChange: (city: string, lat?: number, lon?: number) => void;
  onAccountClick: () => void;
  onPostClick: () => void;
  rightExtra?: React.ReactNode;
}) {
  return (
    <header className="w-full border-b bg-background/70 backdrop-blur">
      <div className="container mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 font-bold">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white grid place-items-center">H</div>
          <span>HabeshaNetwork</span>
        </div>

        <div className="order-2 md:order-none flex-1 min-w-[260px] z-50">
          <CitySearch
            value={currentCity}
            onSelect={(c) => onCityChange(c.name, Number(c.lat), Number(c.lon))}
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          {rightExtra}
          <button className="btn" onClick={onAccountClick} aria-label="Account">👤</button>
          <button className="btn btn-primary" onClick={onPostClick}>+ Post</button>
        </div>
      </div>
    </header>
  );
}

