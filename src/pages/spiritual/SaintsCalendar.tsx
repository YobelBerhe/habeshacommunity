import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Sparkles } from "lucide-react";
import { LanguageSwitcher } from "@/components/spiritual/LanguageSwitcher";
import type { LanguageCode } from "@/types/translations";

const SaintsCalendarPage = () => {
  useSEO({ title: "Saints Calendar - HabeshaCommunity", description: "Orthodox saints and feast days" });
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');

  // Mock data - will be replaced with real API calls
  const todaysSaint = {
    name: 'Saint George the Great Martyr',
    title: 'Dragon Slayer, Patron of Warriors',
    feastDate: 'April 23',
    biography: 'Saint George was a Roman soldier who refused to renounce his Christian faith. He is venerated as a great martyr and is known for his legendary defeat of a dragon, symbolizing the victory of good over evil.',
    significance: 'Symbol of courage and faith, patron saint of warriors.',
  };

  const upcomingSaints = [
    {
      name: 'Saint Michael the Archangel',
      title: 'Chief of the Heavenly Hosts',
      feastDate: 'May 12',
      description: 'Protector of the Church and defeater of evil',
    },
    {
      name: 'The Nine Saints',
      title: 'Monastic Fathers of Ethiopia',
      feastDate: 'May 15',
      description: 'Founders of Ethiopian monasticism and translators of the Bible',
    },
    {
      name: 'Saint Mary',
      title: 'Theotokos, Mother of God',
      feastDate: 'Monthly on 16th',
      description: 'The mother of our Lord, interceding for all humanity',
    },
  ];

  const monthlySaints = [
    { day: 12, name: 'Saint Michael', title: 'Archangel' },
    { day: 16, name: 'Saint Mary', title: 'Mother of God' },
    { day: 27, name: 'Saint Gabriel', title: 'Archangel' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Saints Calendar 👼</h1>
            <p className="text-muted-foreground">Orthodox saints and their feast days</p>
          </div>
          <LanguageSwitcher
            currentLanguage={currentLanguage}
            onLanguageChange={setCurrentLanguage}
            variant="compact"
          />
        </div>

        {/* Today's Saint */}
        <Alert className="mb-6 border-primary bg-primary/5">
          <Sparkles className="h-5 w-5" />
          <AlertTitle className="text-lg font-semibold">Today's Saint</AlertTitle>
          <AlertDescription>
            <div className="mt-3">
              <h3 className="text-xl font-bold mb-1">{todaysSaint.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{todaysSaint.title}</p>
              <Badge className="mb-3">{todaysSaint.feastDate}</Badge>
              <ScrollArea className="h-[120px] pr-4">
                <p className="text-sm leading-relaxed">{todaysSaint.biography}</p>
              </ScrollArea>
              <p className="text-sm font-medium mt-3 text-primary">{todaysSaint.significance}</p>
            </div>
          </AlertDescription>
        </Alert>

        {/* Monthly Saints */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Monthly Commemorations</CardTitle>
            <CardDescription>Saints celebrated monthly on specific dates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {monthlySaints.map((saint) => (
                <div key={saint.day} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-bold text-primary">{saint.day}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{saint.name}</h3>
                      <p className="text-xs text-muted-foreground">{saint.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Saints */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Upcoming Feast Days
          </h2>
          {upcomingSaints.map((saint) => (
            <Card key={saint.name}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{saint.name}</CardTitle>
                    <CardDescription className="mt-1">{saint.title}</CardDescription>
                  </div>
                  <Badge variant="outline">{saint.feastDate}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{saint.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Saints Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Major Saints in Orthodox Tradition</CardTitle>
            <CardDescription>Important saints celebrated in Ethiopian and Eritrean Orthodox Churches</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Archangels</h4>
                <p className="text-sm text-muted-foreground">• Saint Michael (12th of each month)</p>
                <p className="text-sm text-muted-foreground">• Saint Gabriel (27th of each month)</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Major Martyrs</h4>
                <p className="text-sm text-muted-foreground">• Saint George (April 23)</p>
                <p className="text-sm text-muted-foreground">• Saint Tekle Haymanot (August 24)</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Monastic Fathers</h4>
                <p className="text-sm text-muted-foreground">• The Nine Saints (May 15)</p>
                <p className="text-sm text-muted-foreground">• Abune Aregawi (October 14)</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Virgin Mary</h4>
                <p className="text-sm text-muted-foreground">• Monthly (16th of each month)</p>
                <p className="text-sm text-muted-foreground">• Assumption (August 22)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SaintsCalendarPage;
