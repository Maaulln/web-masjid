'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export const GalleryBento = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
      
      {/* Top Row */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
        className="md:col-span-8 h-64 md:h-[400px] p-1.5 bg-emerald-950/5 ring-1 ring-emerald-950/5 rounded-[2.5rem] group"
      >
        <div className="w-full h-full rounded-[calc(2.5rem-0.375rem)] overflow-hidden relative shadow-[inset_0_1px_1px_rgba(255,255,255,1)]">
          <Image 
            src="/images/kajian_jamaah.png" 
            alt="Kajian Jamaah" 
            fill
            sizes="(max-width: 768px) 100vw, 66vw"
            className="object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)]" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none flex flex-col justify-end p-8">
            <span className="text-white font-serif text-2xl translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">Majelis Ilmu</span>
          </div>
          <div className="absolute inset-0 ring-1 ring-inset ring-emerald-950/10 rounded-[calc(2.5rem-0.375rem)] pointer-events-none"></div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
        className="md:col-span-4 h-64 md:h-[400px] p-1.5 bg-emerald-950/5 ring-1 ring-emerald-950/5 rounded-[2.5rem] group"
      >
        <div className="w-full h-full rounded-[calc(2.5rem-0.375rem)] overflow-hidden relative shadow-[inset_0_1px_1px_rgba(255,255,255,1)]">
          <Image 
            src="/images/suasana_masjid.png" 
            alt="Arsitektur Masjid" 
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)]" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none flex flex-col justify-end p-8">
            <span className="text-white font-serif text-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">Arsitektur</span>
          </div>
          <div className="absolute inset-0 ring-1 ring-inset ring-emerald-950/10 rounded-[calc(2.5rem-0.375rem)] pointer-events-none"></div>
        </div>
      </motion.div>

      {/* Bottom Row */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
        className="md:col-span-4 h-64 md:h-[300px] p-1.5 bg-emerald-950/5 ring-1 ring-emerald-950/5 rounded-[2.5rem] group"
      >
        <div className="w-full h-full rounded-[calc(2.5rem-0.375rem)] overflow-hidden relative shadow-[inset_0_1px_1px_rgba(255,255,255,1)]">
          <Image 
            src="/images/jamaah_berdoa.png" 
            alt="Jamaah Berdoa" 
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)]" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none flex flex-col justify-end p-8">
            <span className="text-white font-serif text-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">Kekhusyukan</span>
          </div>
          <div className="absolute inset-0 ring-1 ring-inset ring-emerald-950/10 rounded-[calc(2.5rem-0.375rem)] pointer-events-none"></div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.32, 0.72, 0, 1] }}
        className="md:col-span-8 h-64 md:h-[300px] p-1.5 bg-emerald-950/5 ring-1 ring-emerald-950/5 rounded-[2.5rem] group"
      >
        <div className="w-full h-full rounded-[calc(2.5rem-0.375rem)] overflow-hidden relative shadow-[inset_0_1px_1px_rgba(255,255,255,1)]">
          <Image 
            src="/images/anak_mengaji.png" 
            alt="Anak Mengaji" 
            fill
            sizes="(max-width: 768px) 100vw, 66vw"
            className="object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)]" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none flex flex-col justify-end p-8">
            <span className="text-white font-serif text-2xl translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">Generasi Qur&apos;ani</span>
          </div>
          <div className="absolute inset-0 ring-1 ring-inset ring-emerald-950/10 rounded-[calc(2.5rem-0.375rem)] pointer-events-none"></div>
        </div>
      </motion.div>

    </div>
  );
};
