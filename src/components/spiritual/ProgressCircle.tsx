/**
 * Progress Circle Component
 * Beautiful circular progress indicator for reading plan completion
 */

import React from 'react';

interface ProgressCircleProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  showPercentage?: boolean;
  label?: string;
}

export function ProgressCircle({
  progress,
  size = 120,
  strokeWidth = 8,
  color = 'hsl(var(--primary))',
  showPercentage = true,
  label,
}: ProgressCircleProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            className="text-muted"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className="transition-all duration-500 ease-out"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke={color}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>

        {showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-foreground">
              {Math.round(progress)}%
            </span>
          </div>
        )}
      </div>

      {label && <p className="mt-2 text-sm text-muted-foreground font-medium">{label}</p>}
    </div>
  );
}

export function ProgressCircleMini({ progress, size = 40 }: { progress: number; size?: number }) {
  return <ProgressCircle progress={progress} size={size} strokeWidth={4} showPercentage={false} />;
}

export function ProgressBar({
  progress,
  height = 8,
  showPercentage = true,
  label,
}: {
  progress: number;
  height?: number;
  showPercentage?: boolean;
  label?: string;
}) {
  return (
    <div className="w-full">
      {label && <p className="text-sm font-medium text-foreground mb-2">{label}</p>}
      
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-muted rounded-full overflow-hidden" style={{ height }}>
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        
        {showPercentage && (
          <span className="text-sm font-semibold text-foreground min-w-[3rem] text-right">
            {Math.round(progress)}%
          </span>
        )}
      </div>
    </div>
  );
}

export function ProgressRing({ progress, size = 80 }: { progress: number; size?: number }) {
  return <ProgressCircle progress={progress} size={size} strokeWidth={6} showPercentage={true} />;
}
