import React from 'react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export const Navbar = async () => {
  const session = await getServerSession(authOptions);
  
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-200/80 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span className="text-2xl" aria-hidden="true">🕌</span>
        <span className="font-bold text-xl text-emerald-800">Masjid Al-Ikhlas</span>
      </div>
      <div className="flex gap-6 items-center font-medium text-slate-700">
        <Link href="/" className="hover:text-emerald-700 transition">Beranda</Link>
        <Link href="/donasi" className="bg-amber-600 hover:bg-amber-700 text-slate-900 px-4 py-2 rounded-md font-extrabold transition focus:ring-2 focus:ring-amber-500">Donasi</Link>
        
        {session ? (
          <Link href="/admin/dashboard" className="border border-emerald-700 text-emerald-700 px-4 py-2 rounded-md hover:bg-emerald-50 transition">Dashboard Admin</Link>
        ) : (
          <Link href="/login" className="border border-slate-300 px-4 py-2 rounded-md hover:bg-slate-50 transition">Login</Link>
        )}
      </div>
    </nav>
  );
};
