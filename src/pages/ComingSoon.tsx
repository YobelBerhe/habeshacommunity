import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function ComingSoon() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="mb-6">
          <Construction className="w-20 h-20 mx-auto text-primary animate-pulse" />
        </div>
        
        <h1 className="text-3xl font-bold mb-3">Coming Soon</h1>
        <p className="text-muted-foreground mb-6">
          This feature is currently under development. Stay tuned for updates!
        </p>
        
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </Card>
    </div>
  );
}
