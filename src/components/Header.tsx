import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, User, Plus, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  currentCity: string;
  onCityChange: (city: string) => void;
  onAccountClick: () => void;
  onPostClick: () => void;
}

const Header = ({ currentCity, onCityChange, onAccountClick, onPostClick }: HeaderProps) => {
  const [cityInput, setCityInput] = useState(currentCity);
  const [language, setLanguage] = useState("en");
  const [countryFilter, setCountryFilter] = useState("all");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCitySearch = async (city: string) => {
    if (!city.trim()) return;
    
    try {
      // Here we would normally search for the city using Nominatim API
      // For now, just accept the input
      onCityChange(city.trim());
      setCityInput(city.trim());
      toast({
        title: "City changed",
        description: `Now browsing listings in ${city.trim()}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not find that city. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-card backdrop-blur-sm border-b border-border shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
              <span className="text-xl font-bold text-primary-foreground">H</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-foreground">HabeshaNetwork</h1>
              <Badge variant="secondary" className="text-xs">
                <Globe className="w-3 h-3 mr-1" />
                {currentCity}
              </Badge>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 flex-1 justify-end max-w-2xl">
            {/* Language Selector */}
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-24 hidden sm:flex">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="ti">ትግርኛ</SelectItem>
                <SelectItem value="am">አማርኛ</SelectItem>
              </SelectContent>
            </Select>

            {/* Country Filter */}
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="w-32 hidden md:flex">
                <SelectValue placeholder="All countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All countries</SelectItem>
                <SelectItem value="et">Ethiopia</SelectItem>
                <SelectItem value="er">Eritrea</SelectItem>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="de">Germany</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="se">Sweden</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
              </SelectContent>
            </Select>

            {/* City Search */}
            <div className="relative">
              <Input
                placeholder="Search city..."
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCitySearch(cityInput)}
                className="min-w-[180px] pr-10"
              />
              <Search 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary"
                onClick={() => handleCitySearch(cityInput)}
              />
            </div>

            {/* Account & Post Buttons */}
            <Button variant="ghost" size="icon" onClick={onAccountClick}>
              <User className="w-4 h-4" />
            </Button>
            
            <Button variant="hero" onClick={onPostClick}>
              <Plus className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Post</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;