
import React, { useState, useRef } from 'react';
import { RefreshCw, Check, ArrowDown } from 'lucide-react';

export const PullToRefresh: React.FC<{ onRefresh: () => Promise<void>, children: React.ReactNode }> = ({ onRefresh, children }) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const threshold = 80;
  const maxPull = 150;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY <= 0) {
      startY.current = e.touches[0].pageY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (window.scrollY <= 0 && !isRefreshing) {
      const currentY = e.touches[0].pageY;
      const diff = currentY - startY.current;
      
      if (diff > 0) {
        const damped = Math.min(diff * 0.45, maxPull);
        setPullDistance(damped);
        if (damped > 10 && e.cancelable) {
          e.preventDefault();
        }
      }
    }
  };

  const handleTouchEnd = async () => {
    if (isRefreshing) return;
    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      setPullDistance(threshold);
      await onRefresh();
      setIsRefreshing(false);
    }
    setPullDistance(0);
  };

  const isReady = pullDistance >= threshold;
  const progress = Math.min(pullDistance / threshold, 1);

  return (
    <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} className="relative">
      <div 
        className="absolute w-full flex flex-col items-center pointer-events-none z-0"
        style={{ 
          top: isRefreshing ? '24px' : `${pullDistance - 60}px`,
          opacity: isRefreshing ? 1 : Math.min(pullDistance / 30, 1),
          transition: isRefreshing ? 'none' : 'top 0.1s ease-out, opacity 0.1s ease-out'
        }}
      >
        <div 
          className={`relative p-3 rounded-full shadow-xl border transition-all duration-300 flex items-center justify-center ${
            isRefreshing ? 'bg-indigo-600 border-indigo-500 scale-100' : isReady ? 'bg-emerald-500 border-emerald-400 scale-110 shadow-emerald-200' : 'bg-white border-slate-100 scale-100'
          }`}
        >
          {!isRefreshing && (
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" stroke={isReady ? 'white' : '#e2e8f0'} strokeWidth="2" strokeDasharray={`${progress * 100}, 100`} className="transition-all duration-100" />
            </svg>
          )}
          {isRefreshing ? <RefreshCw className="text-white animate-spin" size={20} /> : isReady ? <Check className="text-white animate-in zoom-in" size={20} strokeWidth={3} /> : <ArrowDown className="text-indigo-600 transition-transform" size={20} style={{ transform: `rotate(${pullDistance * 2}deg)` }} />}
        </div>
      </div>
      <div className="transition-transform duration-300 ease-out" style={{ transform: `translateY(${isRefreshing ? threshold : pullDistance}px)`, transition: pullDistance === 0 ? 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'none' }}>
        {children}
      </div>
    </div>
  );
};
