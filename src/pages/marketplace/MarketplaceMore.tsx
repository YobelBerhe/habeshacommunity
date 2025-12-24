import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronRight, 
  Package,
  DollarSign,
  Settings,
  Shield,
  HelpCircle,
  Bell
} from 'lucide-react';

const MENU_ITEMS = [
  { icon: Package, label: 'Your Listings', href: '/marketplace/selling', color: 'text-blue-500' },
  { icon: DollarSign, label: 'Buying History', href: '/marketplace/purchases', color: 'text-green-500' },
  { icon: Bell, label: 'Notifications', href: '/notifications', color: 'text-purple-500' },
  { icon: Shield, label: 'Safety Tips', href: '/marketplace/safety', color: 'text-red-500' },
];

const SETTINGS_ITEMS = [
  { icon: Settings, label: 'Account Settings', href: '/account/settings' },
  { icon: HelpCircle, label: 'Help & Support', href: '/help' },
];

export default function MarketplaceMore() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">More</h1>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-6 w-full">
        {/* Features */}
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground px-1">
            Marketplace Tools
          </h2>
          <Card className="divide-y divide-border">
            {MENU_ITEMS.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-between h-auto py-4 px-4"
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
        </div>

        {/* Settings */}
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground px-1">
            Settings
          </h2>
          <Card className="divide-y divide-border">
            {SETTINGS_ITEMS.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-between h-auto py-4 px-4"
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
        </div>
      </div>
    </div>
  );
}
