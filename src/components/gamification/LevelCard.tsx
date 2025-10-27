import React from 'react';
import { motion } from 'framer-motion';
import { Crown, TrendingUp, Zap, Trophy } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn, formatNumber, formatXP, getLevelIcon } from '@/lib/utils';

export interface LevelCardProps {
  currentLevel: number;
  levelName: string;
  currentXP: number;
  nextLevelXP: number;
  totalXP: number;
  icon?: string;
  color?: string;
  rank?: number;
  className?: string;
  animated?: boolean;
}

export function LevelCard({
  currentLevel,
  levelName,
  currentXP,
  nextLevelXP,
  totalXP,
  icon,
  color = '#FCD34D',
  rank,
  className,
  animated = true,
}: LevelCardProps) {
  const xpForCurrentLevel = React.useMemo(() => {
    if (currentLevel === 1) return 0;
    return Math.floor(100 * Math.pow(currentLevel - 1, 1.5));
  }, [currentLevel]);

  const xpInCurrentLevel = currentXP - xpForCurrentLevel;
  const xpRequiredForLevel = nextLevelXP - xpForCurrentLevel;
  const progress = Math.min(100, (xpInCurrentLevel / xpRequiredForLevel) * 100);
  const xpNeeded = nextLevelXP - currentXP;
  
  const displayIcon = icon || getLevelIcon(currentLevel);

  return (
    <motion.div
      initial={animated ? { opacity: 0, y: 20 } : false}
      animate={animated ? { opacity: 1, y: 0 } : false}
      transition={{ duration: 0.5 }}
      className={cn(
        'relative overflow-hidden rounded-xl border bg-gradient-to-br from-background to-muted',
        className
      )}
      style={{ borderColor: color }}
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div
        className="absolute -inset-1 blur-2xl opacity-20"
        style={{
          background: `radial-gradient(circle at top right, ${color}, transparent 70%)`,
        }}
      />

      <div className="relative z-10 p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <div
                className="text-5xl p-4 rounded-xl shadow-lg"
                style={{
                  backgroundColor: `${color}20`,
                  boxShadow: `0 4px 20px ${color}30`,
                }}
              >
                {displayIcon}
              </div>
              
              <motion.div
                className="absolute -bottom-2 -right-2 bg-background border-2 rounded-full px-2.5 py-0.5 shadow-lg"
                style={{ borderColor: color }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                <span className="text-xs font-bold" style={{ color }}>
                  LV {currentLevel}
                </span>
              </motion.div>
            </motion.div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Level</p>
              <h3 className="text-3xl font-bold tracking-tight" style={{ color }}>
                {levelName}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Level {currentLevel}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
              <Zap className="h-4 w-4" />
              <span>Total XP</span>
            </div>
            <div className="text-2xl font-bold" style={{ color }}>
              {formatNumber(totalXP)}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-medium">
                {formatNumber(xpInCurrentLevel)} / {formatNumber(xpRequiredForLevel)} XP
              </span>
              <motion.span
                className="flex items-center gap-1.5 font-semibold"
                style={{ color }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <TrendingUp className="h-4 w-4" />
                {formatXP(xpNeeded)} to Level {currentLevel + 1}
              </motion.span>
            </div>
            
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="origin-left"
            >
              <Progress
                value={progress}
                className="h-3"
                style={{ '--progress-color': color } as React.CSSProperties}
              />
            </motion.div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{Math.round(progress)}% complete</span>
              <span>Next: {levelName === 'Saint' ? 'Max Level' : `Level ${currentLevel + 1}`}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t flex items-center justify-between">
          {rank && (
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${color}15` }}
              >
                <Crown className="h-4 w-4" style={{ color }} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Community Rank</p>
                <p className="text-sm font-semibold">
                  #{formatNumber(rank)}
                </p>
              </div>
            </motion.div>
          )}

          <motion.div
            className="flex items-center gap-2 ml-auto"
            whileHover={{ scale: 1.05 }}
          >
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${color}15` }}
            >
              <Trophy className="h-4 w-4" style={{ color }} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Progress</p>
              <p className="text-sm font-semibold">
                {currentLevel}/10 Levels
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
        animate={{
          opacity: [0, 0.15, 0],
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          repeatDelay: 5,
          ease: 'linear',
        }}
      />
    </motion.div>
  );
}
