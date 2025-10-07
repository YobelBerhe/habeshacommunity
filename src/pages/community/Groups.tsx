import { useState } from 'react';
import { 
  Users, Search, Filter, TrendingUp, Lock, Globe,
  MessageSquare, Clock, Plus, Star, UserPlus,
  Heart, CheckCircle
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

interface Group {
  id: string;
  name: string;
  name_ti: string;
  description: string;
  icon: any;
  color: string;
  members: number;
  posts: number;
  privacy: 'public' | 'private';
  category: string;
  admin: string;
  adminAvatar: string;
  trending: boolean;
  verified: boolean;
  recentActivity: string;
  memberGrowth: string;
}

const Groups = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPrivacy, setSelectedPrivacy] = useState('all');

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'professional', name: 'Professional' },
    { id: 'family', name: 'Family & Parents' },
    { id: 'culture', name: 'Culture & Heritage' },
    { id: 'education', name: 'Education' },
    { id: 'lifestyle', name: 'Lifestyle & Hobbies' },
    { id: 'regional', name: 'Regional' }
  ];

  // Demo groups
  const groups: Group[] = [
    {
      id: '1',
      name: 'Young Professionals Network',
      name_ti: 'መርበብ መንእሰያት ፕሮፌሽናላት',
      description: 'Connect with Habesha professionals in tech, business, finance, and entrepreneurship. Share career advice, job opportunities, and networking events.',
      icon: Users,
      color: 'from-blue-500 to-indigo-500',
      members: 1234,
      posts: 567,
      privacy: 'public',
      category: 'professional',
      admin: 'Michael Tesfay',
      adminAvatar: 'MT',
      trending: true,
      verified: true,
      recentActivity: '5 min ago',
      memberGrowth: '+45 this week'
    },
    {
      id: '2',
      name: 'Parents & Families',
      name_ti: 'ወለዲን ስድራቤታትን',
      description: 'Support group for Habesha parents raising children in the diaspora. Share parenting tips, cultural education resources, and family activities.',
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      members: 892,
      posts: 423,
      privacy: 'public',
      category: 'family',
      admin: 'Sara Mehretab',
      adminAvatar: 'SM',
      trending: true,
      verified: true,
      recentActivity: '12 min ago',
      memberGrowth: '+32 this week'
    },
    {
      id: '3',
      name: 'Habesha Book Club',
      name_ti: 'ክለብ መጽሓፍቲ',
      description: 'Monthly book discussions featuring works by Habesha authors and about Habesha culture. All reading levels welcome!',
      icon: MessageSquare,
      color: 'from-amber-500 to-orange-500',
      members: 456,
      posts: 234,
      privacy: 'public',
      category: 'education',
      admin: 'Rahel Woldu',
      adminAvatar: 'RW',
      trending: false,
      verified: false,
      recentActivity: '1 hour ago',
      memberGrowth: '+12 this week'
    },
    {
      id: '4',
      name: 'Fitness & Wellness Warriors',
      name_ti: 'ተጋደልቲ ብሩህነትን ጥዕናን',
      description: 'Health, fitness, and wellness community. Share workout routines, healthy recipes, and motivate each other to stay active.',
      icon: TrendingUp,
      color: 'from-green-500 to-teal-500',
      members: 678,
      posts: 345,
      privacy: 'public',
      category: 'lifestyle',
      admin: 'Daniel Kidane',
      adminAvatar: 'DK',
      trending: false,
      verified: true,
      recentActivity: '2 hours ago',
      memberGrowth: '+23 this week'
    },
    {
      id: '5',
      name: 'Tigrinya Language Learners',
      name_ti: 'ተማሃሮ ቋንቋ ትግርኛ',
      description: 'Learn and practice Tigrinya together. Resources, lessons, and conversation practice for all levels from beginners to advanced.',
      icon: Globe,
      color: 'from-purple-500 to-pink-500',
      members: 567,
      posts: 289,
      privacy: 'public',
      category: 'education',
      admin: 'Meron Kidane',
      adminAvatar: 'MK',
      trending: true,
      verified: true,
      recentActivity: '30 min ago',
      memberGrowth: '+67 this week'
    },
    {
      id: '6',
      name: 'Bay Area Habesha Community',
      name_ti: 'ማሕበረሰብ ሃበሻ ቤይ ኤሪያ',
      description: 'Connect with Habesha people in the San Francisco Bay Area. Local events, meetups, and community support.',
      icon: Users,
      color: 'from-cyan-500 to-blue-500',
      members: 834,
      posts: 456,
      privacy: 'public',
      category: 'regional',
      admin: 'Solomon Tekle',
      adminAvatar: 'ST',
      trending: false,
      verified: true,
      recentActivity: '45 min ago',
      memberGrowth: '+18 this week'
    },
    {
      id: '7',
      name: 'Habesha Entrepreneurs Hub',
      name_ti: 'ማእከል ነጋዶ ሃበሻ',
      description: 'Support network for Habesha business owners and entrepreneurs. Share resources, advice, and collaboration opportunities.',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      members: 423,
      posts: 198,
      privacy: 'private',
      category: 'professional',
      admin: 'Isaac Ghebreyesus',
      adminAvatar: 'IG',
      trending: true,
      verified: false,
      recentActivity: '1 hour ago',
      memberGrowth: '+15 this week'
    },
    {
      id: '8',
      name: 'Traditional Music & Dance',
      name_ti: 'ባህላዊ ሙዚቃን ውዝዋርን',
      description: 'Celebrate and preserve our traditional music and dance. Share performances, learn steps, and organize cultural events.',
      icon: Star,
      color: 'from-orange-500 to-red-500',
      members: 345,
      posts: 167,
      privacy: 'public',
      category: 'culture',
      admin: 'Sophia Abraham',
      adminAvatar: 'SA',
      trending: false,
      verified: false,
      recentActivity: '3 hours ago',
      memberGrowth: '+8 this week'
    }
  ];

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || group.category === selectedCategory;
    const matchesPrivacy = selectedPrivacy === 'all' || group.privacy === selectedPrivacy;
    return matchesSearch && matchesCategory && matchesPrivacy;
  });

  const trendingGroups = groups.filter(g => g.trending).slice(0, 3);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Community Groups</h1>
              <p className="text-base md:text-lg opacity-90">
                Find your tribe and connect with like-minded people
              </p>
            </div>
            <Button
              size="lg"
              onClick={() => navigate('/community/create-group')}
              className="bg-white text-purple-600 hover:bg-gray-100"
            >
              <Plus className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Create Group</span>
              <span className="sm:hidden">Create</span>
            </Button>
          </div>

          {/* Search */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-full bg-white text-foreground border-0"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Categories */}
            <Card className="p-4">
              <h3 className="font-bold mb-4">Categories</h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                      selectedCategory === category.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </Card>

            {/* Privacy Filter */}
            <Card className="p-4">
              <h3 className="font-bold mb-4">Privacy</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedPrivacy('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm flex items-center ${
                    selectedPrivacy === 'all'
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  All Groups
                </button>
                <button
                  onClick={() => setSelectedPrivacy('public')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm flex items-center ${
                    selectedPrivacy === 'public'
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Public
                </button>
                <button
                  onClick={() => setSelectedPrivacy('private')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm flex items-center ${
                    selectedPrivacy === 'private'
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Private
                </button>
              </div>
            </Card>

            {/* My Groups */}
            <Card className="p-4">
              <h3 className="font-bold mb-4">My Groups</h3>
              <div className="space-y-3">
                {groups.slice(0, 3).map((group) => {
                  const Icon = group.icon;
                  return (
                    <Card
                      key={group.id}
                      className="p-3 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => navigate(`/community/groups/${group.id}`)}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${group.color} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-xs truncate">{group.name}</h4>
                          <p className="text-xs text-muted-foreground">{group.members} members</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3">
                View All
              </Button>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Trending Groups */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-primary" />
                  Trending Groups
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {trendingGroups.map((group) => {
                  const Icon = group.icon;
                  return (
                    <Card
                      key={group.id}
                      className="p-4 hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => navigate(`/community/groups/${group.id}`)}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${group.color} flex items-center justify-center mb-3`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-bold mb-1">{group.name}</h3>
                        <p className="text-xs text-muted-foreground mb-3">{group.name_ti}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                          <Users className="w-3 h-3" />
                          <span>{group.members} members</span>
                        </div>
                        <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {group.memberGrowth}
                        </Badge>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </Card>

            {/* Filters */}
            <Card className="p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-sm text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{filteredGroups.length}</span> groups
                </div>

                <Select defaultValue="popular">
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="recent">Recently Active</SelectItem>
                    <SelectItem value="members">Most Members</SelectItem>
                    <SelectItem value="new">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>

            {/* Groups Grid */}
            <div className="space-y-4">
              {filteredGroups.map((group) => {
                const Icon = group.icon;
                
                return (
                  <Card
                    key={group.id}
                    className="p-4 md:p-6 hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => navigate(`/community/groups/${group.id}`)}
                  >
                    <div className="flex gap-4">
                      {/* Group Icon */}
                      <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${group.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-lg hover:text-primary transition-colors">
                                {group.name}
                              </h3>
                              {group.verified && (
                                <Badge className="bg-blue-500 text-white">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">{group.name_ti}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            {group.privacy === 'public' ? (
                              <Badge variant="secondary" className="flex-shrink-0">
                                <Globe className="w-3 h-3 mr-1" />
                                Public
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="flex-shrink-0">
                                <Lock className="w-3 h-3 mr-1" />
                                Private
                              </Badge>
                            )}
                            {group.trending && (
                              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white flex-shrink-0">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                Hot
                              </Badge>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {group.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            <span className="font-semibold">{group.members.toLocaleString()}</span>
                            <span className="ml-1">members</span>
                          </div>
                          <div className="flex items-center">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            <span className="font-semibold">{group.posts}</span>
                            <span className="ml-1">posts</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>Active {group.recentActivity}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6 border-2 border-primary/20">
                              <AvatarFallback className={`bg-gradient-to-br ${group.color} text-white text-xs font-bold`}>
                                {group.adminAvatar}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-xs">
                              <span className="text-muted-foreground">Admin: </span>
                              <span className="font-semibold">{group.admin}</span>
                            </div>
                          </div>

                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Join Group
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredGroups.length === 0 && (
              <Card className="p-12 text-center">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">No groups found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or create a new group
                </p>
                <Button onClick={() => navigate('/community/create-group')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Group
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>

      <style>{`
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

export default Groups;
