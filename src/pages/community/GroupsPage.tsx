import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Users, MapPin, Filter } from 'lucide-react';

interface Group {
  id: string;
  name: string;
  description: string;
  image: string;
  members: number;
  category: string;
  location: string;
  isPrivate: boolean;
  isMember: boolean;
}

export default function GroupsPage() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setGroups([
      {
        id: '1',
        name: 'SF Bay Area Habesha Professionals',
        description: 'A community of Ethiopian and Eritrean professionals in the Bay Area',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400',
        members: 847,
        category: 'Professional',
        location: 'San Francisco Bay Area',
        isPrivate: false,
        isMember: true
      },
      {
        id: '2',
        name: 'Habesha Book Club',
        description: 'Monthly discussions of books by African authors and about African history',
        image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400',
        members: 234,
        category: 'Social',
        location: 'Virtual',
        isPrivate: false,
        isMember: false
      },
      {
        id: '3',
        name: 'Orthodox Bible Study Group',
        description: 'Weekly Bible study and spiritual growth for Orthodox Christians',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        members: 456,
        category: 'Religious',
        location: 'Oakland, CA',
        isPrivate: true,
        isMember: true
      },
      {
        id: '4',
        name: 'Habesha Soccer League',
        description: 'Weekend soccer games and tournaments for all skill levels',
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400',
        members: 189,
        category: 'Sports',
        location: 'San Jose, CA',
        isPrivate: false,
        isMember: false
      },
    ]);
  };

  const categories = ['All', 'Professional', 'Social', 'Religious', 'Educational', 'Sports', 'Cultural'];

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || group.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-40 border-b border-border">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Groups</h1>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => navigate('/community/groups/create')}
              >
                <Plus className="h-4 w-4 mr-1" />
                Create
              </Button>
              <Button variant="ghost" size="icon">
                <Filter className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              className="shrink-0"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Results */}
        <p className="text-sm text-muted-foreground">
          {filteredGroups.length} groups found
        </p>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredGroups.map((group) => (
            <Card
              key={group.id}
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/community/groups/${group.id}`)}
            >
              {/* Image */}
              <div className="relative h-32">
                <img
                  src={group.image}
                  alt={group.name}
                  className="w-full h-full object-cover"
                />
                {group.isPrivate && (
                  <Badge className="absolute top-2 right-2 bg-secondary">Private</Badge>
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold line-clamp-2">{group.name}</h3>
                  {group.isMember && (
                    <Badge variant="outline" className="shrink-0">Member</Badge>
                  )}
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {group.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {group.members.toLocaleString()} members
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {group.location}
                  </div>
                </div>

                <Button
                  className="w-full"
                  variant={group.isMember ? 'outline' : 'default'}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {group.isMember ? 'View Group' : 'Join Group'}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredGroups.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No groups found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
