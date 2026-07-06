import React from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';

const takmirList = [
  { role: 'Ketua Takmir', name: 'Dr. H. Ahmad Sudirman, M.Ag', period: '2024 - 2027' },
  { role: 'Sekretaris', name: 'Budi Santoso, S.Kom', period: '2024 - 2027' },
  { role: 'Bendahara', name: 'Hj. Siti Aminah, S.E', period: '2024 - 2027' },
  { role: 'Bidang Da\'wah & Ibadah', name: 'Ust. Fulan Al-Hafizh', period: '2024 - 2027' },
  { role: 'Bidang Pemeliharaan & Aset', name: 'Ir. Joko Susilo', period: '2024 - 2027' },
  { role: 'Bidang Sosial & ZISWAF', name: 'H. Rahman Hakim', period: '2024 - 2027' },
];

export default function ProfilTakmirPage() {
  return (
    <div className="min-h-[100dvh] bg-[#FDFBF7] text-emerald-950 flex flex-col relative overflow-hidden">
      
      {/* Noise Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <Navbar />

      <main className="flex-1 w-full px-4 py-24 md:px-12 md:py-32">

      <div className="max-w-4xl mx-auto mb-24 md:mb-32 flex flex-col items-center text-center">
        <span className="rounded-full px-4 py-1 text-[10px] uppercase tracking-[0.2em] font-medium bg-emerald-950/5 text-emerald-900 border border-emerald-950/10 mb-6">
          Susunan Pengurus
        </span>
        <h1 className="text-5xl md:text-7xl font-serif text-emerald-950 leading-[1.1] mb-8 tracking-tight">
          Takmir Masjid.
        </h1>
        <p className="text-lg md:text-xl text-[#787774] font-sans font-light leading-relaxed max-w-2xl">
          Mengenal lebih dekat para pelayan rumah Allah yang diamanahkan untuk memakmurkan Masjid Miftahlul Jannah.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {takmirList.map((person, idx) => (
          <div key={idx} className="p-1.5 bg-emerald-950/5 ring-1 ring-emerald-950/5 rounded-[2.5rem] group hover:scale-[1.02] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
            <div className="h-full bg-white p-8 md:p-10 rounded-[calc(2.5rem-0.375rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,1)] flex flex-col relative overflow-hidden">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#787774] mb-8 block">Periode {person.period}</span>
              <h3 className="text-2xl font-serif text-emerald-950 mb-2 leading-snug">{person.name}</h3>
              <p className="text-sm font-medium text-emerald-700/80 uppercase tracking-widest">{person.role}</p>
            </div>
          </div>
        ))}
      </div>
      
      </main>

      <Footer />
    </div>
  );
}
