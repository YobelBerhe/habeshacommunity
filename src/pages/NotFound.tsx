import { useSEO } from '@/hooks/useSEO';
import { Button } from '@/components/ui/button';
import { Home, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  useSEO({
    title: 'Page Not Found - HabeshaCommunity',
    description: 'The page you are looking for could not be found.',
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-primary mb-4">404</div>
        
        <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
        
        <p className="text-muted-foreground mb-6">
          Sorry, we couldn't find the page you're looking for. 
          It might have been moved or deleted.
        </p>

        <div className="flex gap-3 justify-center">
          <Button onClick={() => navigate('/')} className="gap-2">
            <Home className="w-4 h-4" />
            Go Home
          </Button>
          
          <Button variant="outline" onClick={() => navigate('/browse')} className="gap-2">
            <Search className="w-4 h-4" />
            Browse Listings
          </Button>
        </div>

        <div className="mt-8 pt-8 border-t">
          <h2 className="font-semibold mb-3">Popular Pages</h2>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button variant="link" onClick={() => navigate('/browse')}>
              Browse
            </Button>
            <Button variant="link" onClick={() => navigate('/mentor')}>
              Mentors
            </Button>
            <Button variant="link" onClick={() => navigate('/marketplace')}>
              Marketplace
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
