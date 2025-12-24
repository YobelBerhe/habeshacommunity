import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronRight, 
  User,
  Settings,
  Shield,
  Heart,
  Users,
  HelpCircle
} from 'lucide-react';

const MENU_ITEMS = [
  { icon: User, label: 'Edit Profile', href: '/match/profile/edit', color: 'text-blue-500' },
  { icon: Settings, label: 'Dating Preferences', href: '/match/preferences', color: 'text-purple-500' },
  { icon: Users, label: 'Family Mode', href: '/match/family-mode', color: 'text-green-500' },
  { icon: Shield, label: 'Safety & Privacy', href: '/match/safety', color: 'text-red-500' },
  { icon: Heart, label: 'Dating Advice', href: '/match/advice', color: 'text-pink-500' },
];

const SETTINGS_ITEMS = [
  { icon: Settings, label: 'Account Settings', href: '/account/settings' },
  { icon: HelpCircle, label: 'Help & Support', href: '/help' },
];

export default function MatchMore() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">More</h1>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto p-4 space-y-6">
        {/* Features */}
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-3 px-1">
            Features
          </h2>
          <Card>
            {MENU_ITEMS.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-between h-14 px-4 rounded-none"
                    onClick={() => navigate(item.href)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-5 w-5 ${item.color}`} />
                      {item.label}
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </Button>
                  {index < MENU_ITEMS.length - 1 && (
                    <div className="border-b border-border ml-14" />
                  )}
                </div>
              );
            })}
          </Card>
        </div>

        {/* Settings */}
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-3 px-1">
            Settings
          </h2>
          <Card>
            {SETTINGS_ITEMS.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-between h-14 px-4 rounded-none"
                    onClick={() => navigate(item.href)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      {item.label}
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </Button>
                  {index < SETTINGS_ITEMS.length - 1 && (
                    <div className="border-b border-border ml-14" />
                  )}
                </div>
              );
            })}
          </Card>
        </div>
      </div>
    </div>
  );
}
