import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';

export function InstallBanner() {
  const { isInstallable, isInstalled, promptInstall } = useInstallPrompt();
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem('install-banner-dismissed') === 'true';
  });
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Show banner after 30 seconds if not dismissed and installable
    if (isInstallable && !isDismissed && !isInstalled) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, [isInstallable, isDismissed, isInstalled]);

  const handleInstall = async () => {
    const success = await promptInstall();
    if (success) {
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setShowBanner(false);
    localStorage.setItem('install-banner-dismissed', 'true');
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50"
      >
        <div className="bg-gradient-to-r from-primary to-purple-600 text-white rounded-2xl shadow-2xl p-6">
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-white/80 hover:text-white"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <img
                src="/lovable-uploads/d2261896-ec85-45d6-8ecf-9928fb132004.png"
                alt="App Icon"
                className="w-10 h-10 rounded-lg"
              />
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">
                Install HabeshaCommunity
              </h3>
              <p className="text-white/90 text-sm mb-4">
                Get the full app experience with offline access and faster loading!
              </p>

              <div className="flex gap-2">
                <Button
                  onClick={handleInstall}
                  className="bg-white text-primary hover:bg-white/90 flex items-center gap-2"
                  size="sm"
                >
                  <Download className="w-4 h-4" />
                  Install App
                </Button>
                <Button
                  onClick={handleDismiss}
                  variant="ghost"
                  className="text-white hover:bg-white/10"
                  size="sm"
                >
                  Not now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
