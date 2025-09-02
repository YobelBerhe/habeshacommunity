import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Briefcase, Wrench, Users } from 'lucide-react';
import CitySearchBar from '@/components/CitySearchBar';
import WorldMapHero from '@/components/WorldMapHero';
import { getStarPoints } from '@/services/activeUsers';
import { Lang } from '@/lib/i18n';

type Props = {
  lang?: Lang;
};

export function DesktopHomeHero({ lang = 'EN' }: Props) {
  const navigate = useNavigate();
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getStarPoints();
        setTotalUsers(data.points.length);
      } catch (error) {
        console.error('Failed to load star points:', error);
      }
    };

    loadData();
    const interval = setInterval(loadData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleCitySelect = (city: string) => {
    navigate(`/browse?city=${encodeURIComponent(city)}`);
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/browse?category=${category}`);
  };

  const categories = [
    {
      key: 'housing',
      label: 'Housing/Rentals',
      icon: Building2,
      color: 'text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100'
    },
    {
      key: 'jobs',
      label: 'Jobs + Gigs',
      icon: Briefcase,
      color: 'text-green-600 border-green-200 bg-green-50 hover:bg-green-100'
    },
    {
      key: 'services',
      label: 'Services',
      icon: Wrench,
      color: 'text-purple-600 border-purple-200 bg-purple-50 hover:bg-purple-100'
    },
    {
      key: 'community',
      label: 'Community',
      icon: Users,
      color: 'text-orange-600 border-orange-200 bg-orange-50 hover:bg-orange-100'
    }
  ];

  return (
    <div className="hidden md:block relative min-h-[calc(100vh-80px)] overflow-hidden">
      {/* Background Map */}
      <div className="absolute inset-0">
        <WorldMapHero 
          lang={lang}
          onBrowseHousing={() => handleCategoryClick('housing')}
          onFindJobs={() => handleCategoryClick('jobs')}
        />
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="text-center mb-8 bg-background/90 backdrop-blur rounded-2xl p-8 border shadow-lg max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Find your next home, job, or service
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Connecting the global Habesha community
          </p>
          
          {totalUsers > 0 && (
            <p className="text-sm text-muted-foreground mb-6">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                {totalUsers} users online now
              </span>
            </p>
          )}

          {/* City Search */}
          <div className="mb-8">
            <CitySearchBar 
              placeholder="Search for your city (e.g. Asmara, Oakland, Frankfurt)"
              onCitySelect={handleCitySelect}
              className="text-lg py-4"
            />
          </div>

          {/* Category Quick Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.key}
                  onClick={() => handleCategoryClick(category.key)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all hover:scale-105 ${category.color}`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-sm font-medium">{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}