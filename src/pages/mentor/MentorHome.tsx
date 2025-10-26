import { useState } from 'react';
import { 
  Search, Filter, Star, MapPin, DollarSign, Clock,
  Briefcase, GraduationCap, Heart, Code, TrendingUp,
  Globe, Video, MessageSquare, Award, ChevronDown,
  Sparkles, Users, BookOpen, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';

interface Mentor {
  id: string;
  name: string;
  title: string;
  expertise: string[];
  rating: number;
  reviewCount: number;
  sessionsCompleted: number;
  languages: string[];
  location: string;
  pricePerHour: number;
  availability: string;
  bio: string;
  responseTime: string;
  verified: boolean;
}

const MentorHome = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const categories = [
    { id: 'all', name: 'All', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { id: 'business', name: 'Business', icon: Briefcase, color: 'from-green-500 to-emerald-500' },
    { id: 'tech', name: 'Technology', icon: Code, color: 'from-purple-500 to-pink-500' },
    { id: 'career', name: 'Jobs', icon: TrendingUp, color: 'from-amber-500 to-orange-500' },
    { id: 'education', name: 'Education', icon: GraduationCap, color: 'from-blue-500 to-indigo-500' },
    { id: 'life', name: 'Life', icon: Heart, color: 'from-rose-500 to-pink-500' },
  ];

  // Demo mentor data
  const mentors: Mentor[] = [
    {
      id: '1',
      name: 'Daniel Tesfay',
      title: 'Senior Software Engineer at Google',
      expertise: ['Software Engineering', 'Career Growth', 'Tech Interviews'],
      rating: 4.9,
      reviewCount: 127,
      sessionsCompleted: 234,
      languages: ['Tigrinya', 'English'],
      location: 'San Francisco, CA',
      pricePerHour: 75,
      availability: 'Available this week',
      bio: 'Helping Habesha engineers break into FAANG companies. 10+ years experience.',
      responseTime: '2 hours',
      verified: true
    },
    {
      id: '2',
      name: 'Sara Woldu',
      title: 'Founder & CEO of TechStart Eritrea',
      expertise: ['Entrepreneurship', 'Business Strategy', 'Fundraising'],
      rating: 5.0,
      reviewCount: 89,
      sessionsCompleted: 156,
      languages: ['Tigrinya', 'Amharic', 'English'],
      location: 'Asmara, Eritrea',
      pricePerHour: 50,
      availability: 'Available today',
      bio: 'Built 3 successful startups. Passionate about empowering African entrepreneurs.',
      responseTime: '1 hour',
      verified: true
    },
    {
      id: '3',
      name: 'Michael Ghebremariam',
      title: 'Immigration Lawyer & Consultant',
      expertise: ['Immigration Law', 'Visa Process', 'Legal Advice'],
      rating: 4.8,
      reviewCount: 203,
      sessionsCompleted: 412,
      languages: ['Tigrinya', 'English'],
      location: 'Washington DC',
      pricePerHour: 100,
      availability: 'Limited spots',
      bio: 'Specialized in helping Eritrean & Ethiopian diaspora with immigration matters.',
      responseTime: '4 hours',
      verified: true
    },
    {
      id: '4',
      name: 'Rahel Yohannes',
      title: 'Life Coach & Wellness Consultant',
      expertise: ['Life Coaching', 'Mental Health', 'Personal Growth'],
      rating: 4.9,
      reviewCount: 95,
      sessionsCompleted: 178,
      languages: ['Amharic', 'English'],
      location: 'Toronto, Canada',
      pricePerHour: 60,
      availability: 'Available this week',
      bio: 'Helping diaspora navigate identity, relationships, and personal development.',
      responseTime: '3 hours',
      verified: true
    },
    {
      id: '5',
      name: 'Solomon Tekle',
      title: 'Senior Product Manager at Microsoft',
      expertise: ['Product Management', 'Tech Leadership', 'Agile'],
      rating: 4.7,
      reviewCount: 64,
      sessionsCompleted: 98,
      languages: ['Tigrinya', 'English'],
      location: 'Seattle, WA',
      pricePerHour: 80,
      availability: 'Available next week',
      bio: 'Transitioning from engineering to PM? I can help you make that leap.',
      responseTime: '6 hours',
      verified: true
    },
    {
      id: '6',
      name: 'Meron Kidane',
      title: 'Digital Marketing Expert',
      expertise: ['Digital Marketing', 'Social Media', 'Brand Strategy'],
      rating: 4.8,
      reviewCount: 71,
      sessionsCompleted: 132,
      languages: ['Tigrinya', 'Amharic', 'English'],
      location: 'London, UK',
      pricePerHour: 55,
      availability: 'Available today',
      bio: 'Grew my agency from 0 to 50+ clients. Teaching others to do the same.',
      responseTime: '2 hours',
      verified: true
    }
  ];

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mentor.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mentor.expertise.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || 
                           mentor.expertise.some(e => e.toLowerCase().includes(selectedCategory));
    
    return matchesSearch && matchesCategory;
  });

  // Sort mentors based on selected criteria
  const sortedMentors = [...filteredMentors].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.sessionsCompleted - a.sessionsCompleted;
      case 'rating':
        return b.rating - a.rating;
      case 'price-low':
        return a.pricePerHour - b.pricePerHour;
      case 'price-high':
        return b.pricePerHour - a.pricePerHour;
      case 'available':
        if (a.availability === 'Available today') return -1;
        if (b.availability === 'Available today') return 1;
        if (a.availability === 'Available this week') return -1;
        if (b.availability === 'Available this week') return 1;
        return 0;
      default:
        return 0;
    }
  });

  // Pagination calculations
  const totalPages = Math.ceil(sortedMentors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMentors = sortedMentors.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = (callback: () => void) => {
    callback();
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-blue-50/20 dark:via-blue-950/10 to-background pb-20 md:pb-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30">
              <Sparkles className="w-4 h-4 mr-2" />
              Learn from Habesha Experts
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Find Your Perfect Mentor
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Connect with experienced professionals from the Eritrean & Ethiopian diaspora
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name, expertise, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 md:h-16 pl-12 md:pl-16 pr-4 md:pr-6 text-base md:text-lg rounded-full bg-white text-foreground border-0 shadow-xl"
              />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 mt-8 max-w-2xl mx-auto">
              <div>
                <div className="text-2xl md:text-4xl font-bold">{mentors.length}+</div>
                <div className="text-sm md:text-base opacity-90">Expert Mentors</div>
              </div>
              <div>
                <div className="text-2xl md:text-4xl font-bold">1.2K+</div>
                <div className="text-sm md:text-base opacity-90">Sessions Completed</div>
              </div>
              <div>
                <div className="text-2xl md:text-4xl font-bold">4.8★</div>
                <div className="text-sm md:text-base opacity-90">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 md:py-8 border-b bg-background/95 backdrop-blur sticky top-14 md:top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 snap-x snap-mandatory">
            <div className="flex items-center gap-2 pb-2 flex-nowrap touch-pan-x">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = selectedCategory === category.id;
                
                return (
                  <Button
                    key={category.id}
                    variant={isActive ? "default" : "outline"}
                    onClick={() => handleFilterChange(() => setSelectedCategory(category.id))}
                    className={`flex-shrink-0 snap-center whitespace-nowrap ${isActive ? `bg-gradient-to-r ${category.color}` : ''}`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {category.name}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Sort */}
      <section className="py-4 md:py-6 border-b bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{sortedMentors.length}</span> mentors
            </div>
            
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="available">Available Now</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>

              <Button
                onClick={() => navigate('/mentor/onboarding')}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 w-full sm:w-auto"
              >
                {/* No icon before label per request */}
                Become a Mentor
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mentors Grid */}
      <section className="py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {currentMentors.map((mentor) => (
              <Card
                key={mentor.id}
                className="group overflow-hidden hover:shadow-2xl transition-all cursor-pointer"
                onClick={() => navigate(`/mentor/profile/${mentor.id}`)}
              >
                <div className="p-4 md:p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16 md:w-20 md:h-20 border-4 border-primary/20">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-lg md:text-2xl font-bold">
                        {mentor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-base md:text-lg group-hover:text-primary transition-colors truncate">
                            {mentor.name}
                          </h3>
                          {mentor.verified && (
                            <Badge className="bg-blue-500 text-white text-xs">
                              <Award className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 mt-1">
                        {mentor.title}
                      </p>
                    </div>
                  </div>

                  {/* Rating & Stats */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400 mr-1" />
                      <span className="font-bold">{mentor.rating}</span>
                      <span className="text-muted-foreground ml-1">({mentor.reviewCount})</span>
                    </div>
                    <div className="text-muted-foreground">
                      {mentor.sessionsCompleted} sessions
                    </div>
                  </div>

                  {/* Expertise Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {mentor.expertise.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {mentor.expertise.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{mentor.expertise.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Info */}
                  <div className="space-y-2 text-xs md:text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Globe className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{mentor.languages.join(', ')}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{mentor.location}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{mentor.availability}</span>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {mentor.bio}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <div className="text-xs text-muted-foreground">Starting at</div>
                      <div className="text-xl md:text-2xl font-bold text-primary">
                        ${mentor.pricePerHour}
                        <span className="text-sm text-muted-foreground">/hr</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/inbox?mentor=${mentor.id}`);
                        }}
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                      >
                        Book Session
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {sortedMentors.length === 0 && (
            <Card className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">No mentors found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filters
              </p>
              <Button onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setCurrentPage(1);
              }}>
                Clear Filters
              </Button>
            </Card>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  const showPage = 
                    page === 1 || 
                    page === totalPages || 
                    (page >= currentPage - 1 && page <= currentPage + 1);
                  
                  const showEllipsis = 
                    (page === currentPage - 2 && currentPage > 3) ||
                    (page === currentPage + 2 && currentPage < totalPages - 2);

                  if (showEllipsis) {
                    return <span key={page} className="px-2 text-muted-foreground">...</span>;
                  }

                  if (!showPage) return null;

                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="icon"
                      onClick={() => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={currentPage === page ? "bg-gradient-to-r from-blue-500 to-cyan-500" : ""}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white mx-4 md:mx-0 rounded-2xl md:rounded-none">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Want to Share Your Expertise?
          </h2>
          <p className="text-base md:text-xl opacity-90 mb-6 md:mb-8 max-w-2xl mx-auto">
            Join our community of mentors and help shape the next generation of Habesha professionals
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/mentor/onboarding')}
            className="bg-white text-purple-600 hover:bg-gray-100"
          >
            <Award className="w-5 h-5 mr-2" />
            Become a Mentor
          </Button>
        </div>
      </section>

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default MentorHome;
