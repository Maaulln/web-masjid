'use client';
import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { KurbanForm } from '@/components/features/KurbanForm';

export const KurbanWrapper = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="w-full max-w-lg p-1.5 bg-emerald-950/5 ring-1 ring-emerald-950/10 rounded-[2.5rem] animate-pulse">
        <div className="bg-white/50 h-[400px] rounded-[calc(2.5rem-0.375rem)]"></div>
      </div>
    );
  }

  if (session) {
    return <KurbanForm />;
  }

  return (
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
  );
};
