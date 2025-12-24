import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronRight, 
  Calendar,
  Users,
  MessageSquare,
  Settings,
  HelpCircle,
  Bell
} from 'lucide-react';

const MENU_ITEMS = [
  { icon: Calendar, label: 'My Events', href: '/community/my-events', color: 'text-blue-500' },
  { icon: Users, label: 'My Groups', href: '/community/my-groups', color: 'text-green-500' },
  { icon: MessageSquare, label: 'Forums', href: '/community/forums', color: 'text-purple-500' },
  { icon: Bell, label: 'Notifications', href: '/notifications', color: 'text-orange-500' },
];

const SETTINGS_ITEMS = [
  { icon: Settings, label: 'Account Settings', href: '/account/settings' },
  { icon: HelpCircle, label: 'Help & Support', href: '/help' },
];

export default function CommunityMore() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-40 border-b border-border">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">More</h1>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-6">
        {/* Features */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground px-1">
            Community Tools
          </p>
          <Card>
            {MENU_ITEMS.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.label}>
                  <Button
                    variant="ghost"
                    className="w-full justify-between h-14 px-4"
                    onClick={() => navigate(item.href)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-5 w-5 ${item.color}`} />
                      {item.label}
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
                <div key={item.label}>
                  <Button
                    variant="ghost"
                    className="w-full justify-between h-14 px-4"
                    onClick={() => navigate(item.href)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      {item.label}
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
