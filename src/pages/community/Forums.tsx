import { useState } from 'react';
import { 
  MessageCircle, Search, Filter, TrendingUp, Clock,
  User, MessageSquare, Pin, Lock, CheckCircle,
  Plus, ArrowRight, ThumbsUp, Eye
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

interface Thread {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  content: string;
  forum: string;
  replies: number;
  views: number;
  likes: number;
  createdAt: string;
  lastReply: string;
  pinned: boolean;
  locked: boolean;
  solved: boolean;
  trending: boolean;
  tags: string[];
}

const Forums = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedForum, setSelectedForum] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const forumCategories = [
    { id: 'all', name: 'All Forums', count: 1234 },
    { id: 'general', name: 'General Discussion', count: 456 },
    { id: 'culture', name: 'Culture & Traditions', count: 234 },
    { id: 'food', name: 'Food & Recipes', count: 189 },
    { id: 'music', name: 'Music & Entertainment', count: 145 },
    { id: 'language', name: 'Language Learning', count: 123 },
    { id: 'travel', name: 'Travel & Tourism', count: 98 },
    { id: 'tech', name: 'Technology', count: 87 },
    { id: 'business', name: 'Business & Career', count: 76 }
  ];

  // Demo threads
  const threads: Thread[] = [
    {
      id: '1',
      title: 'Best cities for Habesha community in North America?',
      author: 'Michael Tesfay',
      authorAvatar: 'MT',
      content: 'I\'m considering relocating and would love to hear recommendations from the community...',
      forum: 'General Discussion',
      replies: 45,
      views: 892,
      likes: 23,
      createdAt: '2024-12-20T10:30:00',
      lastReply: '5 min ago',
      pinned: true,
      locked: false,
      solved: false,
      trending: true,
      tags: ['advice', 'moving', 'community']
    },
    {
      id: '2',
      title: 'How to maintain cultural identity while raising kids abroad?',
      author: 'Sara Mehretab',
      authorAvatar: 'SM',
      content: 'Looking for advice on keeping our children connected to their heritage...',
      forum: 'Culture & Traditions',
      replies: 67,
      views: 1234,
      likes: 45,
      createdAt: '2024-12-20T09:15:00',
      lastReply: '12 min ago',
      pinned: true,
      locked: false,
      solved: false,
      trending: true,
      tags: ['parenting', 'culture', 'identity']
    },
    {
      id: '3',
      title: 'Traditional Zigni recipe - my grandmother\'s version',
      author: 'Daniel Kidane',
      authorAvatar: 'DK',
      content: 'Sharing my family recipe that has been passed down for generations...',
      forum: 'Food & Recipes',
      replies: 34,
      views: 678,
      likes: 56,
      createdAt: '2024-12-20T08:45:00',
      lastReply: '23 min ago',
      pinned: false,
      locked: false,
      solved: false,
      trending: true,
      tags: ['recipe', 'traditional', 'eritrean']
    },
    {
      id: '4',
      title: 'Where to find authentic berbere spice in Europe?',
      author: 'Rahel Woldu',
      authorAvatar: 'RW',
      content: 'I moved to London recently and struggling to find good quality berbere...',
      forum: 'Food & Recipes',
      replies: 23,
      views: 456,
      likes: 12,
      createdAt: '2024-12-20T07:30:00',
      lastReply: '34 min ago',
      pinned: false,
      locked: false,
      solved: true,
      trending: false,
      tags: ['shopping', 'europe', 'spices']
    },
    {
      id: '5',
      title: 'New Ethiopian music releases - January 2025',
      author: 'Solomon Tekle',
      authorAvatar: 'ST',
      content: 'Let\'s share and discuss the latest music from our favorite artists...',
      forum: 'Music & Entertainment',
      replies: 34,
      views: 678,
      likes: 28,
      createdAt: '2024-12-19T18:20:00',
      lastReply: '1 hour ago',
      pinned: false,
      locked: false,
      solved: false,
      trending: false,
      tags: ['music', 'new releases']
    },
    {
      id: '6',
      title: 'Learning Tigrinya as an adult - resources and tips?',
      author: 'Meron Kidane',
      authorAvatar: 'MK',
      content: 'I grew up speaking mostly English and want to improve my Tigrinya...',
      forum: 'Language Learning',
      replies: 56,
      views: 987,
      likes: 34,
      createdAt: '2024-12-19T16:10:00',
      lastReply: '2 hours ago',
      pinned: false,
      locked: false,
      solved: false,
      trending: false,
      tags: ['tigrinya', 'learning', 'resources']
    },
    {
      id: '7',
      title: 'Planning a trip to Eritrea - visa and travel tips',
      author: 'Sophia Abraham',
      authorAvatar: 'SA',
      content: 'First time visiting Eritrea next month, any advice?',
      forum: 'Travel & Tourism',
      replies: 28,
      views: 543,
      likes: 19,
      createdAt: '2024-12-19T14:30:00',
      lastReply: '3 hours ago',
      pinned: false,
      locked: false,
      solved: false,
      trending: false,
      tags: ['travel', 'eritrea', 'visa']
    },
    {
      id: '8',
      title: 'Breaking into tech as a Habesha professional',
      author: 'Isaac Ghebreyesus',
      authorAvatar: 'IG',
      content: 'Career advice and networking opportunities in the tech industry...',
      forum: 'Business & Career',
      replies: 42,
      views: 765,
      likes: 31,
      createdAt: '2024-12-19T12:00:00',
      lastReply: '4 hours ago',
      pinned: false,
      locked: false,
      solved: false,
      trending: false,
      tags: ['career', 'tech', 'advice']
    }
  ];

  const filteredThreads = threads.filter(thread => {
    const matchesSearch = thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         thread.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesForum = selectedForum === 'all' || 
                        thread.forum.toLowerCase().includes(selectedForum);
    return matchesSearch && matchesForum;
  });

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Community Forums</h1>
              <p className="text-base md:text-lg opacity-90">
                Join discussions with the Habesha community
              </p>
            </div>
            <Button
              size="lg"
              onClick={() => navigate('/community/create-thread')}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              <Plus className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">New Thread</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>

          {/* Search */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-full bg-background text-foreground border-0"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <Card className="p-4 sticky top-24">
              <h3 className="font-bold mb-4">Categories</h3>
              <div className="space-y-1">
                {forumCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedForum(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedForum === category.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{category.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>

              <Button className="w-full mt-4" variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </Card>
          </div>

          {/* Main Content - Threads */}
          <div className="lg:col-span-3 space-y-4">
            {/* Filters */}
            <Card className="p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-sm text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{filteredThreads.length}</span> threads
                </div>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="replies">Most Replies</SelectItem>
                    <SelectItem value="views">Most Views</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>

            {/* Threads List */}
            {filteredThreads.map((thread) => (
              <Card
                key={thread.id}
                className="p-4 md:p-6 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => navigate(`/community/thread/${thread.id}`)}
              >
                <div className="flex gap-4">
                  {/* Author Avatar */}
                  <Avatar className="w-10 h-10 md:w-12 md:h-12 border-2 border-primary/20 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold">
                      {thread.authorAvatar}
                    </AvatarFallback>
                  </Avatar>

                  {/* Thread Content */}
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex flex-wrap items-start gap-2 mb-2">
                      {thread.pinned && (
                        <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                          <Pin className="w-3 h-3 mr-1" />
                          Pinned
                        </Badge>
                      )}
                      {thread.locked && (
                        <Badge className="bg-muted text-muted-foreground">
                          <Lock className="w-3 h-3 mr-1" />
                          Locked
                        </Badge>
                      )}
                      {thread.solved && (
                        <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Solved
                        </Badge>
                      )}
                      {thread.trending && (
                        <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-lg mb-2 hover:text-primary transition-colors">
                      {thread.title}
                    </h3>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {thread.forum}
                      </Badge>
                      <span>by {thread.author}</span>
                      <span>•</span>
                      <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* Content Preview */}
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {thread.content}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {thread.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        <span className="font-semibold">{thread.replies}</span>
                        <span className="ml-1">replies</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Eye className="w-4 h-4 mr-1" />
                        <span className="font-semibold">{thread.views}</span>
                        <span className="ml-1">views</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        <span className="font-semibold">{thread.likes}</span>
                      </div>
                      <div className="flex items-center ml-auto text-muted-foreground">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>Last reply {thread.lastReply}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {/* Empty State */}
            {filteredThreads.length === 0 && (
              <Card className="p-12 text-center">
                <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">No threads found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or create a new thread
                </p>
                <Button onClick={() => navigate('/community/create-thread')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Thread
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

export default Forums;
