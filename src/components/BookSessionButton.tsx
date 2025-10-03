import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { bookMentorSession } from '@/utils/stripeActions';
import { useState } from 'react';

interface BookSessionButtonProps {
  mentorId: string;
  disabled?: boolean;
}

export function BookSessionButton({ mentorId, disabled }: BookSessionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleBookSession = async () => {
    try {
      setIsLoading(true);
      const result = await bookMentorSession(mentorId);
      if (result.redirectUrl) {
        window.open(result.redirectUrl, '_blank');
      }
    } catch (error) {
      console.error('Booking failed:', error);
      const errorMsg = error instanceof Error ? error.message : "Please try again";
      toast({
        title: "Booking failed",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleBookSession} 
      disabled={disabled || isLoading}
      className="w-full"
    >
      {isLoading ? 'Processing...' : 'Book Session'}
    </Button>
  );
}