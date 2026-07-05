import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-8 px-6 mt-12 border-t border-slate-800">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 text-white">
          <span>🕌</span>
          <span className="font-bold">Masjid Al-Ikhlas</span>
        </div>
        <div className="flex gap-6 text-sm">
          <Link href="/" className="hover:text-white transition">Beranda</Link>
          <Link href="/donasi" className="hover:text-white transition">Donasi</Link>
          <Link href="/privacy-policy" className="hover:text-white transition text-emerald-400 font-semibold">Kebijakan Privasi</Link>
        </div>
        <p className="text-xs">&copy; {new Date().getFullYear()} Masjid Al-Ikhlas. Hak Cipta Dilindungi.</p>
      </div>
    </footer>
  );
};
