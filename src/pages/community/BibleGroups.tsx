import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Plus, Users, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type BibleGroup = {
  id: string;
  name: string;
  slug: string;
  description: string;
  group_type: string;
  study_focus: string | null;
  meeting_schedule: string | null;
  language_code: string;
  current_book: string | null;
  current_chapter: number | null;
  member_count: number;
  discussion_count: number;
  is_featured: boolean;
};

export default function BibleGroups() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<BibleGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const { data, error } = await supabase
        .from("bible_study_groups")
        .select("*")
        .eq("is_active", true)
        .order("is_featured", { ascending: false })
        .order("member_count", { ascending: false })
        .limit(20);

      if (error) throw error;
      setGroups(data || []);
    } catch (error: any) {
      toast.error("Failed to load groups");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Bible Study Groups</h1>
            <p className="text-lg md:text-xl opacity-90">
              Join groups to study Scripture together and grow in faith
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Quick Actions */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Active Groups</h2>
          <Button
            onClick={() => navigate("/community/bible-groups/new")}
            className="bg-gradient-to-r from-purple-500 to-indigo-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Group
          </Button>
        </div>

        {/* Groups Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-6 bg-muted rounded mb-4 w-3/4" />
                <div className="h-4 bg-muted rounded mb-2 w-full" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group) => (
              <Card
                key={group.id}
                className="p-6 cursor-pointer hover:shadow-lg transition-all"
                onClick={() => navigate(`/community/bible-groups/${group.slug}`)}
              >
                {group.is_featured && (
                  <Badge className="mb-3 bg-gradient-to-r from-amber-500 to-orange-500">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}

                <h3 className="font-bold text-lg mb-2">{group.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{group.description}</p>

                {group.current_book && (
                  <div className="flex items-center text-sm mb-2">
                    <BookOpen className="w-4 h-4 mr-2 text-primary" />
                    <span>
                      {group.current_book} {group.current_chapter && `Ch. ${group.current_chapter}`}
                    </span>
                  </div>
                )}

                {group.meeting_schedule && (
                  <div className="flex items-center text-sm mb-3 text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-xs">{group.meeting_schedule}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="w-4 h-4 mr-1" />
                    {group.member_count} members
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {group.study_focus || "Bible Study"}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && groups.length === 0 && (
          <Card className="p-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-bold mb-2">No Groups Yet</h3>
            <p className="text-muted-foreground mb-4">Be the first to create a Bible study group</p>
            <Button onClick={() => navigate("/community/bible-groups/new")}>
              <Plus className="w-4 h-4 mr-2" />
              Create Group
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
