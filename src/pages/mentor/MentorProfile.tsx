import { useState } from 'react';
import { 
  ArrowLeft, Star, MapPin, Globe, Calendar, Clock,
  MessageCircle, Video, Award, CheckCircle, Heart,
  Share2, Flag, Briefcase, GraduationCap, Languages,
  TrendingUp, Users, BookOpen, DollarSign, Zap,
  ChevronRight, ThumbsUp, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
}

interface TimeSlot {
  id: string;
  day: string;
  date: string;
  time: string;
  available: boolean;
}

const MentorProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSaved, setIsSaved] = useState(false);
  const [selectedTab, setSelectedTab] = useState('about');

  // Mock mentor data (in production, fetch by ID)
  const mentor = {
    id: id || '1',
    name: 'Daniel Tesfay',
    avatar: 'DT',
    title: 'Senior Software Engineer at Google',
    category: 'Technology & Software',
    expertise: ['Software Engineering', 'Career Growth', 'Tech Interviews', 'Leadership'],
    rating: 4.9,
    reviews: 127,
    totalSessions: 234,
    responseTime: '1 hour',
    hourlyRate: 75,
    location: 'San Francisco, CA',
    languages: ['Tigrinya', 'English', 'Amharic'],
    verified: true,
    availability: 'Available this week',
    memberSince: 'January 2023',
    bio: `I'm a Senior Software Engineer at Google with 10+ years of experience helping Habesha engineers break into top tech companies. I specialize in technical interview preparation, career development, and navigating corporate environments.

My journey from bootcamp to FAANG took dedication and the right guidance. Now I'm passionate about helping others achieve their tech career goals. I've mentored 200+ engineers, with 85% landing roles at their dream companies.

Whether you're starting your coding journey, preparing for interviews, or looking to level up your career, I'm here to help you succeed.`,
    achievements: [
      'Helped 200+ engineers land FAANG roles',
      'Senior Engineer at Google',
      '10+ years industry experience',
      'Published author on Medium'
    ],
    sessionTypes: [
      { type: 'Career Guidance', duration: '45 min', price: 75 },
      { type: 'Interview Prep', duration: '60 min', price: 100 },
      { type: 'Code Review', duration: '30 min', price: 60 },
      { type: 'Resume Review', duration: '30 min', price: 50 }
    ]
  };

  // Mock reviews
  const reviews: Review[] = [
    {
      id: '1',
      author: 'Michael Ghebre',
      avatar: 'MG',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Daniel helped me prepare for my Google interview. His insights were invaluable and I got the offer! Highly recommend for anyone serious about breaking into tech.',
      helpful: 24
    },
    {
      id: '2',
      author: 'Sara Tesfamariam',
      avatar: 'ST',
      rating: 5,
      date: '1 month ago',
      comment: 'Amazing mentor! Daniel provided clear guidance on career growth and helped me negotiate a 40% salary increase. Worth every penny.',
      helpful: 18
    },
    {
      id: '3',
      author: 'Yonas Berhe',
      avatar: 'YB',
      rating: 4,
      date: '1 month ago',
      comment: 'Great session on system design. Daniel explained complex concepts clearly and provided practical examples. Would book again.',
      helpful: 12
    },
    {
      id: '4',
      author: 'Helen Kidane',
      avatar: 'HK',
      rating: 5,
      date: '2 months ago',
      comment: 'Daniel helped me transition from a bootcamp grad to a software engineer at a startup. His advice on building projects and networking was spot on.',
      helpful: 15
    }
  ];

  // Mock available time slots
  const timeSlots: TimeSlot[] = [
    { id: '1', day: 'Mon', date: 'Oct 28', time: '2:00 PM', available: true },
    { id: '2', day: 'Mon', date: 'Oct 28', time: '4:00 PM', available: true },
    { id: '3', day: 'Tue', date: 'Oct 29', time: '10:00 AM', available: false },
    { id: '4', day: 'Tue', date: 'Oct 29', time: '2:00 PM', available: true },
    { id: '5', day: 'Wed', date: 'Oct 30', time: '3:00 PM', available: true },
    { id: '6', day: 'Thu', date: 'Oct 31', time: '1:00 PM', available: true },
    { id: '7', day: 'Fri', date: 'Nov 1', time: '11:00 AM', available: true },
    { id: '8', day: 'Fri', date: 'Nov 1', time: '3:00 PM', available: false }
  ];

  const handleBookSession = () => {
    navigate(`/mentor/profile/${mentor.id}/book`);
  };

  const handleMessage = () => {
    navigate(`/inbox?conversation=${mentor.id}`);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Removed from saved' : 'Saved to your list');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white py-8">
        <div className="container mx-auto px-4">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20 mb-4"
              onClick={() => navigate('/mentor')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Mentors
            </Button>

          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-white shadow-2xl">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-5xl font-bold">
                  {mentor.avatar}
                </AvatarFallback>
              </Avatar>
            {mentor.verified && (
                <Badge className="absolute -bottom-2 -right-2 bg-green-500 text-white border-none px-2 py-1">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Verified
                </Badge>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{mentor.name}</h1>
                  <p className="text-lg md:text-xl opacity-90 mb-3">{mentor.title}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold">{mentor.rating}</span>
                      <span className="opacity-80">({mentor.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{mentor.totalSessions} sessions</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Responds in {mentor.responseTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-white/20 text-white border-0">
                  <MapPin className="w-3 h-3 mr-1" />
                  {mentor.location}
                </Badge>
                <Badge className="bg-white/20 text-white border-0">
                  <Languages className="w-3 h-3 mr-1" />
                  {mentor.languages.join(', ')}
                </Badge>
                <Badge className="bg-white/20 text-white border-0">
                  <Calendar className="w-3 h-3 mr-1" />
                  {mentor.availability}
                </Badge>
              </div>

              <div className="flex flex-col gap-3">
                <Button 
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 w-full"
                  onClick={handleBookSession}
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Session - ${mentor.hourlyRate}/hr
                </Button>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    className="flex-1 border-white text-blue-600 bg-white hover:bg-blue-50"
                    onClick={handleMessage}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className={`border-white bg-white hover:bg-blue-50 ${isSaved ? 'text-red-500' : 'text-blue-600'}`}
                    onClick={handleSave}
                  >
                    <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-white text-blue-600 bg-white hover:bg-blue-50"
                    onClick={handleShare}
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({mentor.reviews})</TabsTrigger>
                <TabsTrigger value="availability">Availability</TabsTrigger>
              </TabsList>

              {/* About Tab */}
              <TabsContent value="about" className="space-y-6 mt-6">
                {/* Bio */}
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4">About {mentor.name.split(' ')[0]}</h3>
                  <div className="prose prose-sm max-w-none text-muted-foreground">
                    {mentor.bio.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 last:mb-0">{paragraph}</p>
                    ))}
                  </div>
                </Card>

                {/* Expertise */}
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-blue-600" />
                    Areas of Expertise
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {mentor.expertise.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-sm px-4 py-2">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </Card>

                {/* Achievements */}
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    Key Achievements
                  </h3>
                  <ul className="space-y-3">
                    {mentor.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Session Types */}
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-purple-600" />
                    Session Types
                  </h3>
                  <div className="space-y-3">
                    {mentor.sessionTypes.map((session, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div>
                          <h4 className="font-semibold mb-1">{session.type}</h4>
                          <p className="text-sm text-muted-foreground">
                            {session.duration}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">
                            ${session.price}
                          </div>
                          <Button size="sm" className="mt-2" onClick={handleBookSession}>
                            Book Now
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-6 mt-6">
                {/* Rating Summary */}
                <Card className="p-6">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-blue-600 mb-2">
                        {mentor.rating}
                      </div>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(mentor.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {mentor.reviews} reviews
                      </div>
                    </div>

                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center gap-3">
                          <span className="text-sm w-8">{stars}★</span>
                          <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-yellow-400 h-full rounded-full"
                              style={{
                                width: `${stars === 5 ? 85 : stars === 4 ? 10 : stars === 3 ? 3 : stars === 2 ? 1 : 1}%`
                              }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-8">
                            {stars === 5 ? 85 : stars === 4 ? 10 : stars === 3 ? 3 : stars === 2 ? 1 : 1}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id} className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                            {review.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold">{review.author}</h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <div className="flex">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span>•</span>
                                <span>{review.date}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-3">{review.comment}</p>
                          <Button variant="ghost" size="sm" className="text-muted-foreground">
                            <ThumbsUp className="w-4 h-4 mr-2" />
                            Helpful ({review.helpful})
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <Button variant="outline" className="w-full">
                  Load More Reviews
                </Button>
              </TabsContent>

              {/* Availability Tab */}
              <TabsContent value="availability" className="space-y-6 mt-6">
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4">Available Time Slots</h3>
                  <p className="text-muted-foreground mb-6">
                    Select a time slot to book your session with {mentor.name.split(' ')[0]}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot.id}
                        variant={slot.available ? 'outline' : 'ghost'}
                        className={`flex flex-col h-auto py-4 ${
                          !slot.available ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={!slot.available}
                        onClick={() => slot.available && handleBookSession()}
                      >
                        <div className="font-bold mb-1">{slot.day}</div>
                        <div className="text-xs text-muted-foreground mb-2">
                          {slot.date}
                        </div>
                        <div className="text-sm">{slot.time}</div>
                      </Button>
                    ))}
                  </div>

                  <Separator className="my-6" />

                  <div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Need a different time?
                    </p>
                    <Button 
                      onClick={handleMessage} 
                      className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      variant="outline"
                    >
                      Message
                    </Button>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card className="p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  ${mentor.hourlyRate}
                  <span className="text-lg text-muted-foreground">/hr</span>
                </div>
                <p className="text-sm text-muted-foreground">Starting price</p>
              </div>

              <Button 
                size="lg" 
                className="w-full mb-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                onClick={handleBookSession}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book a Session
              </Button>

              <Button 
                size="lg" 
                variant="outline" 
                className="w-full"
                onClick={handleMessage}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Send Message
              </Button>

              <Separator className="my-6" />

              {/* Quick Stats */}
              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Response Time</span>
                  <span className="font-semibold">{mentor.responseTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Member Since</span>
                  <span className="font-semibold">{mentor.memberSince}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Sessions</span>
                  <span className="font-semibold">{mentor.totalSessions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Success Rate</span>
                  <span className="font-semibold text-green-600">95%</span>
                </div>
              </div>
            </Card>

            {/* Report Button */}
            <Button variant="ghost" className="w-full text-muted-foreground">
              <Flag className="w-4 h-4 mr-2" />
              Report Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorProfile;
