'use client';
import React, { useEffect, useRef } from 'react';
import { motion, useSpring, useTransform, useInView } from 'framer-motion';
import { TrendUp, TrendDown, Wallet } from '@phosphor-icons/react/dist/ssr';

interface KasProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

// Internal component for CountUp animation
const CountUpNumber = ({ value }: { value: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const spring = useSpring(0, { mass: 1, stiffness: 40, damping: 15 });
  const display = useTransform(spring, (current) => 
    `Rp ${Math.round(current).toLocaleString('id-ID')}`
  );
  
  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, value, spring]);
  
  return <motion.span ref={ref}>{display}</motion.span>;
};

export const KasSummary: React.FC<KasProps> = ({ totalIncome, totalExpense, balance }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-12">
      
      {/* Saldo Sisa Kas (Bento Main - spans 8 columns) */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
        className="md:col-span-8 p-1.5 bg-emerald-950/5 ring-1 ring-emerald-950/5 rounded-[2.5rem] group"
      >
        <div className="h-full p-10 md:p-14 bg-emerald-900 rounded-[calc(2.5rem-0.375rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] flex flex-col justify-between min-h-[300px] relative overflow-hidden">
          
          {/* Subtle Emerald Highlight */}
          <div className="absolute top-0 right-0 w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-400/30 via-transparent to-transparent opacity-80 pointer-events-none group-hover:scale-105 transition-transform duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)]"></div>
          
          {/* Geometric Watermark */}
          <div 
            className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none bg-repeat"
            style={{ backgroundImage: `url('/images/islamic_pattern.png')`, backgroundSize: '400px' }}
          ></div>
          
          {/* Noise Texture */}
          <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

          {/* Abstract Trend Line Silhouette */}
          <div className="absolute right-0 bottom-0 w-2/3 h-2/3 opacity-10 pointer-events-none mix-blend-plus-lighter transform group-hover:scale-105 group-hover:opacity-15 transition-all duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] translate-x-12 translate-y-8">
            <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="w-full h-full stroke-emerald-50 fill-none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M0,50 L20,35 L40,40 L60,20 L80,25 L100,0" />
              <path d="M0,50 L20,35 L40,40 L60,20 L80,25 L100,0 L100,50 Z" className="fill-emerald-50/20 stroke-none" />
            </svg>
          </div>
          
          {/* Top Section */}
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-5 md:gap-6">
              <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-full bg-emerald-800/50 flex items-center justify-center backdrop-blur-md ring-1 ring-white/10 group-hover:bg-emerald-800/70 transition-colors duration-500">
                <Wallet className="w-7 h-7 md:w-8 md:h-8 text-emerald-100/80" weight="duotone" />
              </div>
              <span className="text-lg md:text-2xl font-bold text-emerald-50 uppercase tracking-[0.15em] drop-shadow-sm">Saldo Sisa Kas</span>
            </div>
            
            <span className="px-4 py-2 rounded-full bg-emerald-950/20 text-emerald-100 text-[10px] font-bold uppercase tracking-[0.2em] backdrop-blur-md shadow-inner ring-1 ring-white/10 hidden md:block">
              Total Keseluruhan
            </span>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col relative z-10 mt-12 md:mt-8">
            <h3 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-sans font-extrabold text-white tracking-tight drop-shadow-md">
              <CountUpNumber value={balance} />
            </h3>
          </div>
        </div>
      </motion.div>

      {/* Pemasukan & Pengeluaran (Bento Sidebar - spans 4 columns, stacks vertically) */}
      <div className="md:col-span-4 flex flex-col gap-6">
        
        {/* Pemasukan Kas */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
          whileHover={{ scale: 0.98, y: -2 }}
          className="flex-1 p-1.5 bg-emerald-950/5 ring-1 ring-emerald-950/5 rounded-[2rem] group"
        >
          <div className="h-full p-8 bg-[#FDFBF7] rounded-[calc(2rem-0.375rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,1)] flex flex-col justify-center relative overflow-hidden">
            <div className="flex justify-between items-center relative z-10 mb-3">
              <div className="flex items-center gap-2">
                <TrendUp weight="bold" className="text-emerald-500 w-4 h-4" />
                <span className="text-xs font-semibold text-[#787774] uppercase tracking-wider">Total Pemasukan</span>
              </div>
              <span className="text-[9px] font-bold text-[#787774] opacity-50 uppercase tracking-widest hidden lg:block">Keseluruhan</span>
            </div>
            <span className="text-2xl md:text-3xl font-sans font-bold text-emerald-950 relative z-10 group-hover:translate-x-1 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
              <CountUpNumber value={totalIncome} />
            </span>
          </div>
        </motion.div>

        {/* Pengeluaran Kas */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
          whileHover={{ scale: 0.98, y: -2 }}
          className="flex-1 p-1.5 bg-emerald-950/5 ring-1 ring-emerald-950/5 rounded-[2rem] group"
        >
          <div className="h-full p-8 bg-[#FDFBF7] rounded-[calc(2rem-0.375rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,1)] flex flex-col justify-center relative overflow-hidden">
            <div className="flex justify-between items-center relative z-10 mb-3">
              <div className="flex items-center gap-2">
                <TrendDown weight="bold" className="text-orange-500/80 w-4 h-4" />
                <span className="text-xs font-semibold text-[#787774] uppercase tracking-wider">Total Pengeluaran</span>
              </div>
              <span className="text-[9px] font-bold text-[#787774] opacity-50 uppercase tracking-widest hidden lg:block">Keseluruhan</span>
            </div>
            <span className="text-2xl md:text-3xl font-sans font-bold text-emerald-950 relative z-10 group-hover:translate-x-1 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
              <CountUpNumber value={totalExpense} />
            </span>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
