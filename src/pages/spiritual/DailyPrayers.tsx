import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sun, Moon, UtensilsCrossed, Bed, Sparkles, LucideIcon } from "lucide-react";
import { LanguageSwitcher } from "@/components/spiritual/LanguageSwitcher";
import type { LanguageCode } from "@/types/translations";

const DailyPrayersPage = () => {
  useSEO({ title: "Daily Prayers - HabeshaCommunity", description: "Orthodox prayers in multiple languages" });
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');

  const prayerTypes = [
    { id: 'morning', name: 'Morning', icon: Sun, color: 'text-orange-500' },
    { id: 'evening', name: 'Evening', icon: Moon, color: 'text-blue-500' },
    { id: 'meal', name: 'Meal', icon: UtensilsCrossed, color: 'text-green-500' },
    { id: 'bedtime', name: 'Bedtime', icon: Bed, color: 'text-purple-500' },
    { id: 'special', name: 'Special', icon: Sparkles, color: 'text-yellow-500' },
  ];

  // Mock prayer data - will be replaced with real API calls
  const mockPrayers = {
    en: {
      morning: "O Lord our God, King of the ages, Almighty and All-powerful, who made everything and who transform all things by your will alone...",
      evening: "O Lord our God, if we have sinned against You today in word, deed, or thought, forgive us all...",
      meal: "Bless us, O Lord, and these Thy gifts which we are about to receive from Thy bounty. Through Christ our Lord. Amen.",
      bedtime: "Into Your hands, O Lord, I commend my spirit. Watch over me while I sleep...",
      special: "Our Father, who art in heaven, hallowed be Thy name. Thy kingdom come, Thy will be done...",
    },
    ti: {
      morning: "እግዚኦ አምላክነ፣ ንጉሥ ዘለዓለም፣ ቀዳማዊ ወኃያል፣ ዘገበርከ ኵሎ ወዘትቀይሮ ኵሎ በፈቃድከ...",
      evening: "እግዚኦ አምላክነ፣ ዛሬ በቃል፣ በሥራ፣ ወይም በሐሳብ ከአንተ ጋር የበደልን ከሆነ፣ ሁሉንም ይቅር በለን...",
      meal: "ባርከነ እግዚኦ፣ ንሕናን ነዚ ስጋዕ ኤንዶም ምስጢር እንዳሕላ ከአንተ በረከት። በክርስቶስ እግዚኣችን። አሜን።",
      bedtime: "ኣብ ኢድካ እግዚኦ፣ መንፈስየ ኣስግብ። ኣብ እንቅልፈይ ክትሕሉ...",
      special: "አቡነ ዘበሰማያት፣ ቅዱስ ስምከ። ምልክከ ይምጻእ። ፈቃድከ ኪኮን...",
    },
    am: {
      morning: "እግዚኦ አምላካችን፣ የዘለቄታው ንጉስ፣ ሁሉን ቻይ እና ሁሉን ቻይ፣ በፈቃድህ ብቻ ሁሉን የገበርከው...",
      evening: "እግዚኦ አምላካችን፣ ዛሬ በቃል፣ በሥራ፣ ወይም በሐሳብ ከአንተ ጋር ኃጢአት የሠራን ከሆነ፣ ሁሉንም ይቅር በለን...",
      meal: "ባርከን እግዚኦ፣ እና እነዚህ ከአንተ በረከት ልንቀበላቸው ብሎ እነዚህ ስጦታዎችህን። በክርስቶስ እግዚአብሔር። አሜን።",
      bedtime: "በእጅህ እግዚኦ፣ መንፈሴን አሳልፋለሁ። በእንቅልፌ ጊዜ ጠብቀኝ...",
      special: "አባታችን በሰማያት የሆነ፣ ስምህ ይቀደስ። መንግስትህ ትምጣ። ፈቃድህ በምድር ላይ በሰማይ እንደሚሆነው ይሁን...",
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Daily Prayers 📿</h1>
            <p className="text-muted-foreground">Orthodox prayers for every moment of your day</p>
          </div>
          <LanguageSwitcher
            currentLanguage={currentLanguage}
            onLanguageChange={setCurrentLanguage}
            variant="dropdown"
            showNativeNames
          />
        </div>

        {/* Prayer Types Tabs */}
        <Tabs defaultValue="morning" className="w-full">
          <TabsList className="w-full grid grid-cols-5 h-auto">
            {prayerTypes.map((type) => {
              const Icon = type.icon;
              return (
                <TabsTrigger key={type.id} value={type.id} className="flex-col gap-1 py-3">
                  <Icon className={`h-5 w-5 ${type.color}`} />
                  <span className="text-xs">{type.name}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {prayerTypes.map((type) => {
            const Icon = type.icon;
            return (
              <TabsContent key={type.id} value={type.id} className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className={`h-6 w-6 ${type.color}`} />
                      {type.name} Prayer
                    </CardTitle>
                  <CardDescription>
                    {type.id === 'morning' && 'Begin your day with God'}
                    {type.id === 'evening' && 'End your day in reflection'}
                    {type.id === 'meal' && 'Give thanks before eating'}
                    {type.id === 'bedtime' && 'Rest in God\'s peace'}
                    {type.id === 'special' && 'The Lord\'s Prayer'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      <div className="text-lg leading-relaxed whitespace-pre-wrap">
                        {mockPrayers[currentLanguage][type.id as keyof typeof mockPrayers.en]}
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          );
          })}
        </Tabs>

        {/* Prayer Schedule Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Daily Prayer Schedule</CardTitle>
            <CardDescription>Traditional Orthodox prayer times</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Sun className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="font-medium">Morning Prayer</p>
                  <p className="text-sm text-muted-foreground">Upon waking</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <UtensilsCrossed className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Meal Prayers</p>
                  <p className="text-sm text-muted-foreground">Before each meal</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Evening Prayer</p>
                  <p className="text-sm text-muted-foreground">Before sunset</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Bed className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="font-medium">Bedtime Prayer</p>
                  <p className="text-sm text-muted-foreground">Before sleep</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DailyPrayersPage;
