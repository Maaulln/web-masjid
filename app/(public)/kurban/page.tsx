import React from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Link from 'next/link';
import { KurbanForm } from '@/components/features/KurbanForm';

export default async function KurbanPage() {
  const session = await getServerSession(authOptions);

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
        {session ? (
          <KurbanForm />
        ) : (
          <div className="w-full max-w-lg p-1.5 bg-emerald-950/5 ring-1 ring-emerald-950/10 rounded-[2.5rem]">
            <div className="bg-white p-10 md:p-14 rounded-[calc(2.5rem-0.375rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,1)] flex flex-col items-center text-center">
              <h2 className="text-2xl font-serif text-emerald-950 mb-4">Silakan Login</h2>
              <p className="text-[#787774] font-light mb-8 max-w-sm">
                Anda perlu masuk ke akun Anda untuk mendaftar layanan Kurban. Jika belum memiliki akun, silakan mendaftar terlebih dahulu.
              </p>
              <Link href="/login?callbackUrl=/kurban" className="px-8 py-4 bg-emerald-950 text-white rounded-full font-bold tracking-widest uppercase text-xs hover:scale-[1.02] transition-transform duration-300">
                Masuk / Daftar
              </Link>
            </div>
          </div>
        )}
      </div>
      </main>

      <Footer />
    </div>
  );
}
