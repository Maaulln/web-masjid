import React from 'react';
import { unstable_cache } from 'next/cache';
import { Navbar } from '@/components/shared/Navbar';
import { KasSummary } from '@/components/features/KasSummary';
import { ActivityCard } from '@/components/features/ActivityCard';
import { HeroParallax } from '@/components/features/HeroParallax';
import { PrayerTimes } from '@/components/features/PrayerTimes';
import { GalleryBento } from '@/components/features/GalleryBento';
import { LocationContact } from '@/components/features/LocationContact';
import { SectionBadge } from '@/components/ui/SectionBadge';
import { Footer } from '@/components/shared/Footer';
import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';

import { prisma } from '@/lib/prisma';

const getCachedFinancialSummary = unstable_cache(
  async () => {
    const reports = await prisma.financialReport.findMany();
    let totalIncome = 0;
    let totalExpense = 0;
    reports.forEach(r => {
      if (r.type === 'INCOME') totalIncome += r.amount;
      else totalExpense += r.amount;
    });
    return { totalIncome, totalExpense, balance: totalIncome - totalExpense };
  },
  ['financial-summary-key'],
  { tags: ['financial-summary'] }
);

export default async function LandingPage() {
  const summary = await getCachedFinancialSummary();
  
  const activeActivities = await prisma.activity.findMany({
    where: {
      endDateTime: { gte: new Date() }
    },
    orderBy: { startDateTime: 'asc' }
  });

  return (
    <div className="min-h-[100dvh] bg-[#FDFBF7] flex flex-col relative overflow-hidden">
      {/* Noise Texture Overlay for Editorial Luxury Vibe */}
      <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      
      <Navbar />
      
      <main className="flex-1 w-full flex flex-col z-10">
        
        <HeroParallax />
        
        <div className="w-full max-w-6xl mx-auto px-6 py-16 md:py-32 flex flex-col gap-16 md:gap-32">
          
          {/* Prayer Times Section */}
          <section>
            <div className="mb-12 flex justify-between items-end">
              <SectionBadge>Jadwal Sholat Hari Ini</SectionBadge>
            </div>
            <PrayerTimes />
          </section>

          {/* Kas Summary Section */}
        <section>
          <div className="mb-12 flex justify-between items-end">
            <SectionBadge>Transparansi Kas</SectionBadge>
          </div>
          <KasSummary {...summary} />
        </section>

        {/* Activities Section */}
        <section>
          <div className="mb-12 flex justify-between items-end">
            <SectionBadge>Jadwal Kegiatan Terdekat</SectionBadge>
          </div>
          {activeActivities.length === 0 ? (
            <div className="p-1.5 bg-emerald-950/5 ring-1 ring-emerald-950/5 rounded-[2rem]">
              <div className="py-24 bg-[#FDFBF7] rounded-[calc(2rem-0.375rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,1)] text-center flex flex-col items-center">
                <span className="text-[#787774] font-medium text-lg font-serif">Belum ada agenda kajian atau kegiatan terdekat.</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {activeActivities.map((act, index) => (
                <ActivityCard key={act.id} {...act} index={index} />
              ))}
            </div>
          )}
        </section>

          {/* Gallery Section */}
          <section>
            <div className="mb-12 flex justify-between items-end">
              <SectionBadge>Galeri Kegiatan</SectionBadge>
            </div>
            <GalleryBento />
          </section>

          {/* Location & Contact Section */}
          <section>
            <div className="mb-12 flex justify-between items-end">
              <SectionBadge>Lokasi & Kontak</SectionBadge>
            </div>
            <LocationContact />
          </section>
        
        </div>
      </main>
      <Footer />
    </div>
  );
}
