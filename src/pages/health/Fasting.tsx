// src/pages/health/Fasting.tsx
// Complete Orthodox Fasting Page

import { useSEO } from '@/hooks/useSEO';
import { FastingTracker } from '@/components/health/FastingTracker';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, BookOpen, Users, Share2 } from 'lucide-react';

export default function FastingPage() {
  useSEO({
    title: 'Orthodox Fasting Tracker | HabeshaCommunity Health',
    description: 'Track your Orthodox Ethiopian/Eritrean fasting periods with traditional meal recommendations and community support'
  });

  return (
    <>

      <div className="min-h-screen bg-gradient-to-b from-background via-purple-50/30 dark:via-purple-950/10 to-background">
        {/* Header */}
        <section className="border-b bg-background/95 backdrop-blur-lg sticky top-14 z-40">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                  <span className="text-4xl">🙏</span>
                  Orthodox Fasting Tracker
                </h1>
                <p className="text-muted-foreground">
                  Stay connected to your faith through mindful fasting
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
              <Calendar className="w-6 h-6" />
              <span className="text-sm">Full Calendar</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
              <BookOpen className="w-6 h-6" />
              <span className="text-sm">Fasting Guide</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
              <Users className="w-6 h-6" />
              <span className="text-sm">Join Community</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
              <Share2 className="w-6 h-6" />
              <span className="text-sm">Share Progress</span>
            </Button>
          </div>
        </section>

        {/* Main Fasting Tracker */}
        <section className="container mx-auto px-4 py-8">
          <FastingTracker />
        </section>

        {/* About Orthodox Fasting */}
        <section className="container mx-auto px-4 py-8">
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">About Orthodox Fasting</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-xl">📜</span>
                    Spiritual Significance
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Orthodox fasting is a sacred practice that strengthens our connection with God through self-discipline and prayer. It's not just about food restrictions, but about spiritual growth and communion with the divine.
                  </p>

                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-xl">🌱</span>
                    Health Benefits
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Traditional Orthodox fasting promotes plant-based eating, intermittent fasting, and mindful consumption - all scientifically proven to support metabolic health, longevity, and overall wellness.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-xl">🇪🇹</span>
                    Habesha Tradition
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Ethiopian and Eritrean Orthodox Christians have maintained this ancient practice for centuries, developing rich culinary traditions around fasting foods. Traditional dishes like Shiro, Misir Wat, and Gomen are both spiritually meaningful and nutritionally complete.
                  </p>

                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-xl">👥</span>
                    Community Support
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Fasting together strengthens community bonds. Join thousands of Habesha community members who support each other through prayer, shared meals, and encouragement during fasting periods.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 py-16">
          <Card className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white border-0">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Join the Fasting Community
              </h2>
              <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                Connect with thousands of Orthodox Christians who are strengthening their faith through traditional fasting practices
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-gray-100"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Join Community Group
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Download Fasting Guide
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}
