import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface MentorHeaderProps {
  title?: string;
  backPath?: string;
}

export default function MentorHeader({ title, backPath = '/' }: MentorHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="w-full border-b bg-background/70 backdrop-blur sticky top-0 z-[9999]">
      <div className="container mx-auto px-4 py-3 flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(backPath)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        {title && <h1 className="text-xl font-semibold">{title}</h1>}
      </div>
    </header>
  );
}
