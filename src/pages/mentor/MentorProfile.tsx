import { useState } from 'react';
import { 
  ArrowLeft, Star, MapPin, Globe, Clock, DollarSign,
  Award, Video, MessageSquare, Calendar, CheckCircle,
  Heart, Share2, Flag, Briefcase, GraduationCap,
  Users, TrendingUp, BookOpen, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, useParams } from 'react-router-dom';

const MentorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  // Demo mentor data
  const mentor = {
    id: '1',
    name: 'Daniel Tesfay',
    title: 'Senior Software Engineer at Google',
    avatar: 'DT',
    rating: 4.9,
    reviewCount: 127,
    sessionsCompleted: 234,
    responseTime: '2 hours',
    languages: ['Tigrinya', 'English'],
    location: 'San Francisco, CA',
    timezone: 'PST (UTC-8)',
    verified: true,
    memberSince: 'January 2023',
    
    expertise: [
      'Software Engineering',
      'System Design',
      'Career Growth',
      'Technical Interviews',
      'Leadership',
      'Mentorship'
    ],
    
    bio: `I'm a Senior Software Engineer at Google with over 10 years of experience in the tech industry. I'm passionate about helping fellow Habesha engineers break into top tech companies and grow their careers.

I've successfully mentored 200+ engineers, helping them land roles at FAANG companies, negotiate better offers, and navigate their career paths. Whether you're preparing for interviews, looking to switch careers, or seeking guidance on technical growth, I'm here to help.

My approach is practical and results-oriented. I focus on actionable advice, real-world scenarios, and helping you build confidence in your technical abilities.`,

    education: [
      {
        degree: 'M.S. Computer Science',
        school: 'Stanford University',
        year: '2015'
      },
      {
        degree: 'B.S. Computer Engineering',
        school: 'University of Asmara',
        year: '2012'
      }
    ],

    experience: [
      {
        title: 'Senior Software Engineer',
        company: 'Google',
        duration: '2018 - Present',
        description: 'Leading infrastructure projects serving billions of users'
      },
      {
        title: 'Software Engineer',
        company: 'Facebook (Meta)',
        duration: '2015 - 2018',
        description: 'Built features for Instagram and WhatsApp'
      }
    ],

    pricing: [
      {
        duration: 30,
        price: 75,
        description: 'Perfect for quick questions or interview prep',
        popular: false
      },
      {
        duration: 60,
        price: 120,
        description: 'Deep dive into career strategy or technical topics',
        popular: true
      },
      {
        duration: 90,
        price: 160,
        description: 'Comprehensive mock interview or project review',
        popular: false
      }
    ],

    reviews: [
      {
        id: '1',
        author: 'Meron K.',
        rating: 5,
        date: '2 days ago',
        comment: 'Daniel helped me land my dream job at Amazon! His interview prep was invaluable. Highly recommend!',
        verified: true
      },
      {
        id: '2',
        author: 'Solomon T.',
        rating: 5,
        date: '1 week ago',
        comment: 'Excellent mentor. Very knowledgeable and patient. Helped me understand system design concepts clearly.',
        verified: true
      },
      {
        id: '3',
        author: 'Rahel W.',
        rating: 4,
        date: '2 weeks ago',
        comment: 'Great session! Daniel provided actionable advice for my career transition. Would book again.',
        verified: true
      }
    ],

    availability: [
      { day: 'Monday', slots: ['9:00 AM', '2:00 PM', '5:00 PM'] },
      { day: 'Tuesday', slots: ['10:00 AM', '3:00 PM'] },
      { day: 'Wednesday', slots: ['9:00 AM', '1:00 PM', '4:00 PM'] },
      { day: 'Thursday', slots: ['11:00 AM', '2:00 PM'] },
      { day: 'Friday', slots: ['10:00 AM', '3:00 PM', '6:00 PM'] }
    ]
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <div className="sticky top-14 md:top-16 z-40 bg-background/95 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Flag className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6">
                <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-primary/20">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-4xl font-bold">
                    {mentor.avatar}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold mb-2">{mentor.name}</h1>
                      <p className="text-muted-foreground mb-3">{mentor.title}</p>
                      
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <div className="flex items-center">
                          <Star className="w-5 h-5 text-amber-400 fill-amber-400 mr-1" />
                          <span className="font-bold">{mentor.rating}</span>
                          <span className="text-muted-foreground ml-1">({mentor.reviewCount} reviews)</span>
                        </div>
                        {mentor.verified && (
                          <Badge className="bg-blue-500 text-white">
                            <Award className="w-3 h-3 mr-1" />
                            Verified Expert
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-2xl font-bold text-primary">{mentor.sessionsCompleted}</div>
                      <div className="text-muted-foreground">Sessions</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">{mentor.responseTime}</div>
                      <div className="text-muted-foreground">Response</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">{mentor.languages.length}</div>
                      <div className="text-muted-foreground">Languages</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">2+ yrs</div>
                      <div className="text-muted-foreground">Experience</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({mentor.reviewCount})</TabsTrigger>
                <TabsTrigger value="availability">Availability</TabsTrigger>
              </TabsList>

              {/* About Tab */}
              <TabsContent value="about" className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4">About Me</h3>
                  <div className="prose prose-sm max-w-none text-foreground">
                    {mentor.bio.split('\n\n').map((paragraph, i) => (
                      <p key={i} className="mb-4">{paragraph}</p>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4">Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {mentor.expertise.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-sm py-2 px-4">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4">Education</h3>
                  <div className="space-y-4">
                    {mentor.education.map((edu, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <GraduationCap className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-bold">{edu.degree}</h4>
                          <p className="text-muted-foreground">{edu.school}</p>
                          <p className="text-sm text-muted-foreground">{edu.year}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4">Experience</h3>
                  <div className="space-y-4">
                    {mentor.experience.map((exp, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Briefcase className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-bold">{exp.title}</h4>
                          <p className="text-muted-foreground">{exp.company}</p>
                          <p className="text-sm text-muted-foreground mb-2">{exp.duration}</p>
                          <p className="text-sm">{exp.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-4">
                {mentor.reviews.map((review) => (
                  <Card key={review.id} className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-gradient-to-br from-green-500 to-teal-500 text-white">
                            {review.author[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-bold">{review.author}</div>
                          <div className="text-sm text-muted-foreground">{review.date}</div>
                        </div>
                      </div>
                      {review.verified && (
                        <Badge variant="secondary" className="text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    
                    <p className="text-foreground">{review.comment}</p>
                  </Card>
                ))}
              </TabsContent>

              {/* Availability Tab */}
              <TabsContent value="availability" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-lg font-bold mb-4">Available Time Slots</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Timezone: {mentor.timezone}
                  </p>
                  <div className="space-y-4">
                    {mentor.availability.map((day) => (
                      <div key={day.day} className="border-b pb-4 last:border-0">
                        <h4 className="font-semibold mb-3">{day.day}</h4>
                        <div className="flex flex-wrap gap-2">
                          {day.slots.map((slot) => (
                            <Badge key={slot} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                              {slot}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <Card className="p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4">Book a Session</h3>
              
              <div className="space-y-3 mb-6">
                {mentor.pricing.map((option) => (
                  <div
                    key={option.duration}
                    className={`p-4 border-2 rounded-lg cursor-pointer hover:border-primary transition-colors ${
                      option.popular ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                  >
                    {option.popular && (
                      <Badge className="mb-2 bg-gradient-to-r from-blue-500 to-cyan-500">
                        Most Popular
                      </Badge>
                    )}
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold text-lg">{option.duration} minutes</div>
                      <div className="text-2xl font-bold text-primary">${option.price}</div>
                    </div>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                ))}
              </div>

              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 mb-3"
                onClick={() => navigate(`/mentor/book/${id}`)}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book Session
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/inbox?mentor=${id}`)}
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Send Message
              </Button>
            </Card>

            {/* Info */}
            <Card className="p-6">
              <h3 className="font-bold mb-4">Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Globe className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span>{mentor.languages.join(', ')}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span>{mentor.location}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span>Responds in {mentor.responseTime}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Users className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span>Member since {mentor.memberSince}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorProfile;
