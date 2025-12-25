import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/store/auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Users, MapPin, Filter, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
  }, [user]);

  const fetchGroups = async () => {
    try {
      setLoading(true);

      const { data: groupsData, error } = await supabase
        .from('community_groups')
        .select(`
          id,
          name,
          description,
          category,
          cover_image,
          city,
          state,
          is_private,
          created_at
        `)
        .order('created_at', { ascending: false })
        .limit(30);

      if (error) throw error;

      if (!groupsData || groupsData.length === 0) {
        setGroups([]);
        setLoading(false);
        return;
      }

      // Get member counts
      const groupIds = groupsData.map(g => g.id);
      const { data: memberData } = await supabase
        .from('community_group_members')
        .select('group_id, user_id')
        .in('group_id', groupIds)
        .eq('status', 'active');

      const memberMap = new Map<string, number>();
      memberData?.forEach(m => {
        memberMap.set(m.group_id, (memberMap.get(m.group_id) || 0) + 1);
      });

      // Check if user is member
      let userMemberships = new Set<string>();
      if (user) {
        const { data: memberships } = await supabase
          .from('community_group_members')
          .select('group_id')
          .eq('user_id', user.id)
          .eq('status', 'active');
        
        userMemberships = new Set(memberships?.map(m => m.group_id) || []);
      }

      // Format for UI
      const formatted: Group[] = groupsData.map(group => ({
        id: group.id,
        name: group.name,
        description: group.description || '',
        image: group.cover_image || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400',
        members: memberMap.get(group.id) || 1,
        category: group.category || 'Social',
        location: group.city && group.state ? `${group.city}, ${group.state}` : 'Virtual',
        isPrivate: group.is_private || false,
        isMember: userMemberships.has(group.id)
      }));

      setGroups(formatted);
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast.error('Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (groupId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please sign in to join groups');
      return;
    }

    try {
      const group = groups.find(g => g.id === groupId);
      if (!group) return;

      if (group.isMember) {
        // Leave group
        await supabase
          .from('community_group_members')
          .delete()
          .eq('group_id', groupId)
          .eq('user_id', user.id);
        
        toast.success('Left group');
      } else {
        // Join group
        await supabase
          .from('community_group_members')
          .insert({
            group_id: groupId,
            user_id: user.id,
            status: group.isPrivate ? 'pending' : 'active',
            role: 'member'
          });
        
        if (group.isPrivate) {
          toast.success('Join request sent');
        } else {
          toast.success('Joined group!');
        }
      }

      // Refresh groups
      fetchGroups();
    } catch (error) {
      console.error('Error joining group:', error);
      toast.error('Something went wrong');
    }
  };

  const categories = ['All', 'Professional', 'Social', 'Religious', 'Educational', 'Sports', 'Cultural'];

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || group.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex-1 pb-20">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading groups...</p>
          </div>
        </div>
      </div>
    );
  }

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
                  onClick={(e) => handleJoinGroup(group.id, e)}
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