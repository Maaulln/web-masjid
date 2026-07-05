import React from 'react';
import Sidebar from '@/components/admin/Sidebar';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Admin Dashboard - Masjid Al-Ikhlas',
  description: 'Sistem Manajemen Masjid Al-Ikhlas',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/unauthorized');
  }

  return (
    <div className="min-h-[100dvh] bg-[#FDFBF7] flex overflow-hidden">
      {/* Noise Texture */}
      <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      
      {/* Sidebar - fixed on desktop */}
      <div className="w-72 p-4 flex flex-col z-20 hidden md:flex">
         <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto z-10 relative">
        {/* Top Header */}
        <header className="h-24 flex items-center justify-between px-6 md:px-10 shrink-0">
          <div className="text-emerald-950 font-bold text-2xl font-serif">
            Panel Administrasi
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#787774] font-medium text-sm hidden sm:block">
              {session.user?.name || 'Administrator'}
            </span>
            <span className="px-4 py-1.5 bg-emerald-950 text-[#FDFBF7] rounded-full font-bold text-[10px] uppercase tracking-widest">
              {session.user?.role}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-6 md:px-10 pb-10">
          {children}
        </main>
      </div>
    </div>
  );
}
