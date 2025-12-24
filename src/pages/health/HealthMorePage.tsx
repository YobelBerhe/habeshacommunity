import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronRight, 
  Target,
  Calendar,
  Droplet,
  Moon,
  Brain,
  Settings,
  HelpCircle
} from 'lucide-react';

const MENU_ITEMS = [
  { icon: Target, label: 'Goals & Settings', href: '/health/goals', color: 'text-blue-500' },
  { icon: Calendar, label: 'Fasting Tracker', href: '/health/fasting', color: 'text-purple-500' },
  { icon: Droplet, label: 'Water Intake', href: '/health/hydration', color: 'text-cyan-500' },
  { icon: Moon, label: 'Sleep Tracker', href: '/health/sleep', color: 'text-indigo-500' },
  { icon: Brain, label: 'Mental Wellness', href: '/health/mental', color: 'text-pink-500' },
];

const SETTINGS_ITEMS = [
  { icon: Settings, label: 'Account Settings', href: '/account/settings' },
  { icon: HelpCircle, label: 'Help & Support', href: '/help' },
];

export default function HealthMorePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">More</h1>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* Features */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground px-1">
            Health Tools
          </p>
          <Card>
            {MENU_ITEMS.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-between h-14 px-4"
                    onClick={() => navigate(item.href)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-5 w-5 ${item.color}`} />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </Button>
                  {index < MENU_ITEMS.length - 1 && (
                    <div className="border-b border-border mx-4" />
                  )}
                </div>
              );
            })}
          </Card>
        </div>

        {/* Settings */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground px-1">
            Settings
          </p>
          <Card>
            {SETTINGS_ITEMS.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-between h-14 px-4"
                    onClick={() => navigate(item.href)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </Button>
                  {index < SETTINGS_ITEMS.length - 1 && (
                    <div className="border-b border-border mx-4" />
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
