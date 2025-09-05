import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function AdminSeed() {
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runSeed = async () => {
    setBusy(true);
    setResults(null);
    
    try {
      let counts = { boards: 0, questions: 0, mentors: 0, marketplace: 0 };

      // 1) Seed Forum Boards
      const boards = [
        { slug: 'general', name: 'General' },
        { slug: 'rentals-qa', name: 'Rentals Q&A' },
        { slug: 'jobs-visas', name: 'Jobs & Visas' },
        { slug: 'immigration-legal', name: 'Immigration & Legal' },
        { slug: 'buy-sell-advice', name: 'Buy/Sell Advice' },
        { slug: 'faith-community', name: 'Faith & Community' },
      ];

      for (const board of boards) {
        const { error } = await supabase
          .from('forum_boards')
          .upsert(board, { onConflict: 'slug' });
        if (!error) counts.boards++;
      }

      // 2) Seed Match Questions
      const questions = [
        { text: 'What language do you prefer to speak at home?', choices: ['Tigrinya','Amharic','English','Mixed'], weight: 2 },
        { text: 'How often do you attend faith gatherings?', choices: ['Weekly','Monthly','Only holidays','Rarely/Never'], weight: 2 },
        { text: 'Do you prefer city or quiet suburb life?', choices: ['City','Suburb','Either'], weight: 1 },
        { text: 'How important is extended family involvement?', choices: ['Very','Somewhat','Not important'], weight: 3 },
        { text: 'Diet preferences?', choices: ['No restrictions','Vegetarian','Vegan','Fasting-friendly'], weight: 1 },
        { text: 'Do you drink alcohol?', choices: ['No','Occasionally','Socially','Regularly'], weight: 1 },
        { text: 'Do you want children?', choices: ['Yes','Maybe','No'], weight: 3 },
        { text: 'What is your view on gender roles at home?', choices: ['Traditional','Shared/Modern','Flexible'], weight: 2 },
        { text: 'How do you spend weekends?', choices: ['Family time','Friends/social','Outdoors/sports','Learning/side-projects'], weight: 1 },
        { text: 'How important is cultural tradition in daily life?', choices: ['Very','Somewhat','Not important'], weight: 2 },
        { text: 'Preferred communication style?', choices: ['Direct','Gentle/indirect','Depends'], weight: 1 },
        { text: 'Openness to relocation?', choices: ['Yes','Maybe','No'], weight: 2 },
        { text: 'Financial approach?', choices: ['Save & budget','Balanced','Spend & enjoy'], weight: 2 },
        { text: 'Conflict style?', choices: ['Talk immediately','Cool off then talk','Avoid conflict'], weight: 1 },
        { text: 'How do you feel about inter-denominational relationships?', choices: ['Comfortable','Open','Prefer same','Not comfortable'], weight: 1 },
      ];

      // Check existing questions to avoid duplicates
      const { data: existingQuestions } = await supabase
        .from('match_questions')
        .select('text');
      
      const existingTexts = new Set(existingQuestions?.map(q => q.text) || []);

      for (const question of questions) {
        if (!existingTexts.has(question.text)) {
          const { error } = await supabase
            .from('match_questions')
            .insert(question);
          if (!error) counts.questions++;
        }
      }

      // 3) Get existing users for demo data
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id')
        .limit(3);

      // 4) Seed Demo Mentors (if users exist)
      if (profiles && profiles.length > 0) {
        const demoMentors = [
          { 
            display_name: 'Sara G.', 
            bio: 'Nurse practitioner; wellness and nutrition coaching.', 
            topics: ['health','wellness'], 
            languages: ['ti','en'], 
            city: 'Oakland', 
            country: 'USA', 
            price_cents: 3000, 
            currency: 'USD', 
            rating: 4.9 
          },
          { 
            display_name: 'Mebrahtu T.', 
            bio: 'Software engineer; career and interview prep.', 
            topics: ['tech','career'], 
            languages: ['ti','am','en'], 
            city: 'Seattle', 
            country: 'USA', 
            price_cents: 4000, 
            currency: 'USD', 
            rating: 4.8 
          },
          { 
            display_name: 'Lidya A.', 
            bio: 'Immigration paralegal; document review & guidance.', 
            topics: ['immigration','legal'], 
            languages: ['ti','en'], 
            city: 'Frankfurt', 
            country: 'Germany', 
            price_cents: 2500, 
            currency: 'EUR', 
            rating: 4.7 
          },
        ];

        for (let i = 0; i < Math.min(demoMentors.length, profiles.length); i++) {
          const mentor = { ...demoMentors[i], user_id: profiles[i].id };
          const { error } = await supabase
            .from('mentors')
            .upsert(mentor, { onConflict: 'user_id' });
          if (!error) counts.mentors++;
        }
      }

      // 5) Seed Demo Marketplace Listings
      if (profiles && profiles.length > 0) {
        const demoListings = [
          {
            category: 'marketplace',
            subcategory: 'electronics',
            title: 'Used iPhone 12 — great condition',
            description: 'Lightly used, includes charger. Pick up only.',
            city: 'Addis Ababa',
            country: 'Ethiopia',
            price_cents: 2500000,
            currency: 'ETB',
            images: ['https://picsum.photos/seed/phone/640/400'],
            status: 'active'
          },
          {
            category: 'marketplace',
            subcategory: 'furniture',
            title: 'Wood dining table (4 chairs)',
            description: 'Solid wood, minor scratches.',
            city: 'Frankfurt',
            country: 'Germany',
            price_cents: 12000,
            currency: 'EUR',
            images: ['https://picsum.photos/seed/table/640/400'],
            status: 'active'
          },
          {
            category: 'marketplace',
            subcategory: 'vehicles',
            title: 'Toyota Corolla 2012',
            description: 'Reliable daily driver; maintenance up to date.',
            city: 'Oakland',
            country: 'USA',
            price_cents: 580000,
            currency: 'USD',
            images: ['https://picsum.photos/seed/car/640/400'],
            status: 'active'
          },
        ];

        for (let i = 0; i < Math.min(demoListings.length, profiles.length); i++) {
          const listing = { 
            ...demoListings[i], 
            user_id: profiles[i % profiles.length].id 
          };
          const { error } = await supabase
            .from('listings')
            .insert(listing);
          if (!error) counts.marketplace++;
        }
      }

      setResults(counts);
      toast.success(`Seeded successfully! Boards: ${counts.boards}, Questions: ${counts.questions}, Mentors: ${counts.mentors}, Marketplace: ${counts.marketplace}`);

    } catch (error: any) {
      console.error('Seed error:', error);
      toast.error(`Seed failed: ${error.message}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Seed Demo Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>This will add demo data to make your new areas look populated:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Forum Boards:</strong> 6 global boards (General, Rentals Q&A, etc.)</li>
              <li><strong>Match Questions:</strong> 15 compatibility questions</li>
              <li><strong>Demo Mentors:</strong> 3 sample mentors (if users exist)</li>
              <li><strong>Marketplace Items:</strong> 3 sample listings (if users exist)</li>
            </ul>
            <p className="text-xs text-orange-600">
              Note: Mentors and marketplace items require existing user profiles to work properly.
            </p>
          </div>

          <Button 
            onClick={runSeed} 
            disabled={busy} 
            className="w-full"
            size="lg"
          >
            {busy ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Seeding...
              </>
            ) : (
              'Run Seed'
            )}
          </Button>

          {results && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Seed Results:</h3>
              <pre className="text-sm whitespace-pre-wrap">
                {JSON.stringify(results, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}