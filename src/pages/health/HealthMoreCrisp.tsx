import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Clock, Moon, Droplets, Brain, Heart, Target, 
  Calendar, BookOpen, ChevronRight, Sparkles,
  Scale, Activity, Pill, Leaf, Settings, HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MoreItem {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  isNew?: boolean;
  comingSoon?: boolean;
}

const HEALTH_FEATURES: MoreItem[] = [
  {
    id: 'fasting',
    name: 'Fasting Tracker',
    description: 'Orthodox fasting calendar & tracking',
    icon: <Clock className="w-5 h-5" />,
    href: '/health/fasting',
    color: 'bg-purple-50 text-purple-600'
  },
  {
    id: 'sleep',
    name: 'Sleep Tracking',
    description: 'Log and analyze your sleep',
    icon: <Moon className="w-5 h-5" />,
    href: '/health/sleep',
    color: 'bg-indigo-50 text-indigo-600',
    isNew: true
  },
  {
    id: 'hydration',
    name: 'Hydration',
    description: 'Track your water intake',
    icon: <Droplets className="w-5 h-5" />,
    href: '/health/hydration',
    color: 'bg-cyan-50 text-cyan-600'
  },
  {
    id: 'mental',
    name: 'Mental Health',
    description: 'Mood tracking & check-ins',
    icon: <Brain className="w-5 h-5" />,
    href: '/health/mental',
    color: 'bg-pink-50 text-pink-600',
    isNew: true
  },
  {
    id: 'body',
    name: 'Body Measurements',
    description: 'Track weight, body fat & more',
    icon: <Scale className="w-5 h-5" />,
    href: '/health/progress',
    color: 'bg-orange-50 text-orange-600'
  },
  {
    id: 'goals',
    name: 'Health Goals',
    description: 'Set and track your goals',
    icon: <Target className="w-5 h-5" />,
    href: '/health/goals',
    color: 'bg-emerald-50 text-emerald-600',
    comingSoon: true
  }
];

const RESOURCES: MoreItem[] = [
  {
    id: 'recipes',
    name: 'Recipes',
    description: 'Healthy Habesha recipes',
    icon: <BookOpen className="w-5 h-5" />,
    href: '/health/nutrition/recipes',
    color: 'bg-amber-50 text-amber-600'
  },
  {
    id: 'fasting-calendar',
    name: 'Fasting Calendar',
    description: 'Orthodox fasting schedule',
    icon: <Calendar className="w-5 h-5" />,
    href: '/spiritual/fasting-calendar',
    color: 'bg-purple-50 text-purple-600'
  },
  {
    id: 'coaches',
    name: 'Health Coaches',
    description: 'Find a Habesha health expert',
    icon: <Heart className="w-5 h-5" />,
    href: '/mentor?category=health',
    color: 'bg-red-50 text-red-600'
  }
];

const SETTINGS_ITEMS = [
  {
    id: 'preferences',
    name: 'Health Preferences',
    icon: <Settings className="w-5 h-5" />,
    href: '/health/settings'
  },
  {
    id: 'help',
    name: 'Help & Support',
    icon: <HelpCircle className="w-5 h-5" />,
    href: '/help'
  }
];

const MoreItemCard = ({ item }: { item: MoreItem }) => {
  const navigate = useNavigate();
  
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={() => !item.comingSoon && navigate(item.href)}
      disabled={item.comingSoon}
      className={cn(
        "w-full flex items-center gap-4 p-4 bg-white rounded-2xl",
        "border border-gray-100 text-left transition-all",
        item.comingSoon ? "opacity-50 cursor-not-allowed" : "hover:border-gray-200"
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
        item.color
      )}>
        {item.icon}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900">{item.name}</h3>
          {item.isNew && (
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">
              NEW
            </span>
          )}
          {item.comingSoon && (
            <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
              SOON
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 truncate">{item.description}</p>
      </div>
      
      <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
    </motion.button>
  );
};

export default function HealthMoreCrisp() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-gray-900">More</h1>
        <p className="text-gray-500 text-sm mt-1">
          Additional health features & settings
        </p>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6 pb-24">
        {/* Health Features */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
            Health Features
          </h2>
          <div className="space-y-2">
            {HEALTH_FEATURES.map(item => (
              <MoreItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* Resources */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
            Resources
          </h2>
          <div className="space-y-2">
            {RESOURCES.map(item => (
              <MoreItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* Tip Card */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
              <Sparkles className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Did you know?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Teff, the grain used to make injera, is one of the most 
                nutritious grains in the world. It's high in protein, fiber, 
                and iron.
              </p>
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
            Settings
          </h2>
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
            {SETTINGS_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => navigate(item.href)}
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600">
                  {item.icon}
                </div>
                <span className="font-medium text-gray-900">{item.name}</span>
                <ChevronRight className="w-5 h-5 text-gray-300 ml-auto" />
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
