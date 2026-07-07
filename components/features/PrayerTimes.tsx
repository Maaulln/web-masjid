'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const defaultPrayerTimes = [
  { name: 'Subuh', time: '04:30' },
  { name: 'Dzuhur', time: '11:55' },
  { name: 'Ashar', time: '15:15' },
  { name: 'Maghrib', time: '18:05' },
  { name: 'Isya', time: '19:15' },
];

export const PrayerTimes = () => {
  const [nextPrayerIndex, setNextPrayerIndex] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const calculateNextPrayer = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      let found = false;
      for (let i = 0; i < defaultPrayerTimes.length; i++) {
        const [h, m] = defaultPrayerTimes[i].time.split(':').map(Number);
        if (currentMinutes < h * 60 + m) {
          setNextPrayerIndex(i);
          found = true;
          break;
        }
      }
      if (!found) setNextPrayerIndex(0);
    };

    // Calculate immediately on mount
    calculateNextPrayer();

    // Recalculate every minute to keep the indicator current
    const interval = setInterval(calculateNextPrayer, 60_000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      <div className="flex overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-5 gap-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {defaultPrayerTimes.map((prayer, idx) => {
          const isNext = idx === nextPrayerIndex;
          
          return (
              <motion.div 
              key={prayer.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.32, 0.72, 0, 1] }}
              className={`shrink-0 w-[160px] md:w-auto snap-center md:snap-none p-1.5 ring-1 rounded-[1.5rem] relative overflow-hidden group ${
                isClient && isNext 
                  ? 'bg-emerald-900/10 ring-emerald-900/20' 
                  : 'bg-emerald-950/5 ring-emerald-950/5'
              }`}
            >
              <div className={`h-full p-6 rounded-[calc(1.5rem-0.375rem)] flex flex-col items-center justify-center gap-2 transition-colors duration-500 relative ${
                isClient && isNext 
                  ? 'bg-emerald-900 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]' 
                  : 'bg-[#FDFBF7] shadow-[inset_0_1px_1px_rgba(255,255,255,1)] group-hover:bg-white'
              }`}>
                
                {/* Ping Indicator for Next Prayer */}
                {isClient && isNext && (
                  <span className="absolute top-4 right-5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
                
                <span className={`text-[10px] uppercase tracking-[0.2em] font-bold ${isClient && isNext ? 'text-emerald-400' : 'text-[#787774]'}`}>
                  {prayer.name}
                </span>
                
                <span className={`text-3xl font-sans font-bold tracking-tight ${isClient && isNext ? 'text-white' : 'text-emerald-950'}`}>
                  {prayer.time}
                </span>
                
                {isClient && isNext && (
                  <span className="text-[9px] uppercase tracking-widest text-emerald-100/70 mt-1">Selanjutnya</span>
                )}
                
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
