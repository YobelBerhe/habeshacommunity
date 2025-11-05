import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, X, Calendar as CalendarIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/store/auth';
import { toast } from 'sonner';
import { useSEO } from '@/hooks/useSEO';

export default function Calendars() {
  const { user } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);
  const [myCalendars, setMyCalendars] = useState<any[]>([]);
  const [subscribedCalendars, setSubscribedCalendars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: 'Calendars | HabeshaCommunity',
    description: 'Manage your event calendars and subscriptions',
  });

  useEffect(() => {
    fetchCalendars();
    
    // Show welcome modal for new users (you can add logic to show only once)
    const hasSeenWelcome = localStorage.getItem('calendar_welcome_seen');
    if (!hasSeenWelcome && user) {
      setShowWelcome(true);
    }
  }, [user]);

  const fetchCalendars = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Fetch user's calendars
      const { data: myData, error: myError } = await supabase
        .from('calendars')
        .select('*')
        .eq('user_id', user.id);

      if (myError) throw myError;
      setMyCalendars(myData || []);

      // Fetch subscribed calendars
      const { data: subsData, error: subsError } = await supabase
        .from('calendar_subscriptions')
        .select('calendar_id, calendars(*)')
        .eq('user_id', user.id);

      if (subsError) throw subsError;
      setSubscribedCalendars(subsData?.map(s => s.calendars).filter(Boolean) || []);
    } catch (error: any) {
      toast.error('Failed to load calendars');
    } finally {
      setLoading(false);
    }
  };

  const handleWelcomeClose = () => {
    setShowWelcome(false);
    localStorage.setItem('calendar_welcome_seen', 'true');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-bold mb-12">Calendars</h1>

        {/* Welcome Dialog */}
        <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
          <DialogContent className="sm:max-w-xl">
            <button
              onClick={handleWelcomeClose}
              className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
            
            <div className="flex gap-6 py-6">
              <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <CalendarIcon className="h-12 w-12 text-primary" />
              </div>
              
              <div className="flex-1">
                <DialogHeader className="mb-4">
                  <DialogTitle className="text-2xl">Welcome to Luma Calendar</DialogTitle>
                </DialogHeader>
                <p className="text-muted-foreground mb-6">
                  Luma Calendar lets you easily share and manage your events. Every event on Luma is part of a calendar. Let's see how they work.
                </p>
                <div className="flex justify-end">
                  <Button onClick={handleWelcomeClose}>Next</Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* My Calendars */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">My Calendars</h2>
            {user && (
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create
              </Button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : myCalendars.length === 0 ? (
            <Card className="p-12 text-center border-dashed">
              <p className="text-muted-foreground">
                You haven't created any calendars yet
              </p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCalendars.map((calendar) => (
                <Card key={calendar.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {calendar.avatar_url ? (
                        <img 
                          src={calendar.avatar_url} 
                          alt={calendar.name}
                          className="w-full h-full rounded-lg object-cover"
                        />
                      ) : (
                        <CalendarIcon className="h-8 w-8 text-primary" />
                      )}
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{calendar.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {calendar.subscribers_count === 0 ? 'No Subscribers' : `${calendar.subscribers_count} Subscribers`}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Subscribed Calendars */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Subscribed Calendars</h2>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : subscribedCalendars.length === 0 ? (
            <Card className="p-12">
              <div className="flex flex-col items-center text-center max-w-md mx-auto">
                <div className="w-24 h-24 rounded-2xl bg-muted flex items-center justify-center mb-6">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Subscriptions</h3>
                <p className="text-muted-foreground mb-6">
                  You have not subscribed to any calendars.
                </p>
                <Button asChild>
                  <Link to="/community/events/discover">Browse Featured Calendars</Link>
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscribedCalendars.map((calendar) => (
                <Card key={calendar.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-lg bg-muted flex-shrink-0">
                      {calendar.avatar_url && (
                        <img 
                          src={calendar.avatar_url} 
                          alt={calendar.name}
                          className="w-full h-full rounded-lg object-cover"
                        />
                      )}
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{calendar.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{calendar.location}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {calendar.description}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
