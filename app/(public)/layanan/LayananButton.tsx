'use client';
import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export const LayananButton = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="px-6 py-3 w-48 h-12 bg-emerald-950/10 rounded-full animate-pulse"></div>;
  }

  if (session) {
    return (
      <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="group/btn relative flex items-center gap-4 bg-emerald-950 text-white px-6 py-3 rounded-full font-sans font-semibold tracking-wide transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]">
        <span>Pesan Jadwal via WhatsApp</span>
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-transform duration-500 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-[1px] group-hover/btn:scale-105">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </a>
    );
  }

  return (
    <Link href="/login?callbackUrl=/layanan" className="group/btn relative flex items-center gap-4 bg-white text-emerald-950 border border-emerald-950 px-6 py-3 rounded-full font-sans font-semibold tracking-wide transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-50 active:scale-[0.98]">
      <span>Login untuk Memesan</span>
    </Link>
  );
};
