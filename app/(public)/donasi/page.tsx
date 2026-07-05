import React from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { SectionBadge } from '@/components/ui/SectionBadge';
import { DonasiForm } from '@/components/features/DonasiForm';

export const metadata = {
  title: 'Donasi Online - Masjid Al-Ikhlas',
  description: 'Salurkan donasi Anda untuk kemakmuran masjid dan umat.',
};

export default function DonasiPage() {
  return (
    <div className="min-h-[100dvh] bg-[#FDFBF7] flex flex-col relative overflow-hidden">
      {/* Noise Texture */}
      <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      <Navbar />
      
      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-24 md:py-32 flex flex-col items-center justify-center relative z-10">
        
        <div className="flex flex-col items-center text-center gap-6 mb-12">
          <SectionBadge>Donasi Online</SectionBadge>
          <h1 className="text-5xl md:text-7xl font-serif text-emerald-950 tracking-tight leading-[1.05]">
            Investasi<br />Akhirat Anda.
          </h1>
          <p className="text-[#787774] mt-2 text-lg md:text-xl font-light max-w-xl leading-relaxed">
            Setiap harta yang disalurkan menjadi pilar kemakmuran masjid dan amal jariyah yang tak terputus bagi Anda.
          </p>
        </div>

        <DonasiForm />

      </main>
      <Footer />
    </div>
  );
}
