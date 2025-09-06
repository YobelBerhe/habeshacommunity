import { useState } from 'react';
import { Search } from 'lucide-react';

export default function HeroSearch({ onCityChange }:{ onCityChange:(city:string)=>void }) {
  const [q, setQ] = useState('');
  const [city, setCity] = useState(localStorage.getItem('hn_city') || '');

  return (
    <section className="bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="bg-background/70">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-0 py-10 md:py-14">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight max-w-3xl">
            Connect. Find. Thrive.
          </h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
            Find housing, jobs, services, mentors, and more in your city.
          </p>

          <div className="mt-6 flex flex-col md:flex-row gap-3">
            <div className="flex-1 bg-background rounded-xl border shadow-sm p-2 flex items-center">
              <Search className="mx-2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e)=>setQ(e.target.value)}
                placeholder="Search listings, services, jobs…"
                className="flex-1 bg-transparent outline-none py-2"
              />
              <button
                onClick={()=> window.location.href = `/search?q=${encodeURIComponent(q)}${city ? `&city=${encodeURIComponent(city)}`:''}`}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
              >
                Search
              </button>
            </div>
            <input
              value={city}
              onChange={(e)=> setCity(e.target.value)}
              onBlur={()=> { localStorage.setItem('hn_city', city); onCityChange(city); }}
              placeholder="City (e.g., Oakland)"
              className="md:w-64 bg-background rounded-xl border shadow-sm p-3"
              aria-label="City"
            />
          </div>
        </div>
      </div>
    </section>
  );
}