import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import MentorHeader from '@/components/MentorHeader';
import { Award, Star, Zap, TrendingUp } from 'lucide-react';

export default function BadgesInfo() {
  const navigate = useNavigate();

  const badges = [
    {
      icon: '🥉',
      label: 'Bronze Mentor',
      type: 'Milestone',
      requirement: 'Complete 10 confirmed sessions',
      benefit: 'Shows you\'re an active mentor starting to build experience',
      color: 'from-orange-100 to-orange-50',
      iconComponent: Award,
    },
    {
      icon: '🥈',
      label: 'Silver Mentor',
      type: 'Milestone',
      requirement: 'Complete 50 confirmed sessions',
      benefit: 'Demonstrates consistent mentoring experience and commitment',
      color: 'from-gray-200 to-gray-100',
      iconComponent: TrendingUp,
    },
    {
      icon: '🥇',
      label: 'Gold Mentor',
      type: 'Milestone',
      requirement: 'Complete 100 confirmed sessions',
      benefit: 'Elite status showing extensive mentoring expertise',
      color: 'from-yellow-200 to-yellow-100',
      iconComponent: Award,
    },
    {
      icon: '⭐',
      label: 'Top Rated Mentor',
      type: 'Quality',
      requirement: 'Maintain an average rating of 4.8 or higher',
      benefit: 'Proves exceptional quality and mentee satisfaction',
      color: 'from-yellow-100 to-amber-50',
      iconComponent: Star,
    },
    {
      icon: '⚡',
      label: 'Responsive Mentor',
      type: 'Engagement',
      requirement: 'Consistently reply to messages within 1 hour',
      benefit: 'Shows dedication and quick response time to mentees',
      color: 'from-blue-100 to-blue-50',
      iconComponent: Zap,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <MentorHeader title="Badge System" backPath="/" />
      
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <span className="text-5xl">🏆</span>
            Badge System
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Earn badges to showcase your expertise, build trust with mentees, and increase your visibility in our community.
          </p>
        </div>

        {/* How It Works */}
        <Card className="mb-8 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>
              Badges are automatically awarded as you reach milestones and maintain high standards
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                1
              </div>
              <div>
                <h4 className="font-semibold mb-1">Complete Sessions</h4>
                <p className="text-sm text-muted-foreground">
                  Every confirmed mentoring session counts toward your milestone badges
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold mb-1">Earn Great Reviews</h4>
                <p className="text-sm text-muted-foreground">
                  Provide excellent mentorship to earn high ratings and unlock quality badges
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                3
              </div>
              <div>
                <h4 className="font-semibold mb-1">Get Automatically Awarded</h4>
                <p className="text-sm text-muted-foreground">
                  Badges appear on your profile instantly when you meet the requirements
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badge Cards */}
        <div className="space-y-6 mb-12">
          <h2 className="text-2xl font-bold">Available Badges</h2>
          
          {badges.map((badge) => {
            const IconComponent = badge.iconComponent;
            return (
              <Card 
                key={badge.label}
                className={`bg-gradient-to-br ${badge.color} border-2`}
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">{badge.icon}</div>
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2 mb-1">
                        {badge.label}
                        <IconComponent className="w-5 h-5 text-muted-foreground" />
                      </CardTitle>
                      <div className="inline-block px-2 py-0.5 bg-background/60 rounded-full text-xs font-medium mb-2">
                        {badge.type}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Requirement:</h4>
                    <p className="text-sm text-muted-foreground">{badge.requirement}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Benefit:</h4>
                    <p className="text-sm text-muted-foreground">{badge.benefit}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Benefits Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Why Badges Matter</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-xl">📈</span>
                <div>
                  <strong>Increased Visibility</strong>
                  <p className="text-sm text-muted-foreground">
                    Mentors with more badges appear higher in search results
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">🤝</span>
                <div>
                  <strong>Build Trust</strong>
                  <p className="text-sm text-muted-foreground">
                    Badges provide instant credibility and social proof to potential mentees
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">💪</span>
                <div>
                  <strong>Motivation</strong>
                  <p className="text-sm text-muted-foreground">
                    Clear goals and rewards keep you engaged and growing as a mentor
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">🎯</span>
                <div>
                  <strong>Stand Out</strong>
                  <p className="text-sm text-muted-foreground">
                    Differentiate yourself from other mentors and showcase your achievements
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
          <CardContent className="text-center py-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Earning Badges?</h3>
            <p className="text-muted-foreground mb-6">
              Join our mentoring community and build your reputation through meaningful connections
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button size="lg" onClick={() => navigate('/mentor/onboarding')}>
                Become a Mentor
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/mentor')}>
                Find a Mentor
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
