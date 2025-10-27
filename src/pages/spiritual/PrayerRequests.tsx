import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, MessageCircle, Plus, Filter } from "lucide-react";
import { LanguageSwitcher } from "@/components/spiritual/LanguageSwitcher";
import type { LanguageCode } from "@/types/translations";

const PrayerRequestsPage = () => {
  useSEO({ title: "Prayer Requests - HabeshaCommunity", description: "Share and support prayer requests" });
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const [activeTab, setActiveTab] = useState('all');

  // Mock data - will be replaced with real API calls
  const mockPrayers = [
    {
      id: '1',
      title: 'Prayers for healing',
      description: 'Please pray for my mother\'s recovery from surgery',
      category: 'Health',
      prayer_count: 45,
      comment_count: 12,
      created_at: '2 hours ago',
      user_name: 'Sarah M.',
    },
    {
      id: '2',
      title: 'Family unity',
      description: 'Asking for prayers for peace and unity in my family',
      category: 'Family',
      prayer_count: 28,
      comment_count: 8,
      created_at: '5 hours ago',
      user_name: 'John D.',
    },
    {
      id: '3',
      title: 'Job guidance',
      description: 'Seeking prayers for wisdom in career decisions',
      category: 'Work',
      prayer_count: 15,
      comment_count: 5,
      created_at: '1 day ago',
      user_name: 'Anonymous',
    },
  ];

  const categories = ['All', 'Health', 'Family', 'Work', 'Spiritual Growth', 'Guidance', 'Thanksgiving'];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Prayer Requests 🙏</h1>
            <p className="text-muted-foreground">Share your prayers and support others in the community</p>
          </div>
          <LanguageSwitcher
            currentLanguage={currentLanguage}
            onLanguageChange={setCurrentLanguage}
            variant="compact"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Submit Prayer Request
          </Button>
          <Button variant="outline" size="lg" className="gap-2">
            <Filter className="h-5 w-5" />
            Filter
          </Button>
        </div>

        {/* Category Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="w-full flex-wrap h-auto gap-2">
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat.toLowerCase()}>
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="mt-6 space-y-4">
            {mockPrayers.map((prayer) => (
              <Card key={prayer.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">{prayer.title}</CardTitle>
                        <Badge variant="secondary">{prayer.category}</Badge>
                      </div>
                      <CardDescription className="text-base">{prayer.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{prayer.user_name}</span>
                      <span>•</span>
                      <span>{prayer.created_at}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Heart className="h-4 w-4" />
                        {prayer.prayer_count} prayed
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <MessageCircle className="h-4 w-4" />
                        {prayer.comment_count}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">342</CardTitle>
              <CardDescription>Active Prayer Requests</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">1,234</CardTitle>
              <CardDescription>Prayers Offered Today</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">89</CardTitle>
              <CardDescription>Answered Prayers This Week</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrayerRequestsPage;
