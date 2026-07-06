import React from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Link from 'next/link';

export default async function LayananPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-[100dvh] bg-[#FDFBF7] text-emerald-950 flex flex-col relative overflow-hidden">
      
      <Navbar />

      <main className="flex-1 w-full px-4 py-24 md:px-12 md:py-32">
      <div className="max-w-6xl mx-auto mb-24 md:mb-32 flex flex-col items-center text-center">
        <span className="rounded-full px-4 py-1 text-[10px] uppercase tracking-[0.2em] font-medium bg-emerald-950 text-[#FDFBF7] mb-6">
          Layanan Jamaah
        </span>
        <h1 className="text-5xl md:text-7xl font-serif text-emerald-950 leading-[1.1] mb-8 tracking-tight">
          Fasilitas & Layanan.
        </h1>
        <p className="text-lg md:text-xl text-[#787774] font-sans font-light leading-relaxed max-w-2xl">
          Masjid Miftahlul Jannah tidak hanya menjadi tempat ibadah, tetapi juga pusat kegiatan sosial dan pelayanan umat.
        </p>
      </div>

      {/* The Asymmetrical Bento Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        
        {/* Bento 1: Aula (Large) - Double-Bezel */}
        <div className="md:col-span-8 p-1.5 bg-emerald-950/5 ring-1 ring-emerald-950/10 rounded-[2.5rem] group hover:bg-emerald-950/10 transition-colors duration-700">
          <div className="h-full bg-white p-10 md:p-14 rounded-[calc(2.5rem-0.375rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,1)] flex flex-col justify-between overflow-hidden relative">
            <div className="relative z-10">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#787774] mb-4 block">Fasilitas Ruangan</span>
              <h2 className="text-4xl md:text-5xl font-serif text-emerald-950 mb-6 leading-tight">Peminjaman Aula Serbaguna</h2>
              <p className="text-lg text-[#787774] font-light leading-relaxed max-w-lg mb-12">
                Aula masjid yang luas, nyaman, dan ber-AC dapat digunakan oleh jamaah untuk acara pernikahan (akad), pengajian keluarga, maupun pertemuan warga. Tersedia perlengkapan sound system dan kursi.
              </p>
            </div>

            <div className="relative z-10 flex items-center justify-start">
              {session ? (
                <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="group/btn relative flex items-center gap-4 bg-emerald-950 text-white px-6 py-3 rounded-full font-sans font-semibold tracking-wide transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]">
                  <span>Pesan Jadwal via WhatsApp</span>
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-transform duration-500 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-[1px] group-hover/btn:scale-105">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </a>
              ) : (
                <Link href="/login?callbackUrl=/layanan" className="group/btn relative flex items-center gap-4 bg-white text-emerald-950 border border-emerald-950 px-6 py-3 rounded-full font-sans font-semibold tracking-wide transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-50 active:scale-[0.98]">
                  <span>Login untuk Memesan</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Bento 2: Layanan Jenazah (Tall/Narrow) */}
        <div className="md:col-span-4 p-1.5 bg-emerald-950 ring-1 ring-emerald-950 rounded-[2.5rem] group">
          <div className="h-full bg-emerald-900/50 p-10 rounded-[calc(2.5rem-0.375rem)] flex flex-col justify-between relative overflow-hidden text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
            <div className="relative z-10">
              <span className="text-[10px] uppercase tracking-widest font-bold text-white/50 mb-4 block">Layanan Umat</span>
              <h2 className="text-3xl font-serif mb-6 leading-tight text-white">Layanan Pengurusan Jenazah</h2>
              <p className="text-white/70 font-light leading-relaxed mb-8 text-sm">
                Pelayanan penuh dari memandikan, mengkafani, menyalatkan, hingga pengantaran menggunakan ambulans masjid.
              </p>
              <ul className="space-y-4 mb-12">
                {['Tim Pemandian Berpengalaman', 'Kain Kafan & Perlengkapan', 'Ambulans 24 Jam'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-white/90">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="relative z-10 border-t border-white/10 pt-6">
              <span className="text-[10px] uppercase tracking-widest font-bold text-white/50 block mb-2">Kontak Darurat 24 Jam</span>
              <div className="text-xl font-sans font-medium">0811-2233-4455</div>
            </div>
          </div>
        </div>

      </div>
      </main>

      <Footer />
    </div>
  );
}
