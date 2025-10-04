import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import MentorHeader from '@/components/MentorHeader';
import { useEffect } from 'react';

export default function Inbox() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <MentorHeader title="Messages" backPath="/" />
      <div className="container mx-auto px-4 py-8">

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-6 h-6" />
              Inbox
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground mb-2">
                Direct messaging feature is being updated.
              </p>
              <p className="text-sm text-muted-foreground">
                Required tables (dm_threads, dm_messages, dm_members) need to be created.
              </p>
              <p className="text-sm mt-4">
                For now, use the contact information on listings to connect with users.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
