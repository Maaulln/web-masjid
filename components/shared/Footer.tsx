import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-emerald-950 text-[#FDFBF7] py-32 md:py-40 px-6 mt-32 md:mt-40 rounded-t-[3rem] md:rounded-t-[4rem] relative overflow-hidden">
      
      {/* Soft overlay pattern/gradient */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-900/40 via-transparent to-transparent opacity-60"></div>
      
      <div className="max-w-6xl mx-auto flex flex-col gap-24 md:gap-32 relative z-10">
        
        {/* Top: Massive Typography */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 border-b border-white/10 pb-16 md:pb-24">
          <div className="flex flex-col gap-6 max-w-2xl">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-emerald-400/80">Kemaslahatan Umat</span>
            <h2 className="text-4xl md:text-6xl font-serif tracking-tight leading-[1.2] text-white/90">
              Mari menjadi bagian dari peradaban Islam,<br className="hidden md:block" />dimulai dari Masjid.
            </h2>
          </div>
          
          <Link 
            href="/donasi"
            className="group flex items-center gap-6"
          >
            <span className="text-lg md:text-2xl font-serif italic text-emerald-400/70 group-hover:text-emerald-400 transition-colors">Salurkan Donasi</span>
            <div className="w-16 h-16 rounded-full bg-emerald-900 flex items-center justify-center border border-white/10 transform group-hover:scale-110 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-emerald-50 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
                <path d="M5 19L19 5M19 5V18.5M19 5H5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </Link>
        </div>
        
        {/* Bottom: Asymmetric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 text-sm">
          <div className="md:col-span-4 flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-emerald-950 font-serif font-bold text-xl leading-none">
                M
              </div>
              <span className="font-bold text-lg tracking-tight">Masjid Miftahlul Jannah</span>
            </div>
            <p className="text-white/50 leading-relaxed font-light pr-8">
              Membangun peradaban Islam dari masjid. Transparan, amanah, dan berorientasi pada kemaslahatan umat.
            </p>
          </div>
          
          <div className="md:col-span-2 md:col-start-7 flex flex-col gap-6">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30">Halaman</span>
            <div className="flex flex-col gap-4 font-medium text-white/70">
              <Link href="/" className="hover:text-emerald-400 transition-colors w-max">Beranda</Link>
              <Link href="/transparansi" className="hover:text-emerald-400 transition-colors w-max">Laporan Kas</Link>
              <Link href="/donasi" className="hover:text-emerald-400 transition-colors w-max">Donasi</Link>
            </div>
          </div>
          
          <div className="md:col-span-2 flex flex-col gap-6">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30">Legal</span>
            <div className="flex flex-col gap-4 font-medium text-white/70">
              <Link href="/privacy-policy" className="hover:text-emerald-400 transition-colors w-max">Kebijakan Privasi</Link>
              <Link href="/login" className="hover:text-emerald-400 transition-colors w-max">Login Pengurus</Link>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-white/40 font-mono">
          <p>&copy; {new Date().getFullYear()} Masjid Miftahlul Jannah. Hak Cipta Dilindungi.</p>
        </div>
        
      </div>
    </footer>
  );
};
