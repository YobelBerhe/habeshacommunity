import { useNavigate } from 'react-router-dom';
import { User, Heart, Settings, LogOut, Plus } from 'lucide-react';
import CitySearchBar from '@/components/CitySearchBar';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuth } from '@/store/auth';
import { supabase } from '@/integrations/supabase/client';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  onCitySelect?: (city: string) => void;
  showCitySearch?: boolean;
};

export function DesktopHeader({ onCitySelect, showCitySearch = true }: Props) {
  const navigate = useNavigate();
  const { user, openAuth, openPost } = useAuth();

  const handleLogoClick = () => {
    navigate('/');
  };

  const handlePostClick = () => {
    if (user) {
      openPost();
    } else {
      openAuth();
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <header className="hidden md:flex w-full border-b bg-background/95 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center gap-4">
        {/* Logo */}
        <button 
          className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition-opacity"
          onClick={handleLogoClick}
        >
          <img 
            src="/lovable-uploads/d2261896-ec85-45d6-8ecf-9928fb132004.png" 
            alt="HabeshaCommunity Logo" 
            className="w-8 h-8 rounded-lg"
          />
          <span className="text-primary">HabeshaCommunity</span>
        </button>

        {/* City Search Bar */}
        {showCitySearch && (
          <div className="flex-1 max-w-md">
            <CitySearchBar 
              placeholder="Search city..." 
              onCitySelect={onCitySelect || (() => {})}
            />
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-3 ml-auto">
          <ThemeToggle />
          
          {/* Post Button */}
          <button 
            onClick={handlePostClick}
            className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Post
          </button>

          {/* Account Menu */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-2 rounded-full border bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                <User className="w-5 h-5" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0" align="end" side="bottom">
              <div className="p-2">
                {user ? (
                  <>
                    <button
                      onClick={() => navigate('/account/saved')}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors"
                    >
                      <Heart className="w-4 h-4 text-red-500" />
                      Saved listings
                    </button>
                    <button
                      onClick={() => navigate('/account/listings')}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      My listings
                    </button>
                    <button
                      onClick={() => navigate('/account/settings')}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                    <div className="border-t my-1" />
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => navigate('/auth/login')}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors"
                    >
                      Sign in
                    </button>
                    <button
                      onClick={() => navigate('/auth/register')}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors"
                    >
                      Create account
                    </button>
                  </>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}