import { useState } from 'react';
import { 
  Calendar, Clock, Video, MessageSquare, Star,
  CheckCircle, XCircle, AlertCircle, MoreVertical,
  Download, RefreshCw, ExternalLink, MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

interface Session {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorAvatar: string;
  mentorTitle: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  type: 'video' | 'voice';
  status: 'upcoming' | 'completed' | 'cancelled';
  meetingLink?: string;
  topic: string;
  rating?: number;
  review?: string;
}

const MySessions = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');

  // Demo sessions data
  const sessions: Session[] = [
    {
      id: '1',
      mentorId: '1',
      mentorName: 'Daniel Tesfay',
      mentorAvatar: 'DT',
      mentorTitle: 'Senior Software Engineer at Google',
      date: '2024-12-23',
      time: '2:00 PM',
      duration: 60,
      price: 120,
      type: 'video',
      status: 'upcoming',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      topic: 'Technical interview preparation for FAANG'
    },
    {
      id: '2',
      mentorId: '2',
      mentorName: 'Sara Woldu',
      mentorAvatar: 'SW',
      mentorTitle: 'Founder & CEO of TechStart Eritrea',
      date: '2024-12-25',
      time: '10:00 AM',
      duration: 90,
      price: 160,
      type: 'video',
      status: 'upcoming',
      meetingLink: 'https://zoom.us/j/123456789',
      topic: 'Business strategy and fundraising advice'
    },
    {
      id: '3',
      mentorId: '1',
      mentorName: 'Daniel Tesfay',
      mentorAvatar: 'DT',
      mentorTitle: 'Senior Software Engineer at Google',
      date: '2024-12-15',
      time: '3:00 PM',
      duration: 60,
      price: 120,
      type: 'video',
      status: 'completed',
      topic: 'System design fundamentals',
      rating: 5,
      review: 'Excellent session! Very helpful and knowledgeable.'
    },
    {
      id: '4',
      mentorId: '3',
      mentorName: 'Michael Ghebremariam',
      mentorAvatar: 'MG',
      mentorTitle: 'Immigration Lawyer',
      date: '2024-12-10',
      time: '1:00 PM',
      duration: 30,
      price: 75,
      type: 'voice',
      status: 'completed',
      topic: 'Visa application process',
      rating: 4
    },
    {
      id: '5',
      mentorId: '2',
      mentorName: 'Sara Woldu',
      mentorAvatar: 'SW',
      mentorTitle: 'Founder & CEO',
      date: '2024-12-05',
      time: '11:00 AM',
      duration: 60,
      price: 120,
      type: 'video',
      status: 'cancelled',
      topic: 'Startup pitch deck review'
    }
  ];

  const upcomingSessions = sessions.filter(s => s.status === 'upcoming');
  const completedSessions = sessions.filter(s => s.status === 'completed');
  const cancelledSessions = sessions.filter(s => s.status === 'cancelled');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'completed': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'cancelled': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
    }
  };

  const SessionCard = ({ session }: { session: Session }) => (
    <Card className="p-4 md:p-6 hover:shadow-lg transition-all">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Mentor Info */}
        <div className="flex items-start gap-4 flex-1">
          <Avatar 
            className="w-12 h-12 md:w-16 md:h-16 border-2 border-primary/20 cursor-pointer"
            onClick={() => navigate(`/mentor/${session.mentorId}`)}
          >
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-sm md:text-lg">
              {session.mentorAvatar}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0 flex-1">
                <h3 
                  className="font-bold text-base md:text-lg hover:text-primary cursor-pointer truncate"
                  onClick={() => navigate(`/mentor/${session.mentorId}`)}
                >
                  {session.mentorName}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground truncate">
                  {session.mentorTitle}
                </p>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="flex-shrink-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {session.status === 'upcoming' && (
                    <>
                      <DropdownMenuItem>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reschedule
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <XCircle className="w-4 h-4 mr-2" />
                        Cancel
                      </DropdownMenuItem>
                    </>
                  )}
                  {session.status === 'completed' && (
                    <DropdownMenuItem>
                      <Download className="w-4 h-4 mr-2" />
                      Download Receipt
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message Mentor
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Session Details */}
            <div className="space-y-2 text-xs md:text-sm">
              <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1.5" />
                  {new Date(session.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1.5" />
                  {session.time} ({session.duration} min)
                </div>
                {session.type === 'video' ? (
                  <div className="flex items-center">
                    <Video className="w-4 h-4 mr-1.5" />
                    Video Call
                  </div>
                ) : (
                  <div className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-1.5" />
                    Voice Call
                  </div>
                )}
              </div>

              <div className="text-foreground font-medium">
                Topic: {session.topic}
              </div>

              {/* Rating for completed sessions */}
              {session.status === 'completed' && session.rating && (
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < session.rating!
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  {session.review && (
                    <span className="text-xs text-muted-foreground ml-2 italic">
                      "{session.review}"
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex md:flex-col items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 md:border-l md:pl-4">
          <Badge className={`${getStatusColor(session.status)} whitespace-nowrap`}>
            {session.status === 'upcoming' && <Clock className="w-3 h-3 mr-1" />}
            {session.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
            {session.status === 'cancelled' && <XCircle className="w-3 h-3 mr-1" />}
            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
          </Badge>

          <div className="text-right flex-1 md:flex-none">
            <div className="text-xs text-muted-foreground">Total paid</div>
            <div className="text-lg font-bold text-primary">${session.price}</div>
          </div>

          {session.status === 'upcoming' && session.meetingLink && (
            <Button
              size="sm"
              className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              onClick={() => window.open(session.meetingLink, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Join Session
            </Button>
          )}

          {session.status === 'completed' && !session.rating && (
            <Button
              size="sm"
              variant="outline"
              className="w-full md:w-auto"
            >
              <Star className="w-4 h-4 mr-2" />
              Leave Review
            </Button>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Sessions</h1>
          <p className="text-base md:text-lg opacity-90">
            Manage your mentorship sessions and meetings
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6 md:mb-8">
          <Card className="p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {upcomingSessions.length}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">Upcoming</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
              {completedSessions.length}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">Completed</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
              ${sessions.reduce((sum, s) => sum + s.price, 0)}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">Total Spent</div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start mb-6">
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingSessions.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedSessions.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled ({cancelledSessions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingSessions.length > 0 ? (
              upcomingSessions.map(session => (
                <SessionCard key={session.id} session={session} />
              ))
            ) : (
              <Card className="p-12 text-center">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">No upcoming sessions</h3>
                <p className="text-muted-foreground mb-6">
                  Book a session with a mentor to get started
                </p>
                <Button onClick={() => navigate('/mentor')}>
                  Browse Mentors
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedSessions.length > 0 ? (
              completedSessions.map(session => (
                <SessionCard key={session.id} session={session} />
              ))
            ) : (
              <Card className="p-12 text-center">
                <CheckCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">No completed sessions yet</h3>
                <p className="text-muted-foreground">
                  Your completed sessions will appear here
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            {cancelledSessions.length > 0 ? (
              cancelledSessions.map(session => (
                <SessionCard key={session.id} session={session} />
              ))
            ) : (
              <Card className="p-12 text-center">
                <XCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">No cancelled sessions</h3>
                <p className="text-muted-foreground">
                  Great! You haven't cancelled any sessions
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MySessions;
