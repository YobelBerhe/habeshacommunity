import { Heart, GraduationCap, ShoppingBag, Users, Grid3x3, BookOpen, Church, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate, useLocation } from 'react-router-dom';

const AppSwitcher = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const apps = [
    {
      id: 'spiritual',
      name: 'Spiritual',
      name_ti: 'መንፈሳዊ',
      path: '/spiritual',
      icon: BookOpen,
      gradient: 'from-purple-500 to-indigo-500',
      description: 'Read & grow in faith'
    },
    {
      id: 'matchmaking',
      name: 'Matchmaking',
      name_ti: 'መስዋእቲ',
      path: '/match',
      icon: Heart,
      gradient: 'from-pink-500 to-rose-500',
      description: 'Find your soulmate'
    },
    {
      id: 'mentorship',
      name: 'Mentorship',
      name_ti: 'መምህርነት',
      path: '/mentor',
      icon: GraduationCap,
      gradient: 'from-blue-500 to-cyan-500',
      description: 'Learn from experts'
    },
    {
      id: 'health',
      name: 'Health',
      name_ti: 'ጥዕና',
      path: '/health',
      icon: Activity,
      gradient: 'from-teal-500 to-emerald-500',
      description: 'Health & wellness'
    },
    {
      id: 'marketplace',
      name: 'Marketplace',
      name_ti: 'ዕዳጋ',
      path: '/market',
      icon: ShoppingBag,
      gradient: 'from-green-500 to-emerald-500',
      description: 'Buy & sell items'
    },
    {
      id: 'churches',
      name: 'Churches',
      name_ti: 'ቤተክርስትያን',
      path: '/churches',
      icon: Church,
      gradient: 'from-amber-500 to-orange-500',
      description: 'Find churches near you'
    },
    {
      id: 'community',
      name: 'Community',
      name_ti: 'ማሕበረሰብ',
      path: '/forums',
      icon: Users,
      gradient: 'from-purple-500 to-pink-500',
      description: 'Join discussions'
    }
  ];

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Grid3x3 className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[400px] p-3">
        <div className="mb-3">
          <h3 className="font-bold text-sm text-muted-foreground px-2">HabeshaCommunity Apps</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {apps.map((app) => {
            const Icon = app.icon;
            const active = isActive(app.path);
            
            return (
              <Card
                key={app.id}
                className={`p-4 cursor-pointer hover:shadow-lg transition-all ${
                  active ? 'ring-2 ring-primary bg-primary/5' : ''
                }`}
                onClick={() => navigate(app.path)}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${app.gradient} flex items-center justify-center mb-3 shadow-md`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-sm mb-1">{app.name}</h4>
                <p className="text-xs text-muted-foreground mb-1">{app.name_ti}</p>
                <p className="text-xs text-muted-foreground">{app.description}</p>
              </Card>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AppSwitcher;
