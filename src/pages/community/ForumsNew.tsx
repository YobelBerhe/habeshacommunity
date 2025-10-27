import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, TrendingUp, Plus, Users, MessageCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type ForumCategory = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  topic_count: number;
  post_count: number;
  language_code: string | null;
};

export default function ForumsNew() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("forum_categories")
        .select("*")
        .is("parent_category_id", null)
        .eq("is_active", true)
        .order("display_order");

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Community Forums</h1>
            <p className="text-lg md:text-xl opacity-90">
              Join discussions, ask questions, and connect with the community
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Quick Actions */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Browse Categories</h2>
          <Button
            onClick={() => navigate("/community/forums/new-topic")}
            className="bg-gradient-to-r from-blue-500 to-purple-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Topic
          </Button>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-12 w-12 bg-muted rounded-xl mb-4" />
                <div className="h-6 bg-muted rounded mb-2 w-3/4" />
                <div className="h-4 bg-muted rounded w-full" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="p-6 cursor-pointer hover:shadow-lg transition-all"
                onClick={() => navigate(`/community/forums/${category.slug}`)}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ backgroundColor: category.color || "#3B82F6" + "20" }}
                  >
                    {category.icon || "💬"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg mb-1">{category.name}</h3>
                    {category.description && (
                      <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        {category.topic_count} topics
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {category.post_count} posts
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && categories.length === 0 && (
          <Card className="p-12 text-center">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-bold mb-2">No Categories Yet</h3>
            <p className="text-muted-foreground">Check back later for community discussions</p>
          </Card>
        )}
      </div>
    </div>
  );
}
