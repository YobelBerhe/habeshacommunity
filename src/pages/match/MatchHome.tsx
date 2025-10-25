import { useState } from 'react';
import { 
  Heart, Users, Sparkles, Star, ArrowRight, CheckCircle, 
  MessageCircle, Clock, Shield, Globe, Church, Target,
  TrendingUp, Award, Calendar, Gift, Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const MatchHome = () => {
  const navigate = useNavigate();
  const [stats] = useState({
    activeMembers: '12,847',
    matchesMade: '3,421',
    successStories: '892',
    avgCompatibility: '87%'
  });

  const checkAuthAndNavigate = async (path: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate(`/auth/login?redirect=${path}`);
    } else {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-blue-50/20 dark:via-blue-950/10 to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-blue-950/20 opacity-50" />
        
        {/* Floating Hearts */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <Heart
              key={i}
              className="absolute text-pink-300 dark:text-pink-700 opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 20 + 15}px`,
                animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <Badge className="mb-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Find Your Perfect Match
            </Badge>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Connect With Your Soulmate
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of Habesha singles finding meaningful relationships rooted in 
              <span className="font-semibold text-foreground"> faith, culture, and family values</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg"
                onClick={() => checkAuthAndNavigate('/match/onboarding')}
                className="text-lg px-8 py-6 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 shadow-xl"
              >
                <Heart className="w-5 h-5 mr-2" />
                Start Matching Now
              </Button>

              <Button 
                size="lg"
                variant="outline"
                onClick={() => checkAuthAndNavigate('/match/quiz')}
                className="text-lg px-8 py-6 border-2"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Take Compatibility Quiz
              </Button>
            </div>

            {/* Stats - Horizontal Scroll */}
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide touch-pan-x pb-2 max-w-4xl mx-auto">
              <Card className="flex-shrink-0 snap-start p-4 bg-card/50 backdrop-blur min-w-[180px]">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {stats.activeMembers}
                </div>
                <div className="text-sm text-muted-foreground whitespace-nowrap">Active Members</div>
              </Card>
              <Card className="flex-shrink-0 snap-start p-4 bg-card/50 backdrop-blur min-w-[180px]">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                  {stats.matchesMade}
                </div>
                <div className="text-sm text-muted-foreground whitespace-nowrap">Matches Made</div>
              </Card>
              <Card className="flex-shrink-0 snap-start p-4 bg-card/50 backdrop-blur min-w-[180px]">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                  {stats.successStories}
                </div>
                <div className="text-sm text-muted-foreground whitespace-nowrap">Success Stories</div>
              </Card>
              <Card className="flex-shrink-0 snap-start p-4 bg-card/50 backdrop-blur min-w-[180px]">
                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-1">
                  {stats.avgCompatibility}
                </div>
                <div className="text-sm text-muted-foreground whitespace-nowrap">Avg. Match Score</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Four simple steps to finding your perfect match
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Step 1 */}
            <Card className="p-6 text-center hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-3">
                1
              </div>
              <h3 className="font-bold text-lg mb-2">Create Your Profile</h3>
              <p className="text-sm text-muted-foreground">
                Share your values, faith, and what matters most to you in 7 simple steps
              </p>
            </Card>

            {/* Step 2 */}
            <Card className="p-6 text-center hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-3">
                2
              </div>
              <h3 className="font-bold text-lg mb-2">Take The Quiz</h3>
              <p className="text-sm text-muted-foreground">
                Answer 24 questions to calculate your compatibility with potential matches
              </p>
            </Card>

            {/* Step 3 */}
            <Card className="p-6 text-center hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-3">
                3
              </div>
              <h3 className="font-bold text-lg mb-2">Discover & Match</h3>
              <p className="text-sm text-muted-foreground">
                Browse compatible profiles and connect with people who share your values
              </p>
            </Card>

            {/* Step 4 */}
            <Card className="p-6 text-center hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-3">
                4
              </div>
              <h3 className="font-bold text-lg mb-2">Connect & Meet</h3>
              <p className="text-sm text-muted-foreground">
                Start conversations, involve family, and plan meaningful dates together
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose HabeshaCommunity?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built specifically for the Habesha diaspora with your values in mind
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <Card className="p-6 hover:shadow-xl transition-all">
              <Church className="w-12 h-12 text-purple-600 dark:text-purple-400 mb-4" />
              <h3 className="font-bold text-xl mb-2">Faith-Centered Matching</h3>
              <p className="text-muted-foreground">
                Our algorithm prioritizes faith and spiritual compatibility, ensuring you meet 
                people who share your beliefs and values.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="p-6 hover:shadow-xl transition-all">
              <Users className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="font-bold text-xl mb-2">Family Involvement</h3>
              <p className="text-muted-foreground">
                Share profiles with family for their blessing. Respect traditional values while 
                making modern connections.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="p-6 hover:shadow-xl transition-all">
              <Globe className="w-12 h-12 text-green-600 dark:text-green-400 mb-4" />
              <h3 className="font-bold text-xl mb-2">Cultural Connection</h3>
              <p className="text-muted-foreground">
                Connect with Ethiopians and Eritreans worldwide who understand your heritage, 
                language, and traditions.
              </p>
            </Card>

            {/* Feature 4 */}
            <Card className="p-6 hover:shadow-xl transition-all">
              <Shield className="w-12 h-12 text-amber-600 dark:text-amber-400 mb-4" />
              <h3 className="font-bold text-xl mb-2">Verified Profiles</h3>
              <p className="text-muted-foreground">
                All profiles are verified for authenticity. Meet real people with serious 
                intentions for meaningful relationships.
              </p>
            </Card>

            {/* Feature 5 */}
            <Card className="p-6 hover:shadow-xl transition-all">
              <Target className="w-12 h-12 text-rose-600 dark:text-rose-400 mb-4" />
              <h3 className="font-bold text-xl mb-2">Smart Compatibility</h3>
              <p className="text-muted-foreground">
                Our 24-question quiz analyzes personality, values, lifestyle, and goals to 
                find your ideal match.
              </p>
            </Card>

            {/* Feature 6 */}
            <Card className="p-6 hover:shadow-xl transition-all">
              <Calendar className="w-12 h-12 text-cyan-600 dark:text-cyan-400 mb-4" />
              <h3 className="font-bold text-xl mb-2">Date Planning Tools</h3>
              <p className="text-muted-foreground">
                Culturally appropriate date ideas, from coffee ceremonies to church services, 
                helping you plan meaningful meetings.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Success Stories Preview */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real couples who found love through HabeshaCommunity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Story 1 */}
            <Card className="p-6 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 border-pink-200 dark:border-pink-800">
              <div className="flex items-center space-x-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-foreground mb-4 italic">
                "We matched at 94% compatibility and instantly connected over our shared Orthodox 
                faith. Six months later, we're engaged with both families' blessing!"
              </p>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                <p className="font-semibold">Michael & Sara - Washington DC</p>
              </div>
            </Card>

            {/* Story 2 */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-foreground mb-4 italic">
                "The family mode feature was amazing! My parents reviewed profiles with me and 
                approved before our first meeting. Now we're planning our traditional wedding."
              </p>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <p className="font-semibold">Daniel & Rahel - Toronto</p>
              </div>
            </Card>

            {/* Story 3 */}
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
              <div className="flex items-center space-x-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-foreground mb-4 italic">
                "Long distance didn't stop us! We started with virtual dates and now I'm moving 
                to London. The compatibility quiz really works - we align on everything!"
              </p>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <p className="font-semibold">Solomon & Meron - NYC/London</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              Quick Access
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Card 
                className="p-6 hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => checkAuthAndNavigate('/match/matches')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Browse Matches</h3>
                      <p className="text-sm text-muted-foreground">See compatible profiles</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </Card>

              <Card 
                className="p-6 hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => checkAuthAndNavigate('/match/discover')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Start Swiping</h3>
                      <p className="text-sm text-muted-foreground">Discover new people</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </Card>

              <Card 
                className="p-6 hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => checkAuthAndNavigate('/match/quiz')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Compatibility Quiz</h3>
                      <p className="text-sm text-muted-foreground">Find your match score</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </Card>

              <Card 
                className="p-6 hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => checkAuthAndNavigate('/match/profile/me')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Complete Profile</h3>
                      <p className="text-sm text-muted-foreground">Update your info</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <Card className="p-8 lg:p-12 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Your Perfect Match is Waiting
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of Habesha singles finding meaningful, faith-centered relationships
            </p>
            <Button 
              size="lg"
              onClick={() => checkAuthAndNavigate('/match/onboarding')}
              className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100"
            >
              <Heart className="w-5 h-5 mr-2" />
              Get Started - It's Free
            </Button>
          </Card>
        </div>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }
      `}</style>
    </div>
  );
};

export default MatchHome;
