import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface MentorHeaderProps {
  title?: string;
  backPath?: string;
}

export default function MentorHeader({ title, backPath }: MentorHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="w-full border-b bg-background sticky top-0 z-[9999]">
      <div className="px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => (backPath ? navigate(backPath) : navigate(-1))}
            className="h-8 w-8"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        {title && <h1 className="text-lg font-semibold">{title}</h1>}
      </div>
    </header>
  );
}
