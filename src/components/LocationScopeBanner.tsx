import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  useLocationScope, 
  ALL_COUNTRIES, 
  isoToFlag, 
  CountryItem,
  ScopeSelection 
} from '@/contexts/LocationScopeContext';

const sheetVariants = {
  hidden: { y: '100%' },
  show: { y: 0 },
  exit: { y: '100%' },
};

interface LocationScopeBannerProps {
  className?: string;
}

export const LocationScopeBanner = ({ className }: LocationScopeBannerProps) => {
  const { selection, setSelection, bannerLabel, selectedCountry } = useLocationScope();
  const [open, setOpen] = useState(false);

  const handleSelectCountry = (c: CountryItem) => {
    if (c.code === 'GLOBAL') {
      setSelection({ mode: 'global' });
    } else {
      setSelection({ mode: 'country', countryCode: c.code, countryName: c.name });
    }
  };

  const handleSelectRegion = (regionName: string) => {
    if (selection.mode === 'global') return;
    setSelection({
      mode: 'region',
      countryCode: selection.countryCode,
      countryName: selection.countryName,
      regionName,
    });
  };

  return (
    <>
      {/* Sticky banner */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "w-full bg-gray-800 text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between cursor-pointer hover:bg-gray-700 transition-colors",
          className
        )}
      >
        <span className="text-xs sm:text-sm">
          Connecting the Habesha community in <span className="font-semibold">{bannerLabel}</span>
        </span>
        <ChevronRight className="w-4 h-4 flex-shrink-0" />
      </button>

      {/* Bottom sheet */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Sheet */}
            <motion.div
              className="fixed inset-x-0 bottom-0 z-[60] bg-white rounded-t-3xl shadow-2xl flex flex-col max-w-2xl mx-auto"
              style={{ height: '92vh', maxHeight: '92vh' }}
              variants={sheetVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            >
              {/* Handle bar */}
              <div className="flex justify-center pt-3">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </div>

              {/* Header */}
              <div className="px-4 pt-3 pb-4 border-b flex items-start justify-between">
                <div>
                  <div className="text-lg font-bold text-gray-900">
                    Where is your community today?
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    We'll show events, listings, mentors, matches & groups in that location.
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 flex-shrink-0"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Country list (scroll) */}
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="grid grid-cols-2 gap-3">
                {ALL_COUNTRIES.map((c) => {
                    const isGlobal = c.code === 'GLOBAL';
                    const isSelected =
                      selection.mode === 'global'
                        ? isGlobal
                        : (selection.mode === 'country' || selection.mode === 'region') && c.code === selection.countryCode;

                    const flag = isoToFlag(c.code);

                    return (
                      <motion.button
                        key={c.code}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleSelectCountry(c)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3.5 rounded-full border text-left transition-all",
                          isSelected
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                        )}
                      >
                        <span className="text-xl">{flag}</span>
                        <span className="text-sm font-medium truncate">
                          {c.name}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Selected country details */}
                {selectedCountry?.children?.length ? (
                  <div className="mt-6 pt-6 border-t">
                    <div className="text-sm font-semibold text-gray-800 mb-2">
                      Selected:{' '}
                      <span className="font-bold">
                        {isoToFlag(selectedCountry.code)} {selectedCountry.name}
                      </span>
                    </div>

                    <div className="text-xs text-gray-500 mb-3">
                      Choose a city/state to filter further (optional).
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {selectedCountry.children.map((child) => {
                        const active =
                          selection.mode === 'region' &&
                          selection.regionName === child;

                        return (
                          <motion.button
                            key={child}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSelectRegion(child)}
                            className={cn(
                              "px-4 py-2.5 rounded-full border text-sm font-medium transition-all",
                              active
                                ? "bg-emerald-500 text-white border-emerald-500"
                                : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                            )}
                          >
                            {child}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Footer action */}
              <div className="px-4 py-4 border-t flex items-center justify-between bg-white safe-area-bottom">
                <div className="text-sm text-gray-600">
                  Now viewing: <span className="font-semibold">{bannerLabel}</span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .safe-area-bottom {
          padding-bottom: max(1rem, env(safe-area-inset-bottom));
        }
      `}</style>
    </>
  );
};

export default LocationScopeBanner;
