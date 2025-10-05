import { useNavigate } from 'react-router-dom';
import { Calendar, Church, Coffee, Book, MapPin, Home, Shield, Check } from 'lucide-react';
import MentorHeader from '@/components/MentorHeader';

export default function MatchDates() {
  const navigate = useNavigate();

  const dateIdeas = [
    {
      category: 'Faith-Based',
      icon: Church,
      ideas: [
        { name: 'Church Service Together', description: 'Attend Sunday service and discuss the sermon over coffee', time: 'Sunday morning' },
        { name: 'Prayer Walk in Park', description: 'Nature walk with reflection and spiritual conversation', time: '1-2 hours' },
        { name: 'Bible Study Café', description: 'Meet at a quiet café to study scripture together', time: 'Evening' }
      ]
    },
    {
      category: 'Cultural',
      icon: Coffee,
      ideas: [
        { name: 'Ethiopian Coffee Ceremony', description: 'Traditional coffee ceremony at an Ethiopian restaurant', time: '2-3 hours' },
        { name: 'Cultural Festival', description: 'Attend Habesha cultural events or festivals', time: 'Full day' },
        { name: 'Traditional Restaurant', description: 'Dinner at an authentic Eritrean/Ethiopian restaurant', time: 'Evening' }
      ]
    },
    {
      category: 'Creative & Educational',
      icon: Book,
      ideas: [
        { name: 'Museum Visit', description: 'Explore African art or history museum together', time: 'Afternoon' },
        { name: 'Bookstore & Café', description: 'Browse books and discuss over tea', time: '2-3 hours' },
        { name: 'Cooking Class', description: 'Learn to cook traditional dishes together', time: '3-4 hours' }
      ]
    },
    {
      category: 'Outdoor & Active',
      icon: MapPin,
      ideas: [
        { name: 'Park Picnic', description: 'Pack traditional food for an outdoor meal', time: 'Afternoon' },
        { name: 'Botanical Garden', description: 'Peaceful walk and conversation in nature', time: '2-3 hours' },
        { name: 'Community Service', description: 'Volunteer together at a local charity', time: 'Half day' }
      ]
    },
    {
      category: 'Family-Friendly',
      icon: Home,
      ideas: [
        { name: 'Family Gathering', description: 'Meet for coffee with family members present', time: 'Afternoon' },
        { name: 'Community Center Event', description: 'Attend Habesha community gatherings together', time: 'Evening' },
        { name: 'Group Dinner', description: 'Double date with another couple or family', time: 'Evening' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <MentorHeader title="Date Planning" backPath="/match/discover" />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-primary text-primary-foreground rounded-2xl p-8 mb-8 border border-border">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-primary-foreground/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Calendar className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Respectful Date Ideas</h1>
              <p className="text-primary-foreground/80">
                Culturally appropriate, faith-respecting date suggestions that honor our values. 
                All ideas encourage meaningful connection in safe, family-friendly environments.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {dateIdeas.map((category, idx) => (
            <div key={idx}>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <category.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-bold">{category.category}</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {category.ideas.map((idea, ideaIdx) => (
                  <div key={ideaIdx} className="bg-card rounded-2xl shadow-md p-6 hover:shadow-lg transition-all border-2 border-border hover:border-primary">
                    <h3 className="font-bold mb-2">{idea.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{idea.description}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{idea.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Guidelines */}
        <div className="bg-accent/10 rounded-2xl p-8 mt-8 border border-accent/20">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <Shield className="w-6 h-6 mr-2 text-accent" />
            Dating Guidelines for Respectful Connections
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start">
                <Check className="w-5 h-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Meet in public, well-lit places</span>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Include family when appropriate</span>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Keep dates modest and respectful</span>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Communicate intentions clearly</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start">
                <Check className="w-5 h-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Share location with trusted person</span>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Honor cultural and religious boundaries</span>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Build friendship before romance</span>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Prioritize meaningful conversation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
