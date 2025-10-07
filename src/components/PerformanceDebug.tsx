import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';

export function PerformanceDebug() {
  const [metrics, setMetrics] = useState({
    fps: 0,
    memory: 0,
  });

  useEffect(() => {
    if (import.meta.env.PROD) return;

    let frameCount = 0;
    let lastTime = performance.now();

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        setMetrics(prev => ({
          ...prev,
          fps: Math.round(frameCount * 1000 / (currentTime - lastTime)),
        }));
        
        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(measureFPS);
    };

    measureFPS();

    if ((performance as any).memory) {
      const interval = setInterval(() => {
        const memoryInfo = (performance as any).memory;
        setMetrics(prev => ({
          ...prev,
          memory: Math.round(memoryInfo.usedJSHeapSize / 1048576),
        }));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, []);

  if (import.meta.env.PROD) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-black/80 text-white text-xs p-3 rounded-lg font-mono">
      <div className="flex items-center gap-2 mb-2">
        <Activity className="w-4 h-4" />
        <span className="font-bold">Performance</span>
      </div>
      <div className="space-y-1">
        <div>FPS: {metrics.fps}</div>
        <div>Memory: {metrics.memory} MB</div>
      </div>
    </div>
  );
}
