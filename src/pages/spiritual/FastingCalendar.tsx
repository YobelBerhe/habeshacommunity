import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar, Info, Utensils } from "lucide-react";
import { LanguageSwitcher } from "@/components/spiritual/LanguageSwitcher";
import type { LanguageCode } from "@/types/translations";

const FastingCalendarPage = () => {
  useSEO({ title: "Fasting Calendar - HabeshaCommunity", description: "Orthodox fasting periods and guidelines" });
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');

  // Mock data - will be replaced with real API calls
  const isFastingToday = true;
  const todaysFast = {
    name: 'Wednesday Fast',
    type: 'Weekly Fast',
    level: 'No Animal Products',
    restricted: ['meat', 'dairy', 'eggs'],
    allowed: ['vegetables', 'fruits', 'grains', 'legumes'],
  };

  const upcomingFasts = [
    {
      name: 'Great Lent (Hudade)',
      type: 'Major Fast',
      startDate: 'March 3, 2025',
      endDate: 'April 27, 2025',
      duration: '55 days',
      level: 'Complete Fast',
      description: 'The most important fasting period before Easter',
    },
    {
      name: "Apostles' Fast",
      type: 'Major Fast',
      startDate: 'June 9, 2025',
      endDate: 'June 28, 2025',
      duration: '19 days',
      level: 'No Animal Products',
      description: 'Fast in honor of the Holy Apostles',
    },
    {
      name: 'Fast of the Assumption',
      type: 'Major Fast',
      startDate: 'August 7, 2025',
      endDate: 'August 21, 2025',
      duration: '15 days',
      level: 'No Animal Products',
      description: 'Before the Feast of the Assumption of Mary',
    },
  ];

  const weeklyFasts = [
    { day: 'Wednesday', reason: 'Betrayal of Christ', level: 'No Animal Products' },
    { day: 'Friday', reason: 'Crucifixion of Christ', level: 'No Animal Products' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Fasting Calendar 📅</h1>
            <p className="text-muted-foreground">Orthodox fasting periods and guidelines</p>
          </div>
          <LanguageSwitcher
            currentLanguage={currentLanguage}
            onLanguageChange={setCurrentLanguage}
            variant="compact"
          />
        </div>

        {/* Today's Fast Status */}
        {isFastingToday && (
          <Alert className="mb-6 border-primary bg-primary/5">
            <Calendar className="h-5 w-5" />
            <AlertTitle className="text-lg font-semibold">Today is a Fasting Day</AlertTitle>
            <AlertDescription>
              <div className="mt-2 space-y-2">
                <p className="font-medium">{todaysFast.name} - {todaysFast.level}</p>
                <div className="flex flex-wrap gap-2">
                  <div>
                    <span className="text-sm font-medium">Restricted: </span>
                    {todaysFast.restricted.map((item) => (
                      <Badge key={item} variant="destructive" className="mr-1">
                        {item}
                      </Badge>
                    ))}
                  </div>
                  <div>
                    <span className="text-sm font-medium">Allowed: </span>
                    {todaysFast.allowed.map((item) => (
                      <Badge key={item} variant="secondary" className="mr-1">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Weekly Fasts */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Weekly Fasts</CardTitle>
            <CardDescription>Regular fasting days throughout the year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {weeklyFasts.map((fast) => (
                <div key={fast.day} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{fast.day}</h3>
                    <Badge>{fast.level}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{fast.reason}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Major Fasts */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Upcoming Major Fasts</h2>
          {upcomingFasts.map((fast) => (
            <Card key={fast.name}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{fast.name}</CardTitle>
                    <CardDescription className="mt-1">{fast.description}</CardDescription>
                  </div>
                  <Badge variant={fast.type === 'Major Fast' ? 'default' : 'secondary'}>
                    {fast.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Duration</p>
                    <p className="text-lg">{fast.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                    <p className="text-lg">{fast.startDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">End Date</p>
                    <p className="text-lg">{fast.endDate}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Badge variant="outline">{fast.level}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Fasting Guidelines */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Fasting Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-semibold mb-1">Complete Fast</h4>
              <p className="text-sm text-muted-foreground">
                No meat, dairy, eggs, or fish. Only plant-based foods and water.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">No Animal Products</h4>
              <p className="text-sm text-muted-foreground">
                No meat, dairy, or eggs. Fish may be allowed on certain days.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Fish Allowed</h4>
              <p className="text-sm text-muted-foreground">
                No meat, dairy, or eggs, but fish is permitted.
              </p>
            </div>
            <Alert className="mt-4">
              <Utensils className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Always consult with your spiritual father or priest regarding fasting requirements, especially if you have health concerns.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FastingCalendarPage;
