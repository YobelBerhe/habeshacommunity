import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { EventForm } from '@/components/events/EventForm';
import { useAuth } from '@/store/auth';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { useSEO } from '@/hooks/useSEO';

export default function CreateEvent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [calendars, setCalendars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: 'Create Event | HabeshaCommunity',
    description: 'Create a new community event',
  });

  useEffect(() => {
    if (!user) {
      toast.error('Please log in to create an event');
      navigate('/auth/login');
      return;
    }
    
    // Create a default calendar for demo
    setCalendars([{
      id: 'demo-calendar',
      name: `${user?.user_metadata?.full_name || 'My'} Events`
    }]);
    setLoading(false);
  }, [user]);

  const handleSubmit = async (formData: any) => {
    try {
      // Create slug from title
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + '-' + Date.now();

      // For now, use the old events table until types regenerate
      const { error } = await supabase
        .from('events')
        .insert({
          title_en: formData.title,
          description_en: formData.description,
          start_date: formData.startDate,
          end_date: formData.endDate,
          timezone: formData.timezone,
          location_type: formData.locationType,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          meeting_url: formData.virtualLink,
          max_attendees: formData.capacity,
          requires_registration: formData.requireApproval,
          status: 'published',
          organizer_id: user?.id,
          cover_image: formData.coverImage,
        });

      if (error) throw error;

      toast.success('Event created successfully!');
      navigate('/community/events');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create event');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Create Event</h1>
            <p className="text-lg text-muted-foreground">
              Share your event with the community
            </p>
          </div>

          <Card className="p-6 md:p-8 shadow-xl">
            <EventForm
              calendars={calendars}
              onSubmit={handleSubmit}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
