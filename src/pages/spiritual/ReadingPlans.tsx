import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { useSEO } from "@/hooks/useSEO";
import { useReadingPlans } from "@/hooks/useSpiritual";
import { PlansList } from '@/components/spiritual/PlansList';
import { LanguageSwitcher } from "@/components/spiritual/LanguageSwitcher";
import { useTranslation } from "@/hooks/useTranslation";

const ReadingPlans = () => {
  useSEO({ 
    title: "Reading Plans - HabeshaCommunity", 
    description: "Browse and join Bible reading plans" 
  });

  const [page, setPage] = useState(1);
  const { data, count, isLoading, error } = useReadingPlans({ page, per_page: 12 });
  const { language, setLanguage, t } = useTranslation();

  const hasMore = data && count ? data.length < count : false;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-end mb-4">
            <LanguageSwitcher
              currentLanguage={language}
              onLanguageChange={setLanguage}
              variant="compact"
            />
          </div>
          <h1 className="text-5xl font-bold mb-4">{t('reading_plans.title', 'Reading Plans')}</h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Discover guided Bible reading plans to help you grow in your faith. From daily devotionals to
            topical studies, find the perfect plan for your spiritual journey.
          </p>

          <div className="flex flex-wrap gap-8 mt-8">
            <div>
              <div className="text-4xl font-bold">{count || 0}+</div>
              <div className="opacity-90">Total Plans</div>
            </div>
            <div>
              <div className="text-4xl font-bold">50+</div>
              <div className="opacity-90">Topics</div>
            </div>
            <div>
              <div className="text-4xl font-bold">10K+</div>
              <div className="opacity-90">Active Users</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {error ? (
          <Card className="p-6 text-center bg-destructive/10 border-destructive">
            <div className="text-destructive font-semibold mb-2">Failed to load plans</div>
            <p className="text-sm text-muted-foreground">Please try again later</p>
          </Card>
        ) : (
          <PlansList 
            plans={data || []} 
            isLoading={isLoading} 
            onLoadMore={() => setPage(p => p + 1)} 
            hasMore={hasMore} 
          />
        )}
      </div>
    </div>
  );
};

export default ReadingPlans;
