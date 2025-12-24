import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { ChevronLeft, Book, Heart, Users, ShoppingBag, Calendar, Activity, Loader2 } from 'lucide-react';

const CATEGORIES = [
  { id: 'spiritual', label: 'Spiritual Growth', icon: Book, color: 'bg-spiritual', description: 'Bible, prayers, reading plans' },
  { id: 'match', label: 'Matchmaking', icon: Heart, color: 'bg-match', description: 'Find your life partner' },
  { id: 'mentor', label: 'Mentorship', icon: Users, color: 'bg-mentor', description: 'Get guidance & advice' },
  { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag, color: 'bg-marketplace', description: 'Jobs, housing, products' },
  { id: 'community', label: 'Community', icon: Calendar, color: 'bg-community', description: 'Events, groups, forums' },
  { id: 'health', label: 'Health & Wellness', icon: Activity, color: 'bg-health', description: 'Nutrition, fitness, tracking' },
];

export default function ManageCategories() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [visibleCategories, setVisibleCategories] = useState<string[]>(CATEGORIES.map(c => c.id));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, [user]);

  const fetchPreferences = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('visible_categories, hidden_categories')
        .eq('id', user?.id)
        .single();
      
      if (data) {
        setVisibleCategories(data.visible_categories || CATEGORIES.map(c => c.id));
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setVisibleCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSave = async () => {
    if (visibleCategories.length === 0) {
      toast.error('Please enable at least one category');
      return;
    }

    setSaving(true);

    try {
      const hiddenCategories = CATEGORIES
        .filter(c => !visibleCategories.includes(c.id))
        .map(c => c.id);

      const { error } = await supabase
        .from('profiles')
        .update({
          visible_categories: visibleCategories,
          hidden_categories: hiddenCategories,
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast.success('Categories updated successfully');
      navigate('/hub');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-3xl mx-auto px-4">
          <div className="h-14 flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/hub')}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">Manage Categories</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="mb-6">
          <p className="text-muted-foreground">
            Choose which services you want to see on your home page. You can change these anytime.
          </p>
        </div>

        <div className="space-y-4">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            const isVisible = visibleCategories.includes(category.id);

            return (
              <Card key={category.id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full ${category.color}/10 flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 text-${category.id}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{category.label}</h3>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                  <Switch 
                    checked={isVisible}
                    onCheckedChange={() => toggleCategory(category.id)}
                  />
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 space-y-3">
          <Button 
            className="w-full" 
            onClick={handleSave}
            disabled={saving || visibleCategories.length === 0}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/hub')}
            disabled={saving}
          >
            Cancel
          </Button>
        </div>

        {visibleCategories.length === 0 && (
          <p className="mt-4 text-center text-sm text-destructive">
            Please enable at least one category
          </p>
        )}
      </main>
    </div>
  );
}
