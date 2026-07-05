'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpenText, UsersThree, MoonStars } from '@phosphor-icons/react/dist/ssr';

interface ActivityProps {
  title: string;
  description?: string | null;
  speaker?: string | null;
  startDateTime: Date;
  endDateTime: Date;
  location: string;
  posterUrl?: string | null;
  index?: number;
}

export const ActivityCard: React.FC<ActivityProps> = ({ title, description, speaker, startDateTime, endDateTime, location, posterUrl, index = 0 }) => {
  
  // Determine icon based on title keywords
  const getCategoryIcon = () => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('subuh') || lowerTitle.includes('malam')) return <MoonStars weight="duotone" className="w-6 h-6 text-emerald-800" />;
    if (lowerTitle.includes('tpa') || lowerTitle.includes('anak') || lowerTitle.includes('remaja')) return <UsersThree weight="duotone" className="w-6 h-6 text-emerald-800" />;
    return <BookOpenText weight="duotone" className="w-6 h-6 text-emerald-800" />;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 64, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.32, 0.72, 0, 1] }}
      whileHover={{ y: -6, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.06)" }}
      className="p-1.5 bg-emerald-950/5 ring-1 ring-emerald-950/5 rounded-[2rem] transition-shadow duration-700"
    >
      <div className="h-full p-8 bg-[#FDFBF7] rounded-[calc(2rem-0.375rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,1)] flex flex-col gap-4 relative group">
        
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center ring-1 ring-emerald-900/10 shrink-0">
              {getCategoryIcon()}
            </div>
            <h4 className="font-serif font-bold text-2xl md:text-3xl text-emerald-950 leading-tight pr-2 pt-1">{title}</h4>
          </div>
          <span className="bg-emerald-900 text-emerald-50 text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full whitespace-nowrap mt-2">Aktif</span>
        </div>
        
        {speaker && <p className="text-sm text-emerald-950 font-medium border-l-[3px] border-emerald-800 pl-3 py-1 mt-1 ml-16">Ustadz: {speaker}</p>}
        
        {description && <p className="text-base text-[#787774] leading-relaxed mt-2">{description}</p>}
        
        {posterUrl && (
          <div className="overflow-hidden rounded-[1rem] mt-4 relative">
            <img 
              src={posterUrl} 
              alt={`Poster Kajian: ${title}`} 
              className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]" 
            />
            <div className="absolute inset-0 bg-emerald-950/5 pointer-events-none rounded-[1rem] ring-1 ring-inset ring-emerald-950/10"></div>
          </div>
        )}
        
        <div className="text-xs text-[#787774] mt-auto pt-6 border-t border-emerald-950/5 font-mono flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <span className="w-16 uppercase text-[10px] tracking-widest text-emerald-950 font-sans font-semibold opacity-60">Mulai</span>
            <span className="text-emerald-950 font-medium">{startDateTime.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-16 uppercase text-[10px] tracking-widest text-emerald-950 font-sans font-semibold opacity-60">Selesai</span>
            <span className="text-emerald-950 font-medium">{endDateTime.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-16 uppercase text-[10px] tracking-widest text-emerald-950 font-sans font-semibold opacity-60">Lokasi</span>
            <span className="text-emerald-950 font-medium">{location}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
