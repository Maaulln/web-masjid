import React from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { KurbanWrapper } from './KurbanWrapper';

export const metadata = {
  title: 'Pendaftaran Kurban - Masjid Miftahlul Jannah',
  description: 'Daftarkan hewan kurban Anda melalui sistem kami.',
};

export const revalidate = 60;

export default function KurbanPage() {
  return (
    <div className="min-h-[100dvh] bg-[#FDFBF7] text-emerald-950 flex flex-col relative overflow-hidden">
      {/* Noise Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      <Navbar />

      <main className="flex-1 w-full flex flex-col md:flex-row relative z-10 pt-24 md:pt-32">

      {/* Left: Typography & Editorial Split */}
      <div className="w-full md:w-1/2 p-8 md:p-24 flex flex-col justify-center">
        <span className="w-max rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium bg-emerald-950/5 text-emerald-900 mb-8 border border-emerald-950/10">
          Program Tahunan
        </span>
        <h1 className="text-5xl md:text-7xl font-serif text-emerald-950 leading-[1.1] mb-8 tracking-tight">
          Layanan <br className="hidden md:block" /> Kurban.
        </h1>
        <p className="text-xl text-[#787774] font-sans font-light leading-relaxed mb-12 max-w-md">
          Tunaikan ibadah kurban Anda bersama Masjid Miftahlul Jannah. Kami menjamin transparansi, hewan kurban yang sesuai syariat, dan distribusi yang tepat sasaran kepada dhuafa.
        </p>
      </div>

      {/* Right: Registration Form (Double-Bezel Architecture) */}
      <div className="w-full md:w-1/2 p-4 md:p-12 flex items-center justify-center">
        <KurbanWrapper />
      </div>
      </main>

      <Footer />
    </div>
  );
}
