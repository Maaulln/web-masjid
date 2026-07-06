'use client';
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { SectionBadge } from '@/components/ui/SectionBadge';

export const HeroParallax = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  // Create parallax effect: image moves 20% slower than scroll
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  
  return (
    <section ref={containerRef} className="w-full min-h-[90vh] pt-24 pb-12 flex flex-col md:flex-row items-center gap-12 md:gap-16 px-6 max-w-7xl mx-auto overflow-hidden">
      
      {/* Typography Block - Left */}
      <div className="flex-1 flex flex-col items-start gap-8 z-10 pt-12 md:pt-0">
        <SectionBadge>Transparansi & Dakwah</SectionBadge>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-emerald-950 tracking-tight leading-[1.05]">
          Pusat Ibadah<br />& Kemaslahatan.
        </h1>
        <p className="text-[#787774] text-lg md:text-xl max-w-md leading-relaxed mt-2 font-sans font-light">
          Masjid Miftahlul Jannah menyajikan transparansi penuh atas dana umat, jadwal kajian rutin, dan kemudahan layanan secara langsung.
        </p>
        
        <div className="mt-8 flex gap-6 items-center flex-wrap">
          <div className="p-1.5 bg-emerald-950/5 ring-1 ring-emerald-950/5 rounded-[2.5rem] group hover:scale-[0.98] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.95]">
            <Link 
              href="/donasi"
              className="flex items-center gap-4 py-2 pl-6 pr-2 bg-emerald-900 text-[#FDFBF7] rounded-[calc(2.5rem-0.375rem)] font-sans font-medium text-lg tracking-wide shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]"
            >
              <span>Donasi Sekarang</span>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transform group-hover:translate-x-1 group-hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
                <ArrowRight weight="bold" className="text-white w-5 h-5" />
              </div>
            </Link>
          </div>
          
          <Link href="/transparansi" className="text-emerald-950 font-semibold text-sm uppercase tracking-widest hover:opacity-60 transition-opacity">
            Laporan Kas &rarr;
          </Link>
        </div>
      </div>
      
      {/* Visual Block - Right */}
      <div className="flex-1 w-full relative h-[50vh] md:h-[80vh] p-2 bg-emerald-950/5 rounded-[2.5rem] ring-1 ring-emerald-950/5 overflow-hidden group mt-12 md:mt-0">
        <div className="w-full h-full rounded-[calc(2.5rem-0.5rem)] overflow-hidden relative shadow-[inset_0_1px_1px_rgba(255,255,255,1)] bg-[#FDFBF7]">
          {/* Parallax Image container */}
          <motion.div 
            style={{ y }} 
            className="absolute inset-0 w-full h-[120%] origin-top"
          >
            <Image 
              src="/images/mosque_interior.png"
              alt="Mosque Interior"
              fill
              priority
              className="object-cover object-center"
            />
          </motion.div>
          {/* Subtle Inner Shadow to mimic bezel depth */}
          <div className="absolute inset-0 ring-1 ring-inset ring-emerald-950/10 rounded-[calc(2.5rem-0.5rem)] pointer-events-none z-10"></div>
          
          {/* Soft gradient overlay for extra depth at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none z-0"></div>
        </div>
      </div>
    </section>
  );
};
