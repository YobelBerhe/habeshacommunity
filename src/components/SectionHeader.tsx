// src/components/SectionHeader.tsx
import { ChevronRight } from 'lucide-react';

export default function SectionHeader({
  title,
  subtitle,
  href
}: { 
  title: string; 
  subtitle?: string; 
  href?: string; 
}) {
  return (
    <div className="flex items-end justify-between mb-4">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {href && (
        <a 
          href={href} 
          className="inline-flex items-center text-primary hover:underline text-sm font-medium"
        >
          View all <ChevronRight className="w-4 h-4 ml-0.5" />
        </a>
      )}
    </div>
  );
}