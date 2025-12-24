import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronRight, 
  BookMarked, 
  Highlighter, 
  Church,
  Calendar,
  Users,
  Heart,
  Settings,
  HelpCircle
} from 'lucide-react';

const MENU_ITEMS = [
  { icon: BookMarked, label: 'Bookmarks', href: '/spiritual/bookmarks', color: 'text-blue-500' },
  { icon: Highlighter, label: 'Highlights', href: '/spiritual/highlights', color: 'text-yellow-500' },
  { icon: Heart, label: 'Prayer Requests', href: '/spiritual/prayer-requests', color: 'text-red-500' },
  { icon: Calendar, label: 'Daily Prayers', href: '/spiritual/daily-prayers', color: 'text-purple-500' },
  { icon: Calendar, label: 'Fasting Calendar', href: '/spiritual/fasting-calendar', color: 'text-orange-500' },
  { icon: Calendar, label: 'Saints Calendar', href: '/spiritual/saints-calendar', color: 'text-green-500' },
  { icon: Church, label: 'Find Churches', href: '/church', color: 'text-indigo-500' },
  { icon: Users, label: 'Bible Study Groups', href: '/community/bible-groups', color: 'text-pink-500' },
];

const SETTINGS_ITEMS = [
  { icon: Settings, label: 'Reading Settings', href: '/account/settings' },
  { icon: HelpCircle, label: 'Help & Support', href: '/help' },
];

export default function More() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-40">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">More</h1>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Features */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Features
          </h2>
          <Card className="divide-y divide-border">
            {MENU_ITEMS.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-between h-auto py-4 px-4 rounded-none"
                    onClick={() => navigate(item.href)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-5 w-5 ${item.color}`} />
                      <span className="text-foreground">{item.label}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              );
            })}
          </Card>
        </section>

        {/* Settings */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Settings
          </h2>
          <Card className="divide-y divide-border">
            {SETTINGS_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-between h-auto py-4 px-4 rounded-none"
                    onClick={() => navigate(item.href)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <span className="text-foreground">{item.label}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              );
            })}
          </Card>
        </section>
      </main>
    </div>
  );
}
