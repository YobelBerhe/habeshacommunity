import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trophy, Star, MapPin, Heart } from 'lucide-react';
import MentorHeader from '@/components/MentorHeader';

export default function MatchSuccess() {
  const navigate = useNavigate();

  const stories = [
    {
      couple: 'Daniel & Sara',
      location: 'Washington DC',
      date: 'Married June 2024',
      story: "We matched at 94% compatibility and instantly connected over our shared Orthodox faith and love for community service. After 6 months of getting to know each other with our families' blessing, we knew we had found our life partner. HabeshaCommunity brought us together!",
      image: '💑'
    },
    {
      couple: 'Michael & Meron',
      location: 'Toronto, Canada',
      date: 'Engaged December 2024',
      story: "As two Eritrean professionals living in Canada, we were looking for someone who understood our culture and values. The platform's compatibility matching helped us find each other despite living in different cities. We're now planning our wedding for next summer!",
      image: '💕'
    },
    {
      couple: 'Yohannes & Rahel',
      location: 'San Francisco, CA',
      date: 'Married March 2024',
      story: "We were both hesitant about online dating, but HabeshaCommunity felt different - respectful, family-oriented, and faith-centered. Our families were able to connect through the platform too, which made everything feel right. We're now expecting our first child!",
      image: '👨‍👩‍👦'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <MentorHeader title="Success Stories" backPath="/match/discover" />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-primary text-primary-foreground rounded-2xl p-12 text-center mb-8 border border-border">
          <Trophy className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-3">Success Stories</h1>
          <p className="text-xl text-primary-foreground/80 mb-6">Real love stories from our community</p>
          <div className="flex items-center justify-center space-x-8">
            <div>
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm text-primary-foreground/70">Marriages</div>
            </div>
            <div>
              <div className="text-3xl font-bold">1,200+</div>
              <div className="text-sm text-primary-foreground/70">Engagements</div>
            </div>
            <div>
              <div className="text-3xl font-bold">95%</div>
              <div className="text-sm text-primary-foreground/70">Satisfaction</div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {stories.map((story, idx) => (
            <div key={idx} className="bg-card rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all border border-border">
              <div className="md:flex">
                <div className="md:w-1/3 bg-muted/30 p-12 flex items-center justify-center">
                  <div className="text-8xl">{story.image}</div>
                </div>
                <div className="md:w-2/3 p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold mb-1">{story.couple}</h2>
                      <div className="flex items-center text-muted-foreground space-x-4 text-sm">
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {story.location}
                        </span>
                        <span className="flex items-center">
                          <Heart className="w-4 h-4 mr-1" />
                          {story.date}
                        </span>
                      </div>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-6 h-6 fill-accent text-accent" />
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed mb-6 text-lg italic">
                    &quot;{story.story}&quot;
                  </p>

                  <div className="flex items-center space-x-4">
                    <div className="bg-accent/10 px-4 py-2 rounded-full border border-accent/20">
                      <span className="text-sm font-bold text-accent">✓ Verified Couple</span>
                    </div>
                    <div className="bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                      <span className="text-sm font-bold text-primary">Family Approved</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="bg-primary text-primary-foreground rounded-2xl p-8 text-center mt-8 border border-border">
          <h3 className="text-2xl font-bold mb-3">Your Story Could Be Next!</h3>
          <p className="mb-6 text-primary-foreground/80">Join thousands of Habesha singles finding meaningful connections</p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate('/match/discover')}
          >
            Start Your Journey Today
          </Button>
        </div>
      </div>
    </div>
  );
}
