import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Calendar, TrendingUp, Heart, Play, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSEO } from "@/hooks/useSEO";
import { LanguageSwitcher } from "@/components/spiritual/LanguageSwitcher";
import { useTranslation } from "@/hooks/useTranslation";

const SpiritualHome = () => {
  useSEO({ 
    title: "Spiritual Growth - HabeshaCommunity", 
    description: "Read the Bible, join reading plans, and grow in faith" 
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { language, setLanguage, t } = useTranslation();

  const features = [
    {
      icon: BookOpen,
      title: "Bible Reader",
      description: "Read multiple versions in English, Amharic, and Tigrinya",
      path: "/spiritual/reader",
      gradient: "from-blue-500 to-indigo-500",
      stats: "Multiple versions available"
    },
    {
      icon: Calendar,
      title: "Reading Plans",
      description: "Join structured plans to read through the Bible",
      path: "/spiritual/plans",
      gradient: "from-purple-500 to-pink-500",
      stats: "Devotional & topical plans"
    },
    {
      icon: TrendingUp,
      title: "My Progress",
      description: "Track your reading streaks and completed plans",
      path: "/spiritual/progress",
      gradient: "from-green-500 to-emerald-500",
      stats: "Build your streak"
    }
  ];

  const quickActions = [
    {
      label: "Verse of the Day",
      icon: Heart,
      action: () => navigate("/spiritual/votd"),
      color: "text-rose-500"
    },
    {
      label: "Start Reading",
      icon: Play,
      action: () => navigate("/spiritual/reader"),
      color: "text-blue-500"
    },
    {
      label: "Browse Plans",
      icon: Users,
      action: () => navigate("/spiritual/plans"),
      color: "text-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Language Switcher */}
      <div className="container mx-auto px-4 pt-4">
        <div className="flex justify-end">
          <LanguageSwitcher
            currentLanguage={language}
            onLanguageChange={setLanguage}
            variant="compact"
          />
        </div>
      </div>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 text-white py-20 px-4">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-white/20 hover:bg-white/30">
            Faith • Growth • Community
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Grow in Your Faith
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Read the Bible, join plans, and track your spiritual journey
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg"
              onClick={() => navigate("/spiritual/reader")}
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Start Reading
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg bg-white/10 hover:bg-white/20 border-white/30"
              onClick={() => navigate("/spiritual/plans")}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Browse Plans
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <Button
                  key={idx}
                  variant="outline"
                  className="h-auto py-4 justify-start"
                  onClick={action.action}
                >
                  <Icon className={`w-5 h-5 mr-3 ${action.color}`} />
                  <span className="font-semibold">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Access the complete Bible, join structured reading plans, and track your spiritual growth
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={idx}
                  className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  onClick={() => navigate(feature.path)}
                >
                  <CardHeader>
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary" className="text-xs">
                      {feature.stats}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            More Features Coming Soon
          </h3>
          <p className="text-lg text-muted-foreground mb-8">
            We're building highlights, bookmarks, community discussions, and audio Bible
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Badge variant="outline" className="text-sm py-2 px-4">
              Audio Bible
            </Badge>
            <Badge variant="outline" className="text-sm py-2 px-4">
              Verse Highlights
            </Badge>
            <Badge variant="outline" className="text-sm py-2 px-4">
              Bookmarks & Notes
            </Badge>
            <Badge variant="outline" className="text-sm py-2 px-4">
              Group Studies
            </Badge>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SpiritualHome;
