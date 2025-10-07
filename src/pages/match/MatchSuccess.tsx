import { useState } from 'react';
import { 
  Calendar, MapPin, Coffee, Utensils, Users, Clock, 
  ArrowLeft, Heart, Star, Video, Phone, MessageCircle,
  ChevronRight, Church, Book, Music, Camera, Wine, Film,
  Sparkles, CheckCircle, Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

interface DateIdea {
  id: string;
  type: string;
  title: string;
  description: string;
  icon: any;
  location: string;
  duration: string;
  cost: string;
  culturallyAppropriate: boolean;
}

const MatchDates = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const matchId = searchParams.get('match');
  
  const [step, setStep] = useState(1);
  const [selectedDateType, setSelectedDateType] = useState('');
  const [selectedDate, setSelectedDate] = useState<DateIdea | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const matchName = "Sara Desta"; // Would come from props/params

  const dateIdeas: DateIdea[] = [
    {
      id: '1',
      type: 'coffee',
      title: 'Traditional Coffee Ceremony',
      description: 'Experience a traditional Ethiopian coffee ceremony together. A perfect cultural experience to share stories and connect.',
      icon: Coffee,
      location: 'Ethiopian Restaurant/Cultural Center',
      duration: '1-2 hours',
      cost: '$10-20 per person',
      culturallyAppropriate: true
    },
    {
      id: '2',
      type: 'meal',
      title: 'Dinner at Ethiopian Restaurant',
      description: 'Enjoy authentic cuisine in a comfortable setting. Perfect for longer conversations and getting to know each other.',
      icon: Utensils,
      location: 'Local Ethiopian Restaurant',
      duration: '2-3 hours',
      cost: '$25-40 per person',
      culturallyAppropriate: true
    },
    {
      id: '3',
      type: 'cultural',
      title: 'Church Service Together',
      description: 'Attend a church service and spend time in fellowship. A meaningful way to share your faith together.',
      icon: Church,
      location: 'Local Orthodox Church',
      duration: '2-3 hours',
      cost: 'Free (donation optional)',
      culturallyAppropriate: true
    },
    {
      id: '4',
      type: 'activity',
      title: 'Cultural Museum Visit',
      description: 'Explore Ethiopian or African cultural exhibits and discuss your heritage together.',
      icon: Camera,
      location: 'Museum or Cultural Center',
      duration: '2-3 hours',
      cost: '$15-25 per person',
      culturallyAppropriate: true
    },
    {
      id: '5',
      type: 'community',
      title: 'Community Event',
      description: 'Attend a community gathering, cultural festival, or charity event together.',
      icon: Users,
      location: 'Community Center',
      duration: '2-4 hours',
      cost: 'Varies',
      culturallyAppropriate: true
    },
    {
      id: '6',
      type: 'casual',
      title: 'Coffee Shop Meet-Up',
      description: 'Simple and comfortable first meeting over coffee in a public place.',
      icon: Coffee,
      location: 'Local Coffee Shop',
      duration: '1-2 hours',
      cost: '$5-15 per person',
      culturallyAppropriate: true
    },
    {
      id: '7',
      type: 'cultural',
      title: 'Music & Arts Event',
      description: 'Enjoy traditional Ethiopian music or cultural performance together.',
      icon: Music,
      location: 'Cultural Venue',
      duration: '2-3 hours',
      cost: '$20-40 per person',
      culturallyAppropriate: true
    },
    {
      id: '8',
      type: 'activity',
      title: 'Book Club Discussion',
      description: 'Meet at a library or bookstore to discuss a favorite book or cultural topic.',
      icon: Book,
      location: 'Library or Bookstore',
      duration: '1-2 hours',
      cost: '$5-10 (coffee/snacks)',
      culturallyAppropriate: true
    }
  ];

  const handleSelectDate = (idea: DateIdea) => {
    setSelectedDate(idea);
    setStep(2);
  };

  const handleSendProposal = () => {
    toast.success('Date proposal sent! 📅', {
      description: `${matchName} will be notified about your date idea`
    });
    navigate(`/inbox?user=${matchId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-blue-50/20 dark:via-blue-950/10 to-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => step === 1 ? navigate(-1) : setStep(1)}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Plan a Date</h1>
                <p className="text-xs text-muted-foreground">
                  {step === 1 ? 'Choose an idea' : 'Customize & send'}
                </p>
              </div>
            </div>

            {/* Match Preview */}
            <div className="hidden md:flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-br from-pink-500 to-rose-500 text-white text-sm font-bold">
                  {matchName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{matchName}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Step 1: Choose Date Idea */}
        {step === 1 && (
          <div className="space-y-6">
            {/* Info Banner */}
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
              <div className="flex items-start space-x-3">
                <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-2">Culturally Appropriate Date Ideas</h3>
                  <p className="text-muted-foreground">
                    All suggestions respect Habesha values and traditions. Choose public, comfortable settings 
                    that allow for meaningful conversation and getting to know each other.
                  </p>
                </div>
              </div>
            </Card>

            {/* Date Ideas Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dateIdeas.map((idea) => {
                const Icon = idea.icon;
                
                return (
                  <Card 
                    key={idea.id}
                    className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
                    onClick={() => handleSelectDate(idea)}
                  >
                    <div className="p-6 space-y-4">
                      {/* Icon & Badge */}
                      <div className="flex items-start justify-between">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        {idea.culturallyAppropriate && (
                          <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Appropriate
                          </Badge>
                        )}
                      </div>

                      {/* Content */}
                      <div>
                        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                          {idea.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {idea.description}
                        </p>
                      </div>

                      {/* Details */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span>{idea.location}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span>{idea.duration}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Star className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span>{idea.cost}</span>
                        </div>
                      </div>

                      {/* Action */}
                      <Button 
                        variant="outline" 
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      >
                        Choose This Idea
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Virtual Options */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <Video className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                Virtual Date Options
              </h3>
              <p className="text-muted-foreground mb-4">
                If you're in different locations or prefer to start virtually, these options work great:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <Button variant="outline" className="justify-start">
                  <Video className="w-4 h-4 mr-2" />
                  Video Call
                </Button>
                <Button variant="outline" className="justify-start">
                  <Phone className="w-4 h-4 mr-2" />
                  Phone Call
                </Button>
                <Button variant="outline" className="justify-start">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Extended Chat
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Step 2: Customize & Send */}
        {step === 2 && selectedDate && (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Selected Date Preview */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <selectedDate.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl mb-2">{selectedDate.title}</h3>
                  <p className="text-muted-foreground mb-3">{selectedDate.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      <MapPin className="w-3 h-3 mr-1" />
                      {selectedDate.location}
                    </Badge>
                    <Badge variant="secondary">
                      <Clock className="w-3 h-3 mr-1" />
                      {selectedDate.duration}
                    </Badge>
                    <Badge variant="secondary">
                      <Star className="w-3 h-3 mr-1" />
                      {selectedDate.cost}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* Customize Proposal */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-6">Customize Your Proposal</h3>

              <div className="space-y-6">
                {/* Preferred Time */}
                <div>
                  <Label className="text-base mb-3 block">When would you like to meet?</Label>
                  <RadioGroup value={selectedTime} onValueChange={setSelectedTime}>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-4 border-2 border-border rounded-lg hover:border-primary cursor-pointer transition-colors">
                        <RadioGroupItem value="weekend-morning" id="weekend-morning" />
                        <Label htmlFor="weekend-morning" className="flex-1 cursor-pointer">
                          <div className="font-semibold">Weekend Morning</div>
                          <div className="text-sm text-muted-foreground">Saturday or Sunday, 10am-12pm</div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3 p-4 border-2 border-border rounded-lg hover:border-primary cursor-pointer transition-colors">
                        <RadioGroupItem value="weekend-afternoon" id="weekend-afternoon" />
                        <Label htmlFor="weekend-afternoon" className="flex-1 cursor-pointer">
                          <div className="font-semibold">Weekend Afternoon</div>
                          <div className="text-sm text-muted-foreground">Saturday or Sunday, 2pm-5pm</div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3 p-4 border-2 border-border rounded-lg hover:border-primary cursor-pointer transition-colors">
                        <RadioGroupItem value="weekday-evening" id="weekday-evening" />
                        <Label htmlFor="weekday-evening" className="flex-1 cursor-pointer">
                          <div className="font-semibold">Weekday Evening</div>
                          <div className="text-sm text-muted-foreground">Monday-Friday, 6pm-8pm</div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3 p-4 border-2 border-border rounded-lg hover:border-primary cursor-pointer transition-colors">
                        <RadioGroupItem value="flexible" id="flexible" />
                        <Label htmlFor="flexible" className="flex-1 cursor-pointer">
                          <div className="font-semibold">Flexible</div>
                          <div className="text-sm text-muted-foreground">Open to their schedule</div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* Personal Message */}
                <div>
                  <Label htmlFor="message" className="text-base mb-2 block">
                    Add a Personal Message
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Hi Sara, I think this would be a wonderful way for us to get to know each other better..."
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="min-h-[120px]"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Keep it friendly and respectful. Share why you think this date would be meaningful.
                  </p>
                </div>
              </div>
            </Card>

            {/* Safety Tips */}
            <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
              <h4 className="font-bold mb-3 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-amber-600 dark:text-amber-400" />
                First Date Safety Tips
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Meet in a public place with other people around</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Tell a family member or friend where you're going</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Arrange your own transportation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Keep your phone charged and with you</span>
                </li>
              </ul>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                Choose Different Idea
              </Button>
              <Button
                size="lg"
                onClick={handleSendProposal}
                disabled={!selectedTime}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Proposal
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchDates;
