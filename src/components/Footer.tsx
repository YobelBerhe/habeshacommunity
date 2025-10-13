import { useLanguage } from '@/store/language';
import { t } from '@/lib/i18n';

export default function Footer() {
  const { language: lang } = useLanguage();
  
  return (
    <footer className="border-t bg-muted/50 py-8 mt-12 pb-20 md:pb-8">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        © 2025 HabeshaCommunity — Connecting the global Habesha community · Rentals • Jobs • Services • Community
      </div>
    </footer>
  );
}