import React, { useEffect, memo } from 'react';

const PerformanceMonitor = memo(function PerformanceMonitor() {
  useEffect(() => {
    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.startTime);
        }
        if (entry.entryType === 'first-input') {
          console.log('FID:', entry.processingStart - entry.startTime);
        }
        if (entry.entryType === 'layout-shift') {
          if (!entry.hadRecentInput) {
            console.log('CLS:', entry.value);
          }
        }
      }
    });

    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });

    // Monitor memory usage (if available)
    if ('memory' in performance) {
      const logMemoryUsage = () => {
        const memory = performance.memory;
        console.log('Memory Usage:', {
          used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + ' MB',
          total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + ' MB',
          limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + ' MB'
        });
      };

      // Log memory usage every 30 seconds
      const memoryInterval = setInterval(logMemoryUsage, 30000);
      
      return () => {
        observer.disconnect();
        clearInterval(memoryInterval);
      };
    }

    return () => observer.disconnect();
  }, []);

  // This component doesn't render anything
  return null;
});

export default PerformanceMonitor;
