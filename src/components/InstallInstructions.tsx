import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Share, MoreVertical, Plus, Download } from 'lucide-react';

interface InstallInstructionsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InstallInstructions({ open, onOpenChange }: InstallInstructionsProps) {
  const [platform] = useState(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) return 'ios';
    if (/android/.test(ua)) return 'android';
    if (/mac/.test(ua)) return 'mac';
    if (/win/.test(ua)) return 'windows';
    return 'other';
  });

  const instructions = {
    ios: {
      title: 'Install on iPhone/iPad',
      steps: [
        { icon: Share, text: 'Tap the Share button in Safari' },
        { icon: Plus, text: 'Scroll down and tap "Add to Home Screen"' },
        { icon: Download, text: 'Tap "Add" to install the app' },
      ],
    },
    android: {
      title: 'Install on Android',
      steps: [
        { icon: MoreVertical, text: 'Tap the menu button (three dots)' },
        { icon: Download, text: 'Tap "Install app" or "Add to Home screen"' },
        { icon: Plus, text: 'Confirm to install' },
      ],
    },
    mac: {
      title: 'Install on Mac',
      steps: [
        { icon: Share, text: 'Click the Share button in Safari toolbar' },
        { icon: Plus, text: 'Select "Add to Dock"' },
        { icon: Download, text: 'Confirm to add to Dock' },
      ],
    },
    windows: {
      title: 'Install on Windows',
      steps: [
        { icon: Download, text: 'Click the install icon in the address bar' },
        { icon: Plus, text: 'Click "Install" in the popup' },
        { icon: Download, text: 'App will be added to Start Menu' },
      ],
    },
    other: {
      title: 'Install App',
      steps: [
        { icon: Download, text: 'Look for the install button in your browser' },
        { icon: Plus, text: 'Click "Install" when prompted' },
        { icon: Download, text: 'App will be installed to your device' },
      ],
    },
  };

  const current = instructions[platform];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{current.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {current.steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 pt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <p className="text-sm font-medium">{step.text}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Button onClick={() => onOpenChange(false)} className="w-full">
          Got it
        </Button>
      </DialogContent>
    </Dialog>
  );
}
