import { useSafeHTML } from '@/hooks/useSafeHTML';

interface SafeHTMLProps {
  html: string;
  className?: string;
}

// Component for rendering user content safely
export function SafeHTML({ html, className = '' }: SafeHTMLProps) {
  const safe = useSafeHTML(html);
  
  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
