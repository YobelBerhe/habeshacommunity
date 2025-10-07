import { useEffect, useState } from 'react';
import { HardDrive, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCacheSize, clearAllCaches, formatCacheSize } from '@/utils/cacheManagement';
import { toast } from 'sonner';

export function StorageInfo() {
  const [cacheSize, setCacheSize] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCacheSize();
  }, []);

  const loadCacheSize = async () => {
    const size = await getCacheSize();
    setCacheSize(size);
  };

  const handleClearCache = async () => {
    setLoading(true);
    
    try {
      await clearAllCaches();
      await loadCacheSize();
      toast.success('Cache cleared successfully');
      
      // Reload to re-register service worker
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast.error('Failed to clear cache');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-card">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Storage Used</span>
          </div>
          <p className="text-2xl font-bold">{formatCacheSize(cacheSize)}</p>
          <p className="text-xs text-muted-foreground">
            Cached for offline access
          </p>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearCache}
          disabled={loading || cacheSize === 0}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear Cache
        </Button>
      </div>
    </div>
  );
}
