import { useState } from 'react';
import { 
  Menu, Heart, GraduationCap, ShoppingBag, Users, BookOpen,
  Home, MessageSquare, Calendar, Briefcase, Wrench,
  ChevronRight, Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useNavigate } from 'react-router-dom';

const MobileDrawer = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  const mainApps = [
    {
      name: 'Spiritual',
      name_ti: 'መንፈሳዊ',
      icon: BookOpen,
      path: '/spiritual',
      gradient: 'from-purple-500 to-indigo-500',
      items: [
        { name: 'Bible Reader', path: '/spiritual/reader' },
        { name: 'Reading Plans', path: '/spiritual/plans' },
        { name: 'My Progress', path: '/spiritual/progress' }
      ]
    },
    {
      name: 'Health',
      name_ti: 'ጥዕና',
      icon: Activity,
      path: '/health/dashboard',
      gradient: 'from-green-500 to-teal-500',
      items: [
        { name: '🌙 Sleep', path: '/health/sleep' },
        { name: '✔️ Tasks', path: '/health/dashboard' },
        { name: '🏋️ Workout', path: '/health/fitness' },
        { name: '🍽️ Meals', path: '/health/eat' },
        { name: '🙂 Mood', path: '/health/mental' }
      ]
    },
    {
      name: 'Matchmaking',
      name_ti: 'መስዋእቲ',
      icon: Heart,
      path: '/match',
      gradient: 'from-pink-500 to-rose-500',
      items: [
        { name: 'Discover', path: '/match/discover' },
        { name: 'My Matches', path: '/match/matches' },
        { name: 'My Profile', path: '/match/profile/me' },
        { name: 'Take Quiz', path: '/match/quiz' }
      ]
    },
    {
      name: 'Mentorship',
      name_ti: 'መምህርነት',
      icon: GraduationCap,
      path: '/mentor',
      gradient: 'from-blue-500 to-cyan-500',
      items: [
        { name: 'Find Mentors', path: '/mentor' },
        { name: 'My Sessions', path: '/mentor/sessions' },
        { name: 'Become a Mentor', path: '/mentor/onboarding' }
      ]
    },
    {
      name: 'Marketplace',
      name_ti: 'ዕዳጋ',
      icon: ShoppingBag,
      path: '/marketplace',
      gradient: 'from-green-500 to-emerald-500',
      items: [
        { name: 'Products', path: '/marketplace/products', icon: ShoppingBag },
        { name: 'Housing', path: '/marketplace/housing', icon: Home },
        { name: 'Jobs & Gigs', path: '/marketplace/jobs', icon: Briefcase },
        { name: 'Services', path: '/marketplace/services', icon: Wrench }
      ]
    },
    {
      name: 'Community',
      name_ti: 'ማሕበረሰብ',
      icon: Users,
      path: '/community',
      gradient: 'from-purple-500 to-pink-500',
      items: [
        { name: 'Forums', path: '/forums', icon: MessageSquare },
        { name: 'Events', path: '/events', icon: Calendar },
        { name: 'Groups', path: '/groups', icon: Users }
      ]
    }
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">HabeshaCommunity</h2>
            <p className="text-sm text-muted-foreground">ሓደ ማሕበረሰብ</p>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Home */}
            <Button
              variant="ghost"
              className="w-full justify-start mb-2"
              onClick={() => handleNavigate('/')}
            >
              <Home className="w-5 h-5 mr-3" />
              Home
            </Button>

            {/* Main Apps */}
            <div className="space-y-4 mt-6">
              {mainApps.map((app) => {
                const Icon = app.icon;
                return (
                  <div key={app.path}>
                    {/* App Header */}
                    <Button
                      variant="ghost"
                      className="w-full justify-between group hover:bg-muted"
                      onClick={() => handleNavigate(app.path)}
                    >
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${app.gradient} flex items-center justify-center mr-3`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">{app.name}</div>
                          <div className="text-xs text-muted-foreground">{app.name_ti}</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </Button>

                    {/* Sub Items */}
                    <div className="ml-14 mt-2 space-y-1">
                      {app.items.map((item) => {
                        const SubIcon = item.icon;
                        return (
                          <Button
                            key={item.path}
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-sm"
                            onClick={() => handleNavigate(item.path)}
                          >
                            {SubIcon && <SubIcon className="w-4 h-4 mr-2" />}
                            {item.name}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileDrawer;
