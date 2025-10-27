/**
 * Reading Plan Card Component
 * Displays a beautiful card with gradient background for each reading plan
 */

import { Link } from 'react-router-dom';
import type { ReadingPlan } from '@/types/spiritual';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ProgressBar } from './ProgressCircle';

interface PlanCardProps {
  plan: ReadingPlan;
  showProgress?: boolean;
  progress?: number;
  variant?: 'default' | 'featured' | 'compact';
}

export function PlanCard({ plan, showProgress = false, progress = 0, variant = 'default' }: PlanCardProps) {
  const gradientStyle = plan.gradient
    ? {
        background: `linear-gradient(${plan.gradient.angle}deg, ${plan.gradient.colors
          .map(([color, position]) => `#${color} ${position * 100}%`)
          .join(', ')})`,
      }
    : {
        background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.8) 100%)',
      };

  const variantClasses = {
    default: 'h-64',
    featured: 'h-80',
    compact: 'h-48',
  };

  return (
    <Link to={`/spiritual/plans/${plan.slug}`}>
      <Card
        className={`${variantClasses[variant]} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden relative group border-0`}
        style={gradientStyle}
      >
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />

        <div className="relative h-full flex flex-col justify-between p-6 text-white">
          <div>
            {plan.premium && (
              <Badge className="mb-3 bg-yellow-400 text-yellow-900 hover:bg-yellow-500">
                PREMIUM
              </Badge>
            )}

            {plan.categories && plan.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {plan.categories.slice(0, 2).map((category) => (
                  <span
                    key={category}
                    className="px-2 py-1 bg-white/20 backdrop-blur-sm text-xs rounded-full"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}

            <h3 className="text-2xl font-bold mb-2 line-clamp-2">{plan.title}</h3>

            {variant !== 'compact' && (
              <p className="text-sm text-white/90 line-clamp-2 mb-4">
                {plan.description}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
                </svg>
                {plan.days_count} days
              </span>
              
              {plan.average_rating > 0 && (
                <span className="flex items-center gap-1">
                  ⭐ {plan.average_rating.toFixed(1)}
                </span>
              )}
            </div>

            {showProgress && (
              <div className="mt-3">
                <ProgressBar progress={progress} height={6} showPercentage={false} />
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
