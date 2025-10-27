import { useSEO } from "@/hooks/useSEO";
import { VOTDHero, VOTDCard } from "@/components/spiritual/VerseOfTheDay";
import { useTodayVOTD } from "@/hooks/useSpiritual";
import { Card } from "@/components/ui/card";

const VerseOfTheDayPage = () => {
  useSEO({ title: "Verse of the Day - HabeshaCommunity", description: "Today\'s featured Bible verse" });
  const { votd, isLoading, error } = useTodayVOTD();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="p-6">Failed to load Verse of the Day.</Card>
    </div>
  );

  if (!votd) return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="p-6">No Verse of the Day available for today.</Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
        <VOTDHero votd={votd} />
        <VOTDCard votd={votd} />
      </div>
    </div>
  );
};

export default VerseOfTheDayPage;
