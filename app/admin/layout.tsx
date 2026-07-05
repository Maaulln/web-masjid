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
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - fixed on desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
          <div className="text-slate-500 font-medium">
            Panel Administrasi
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-600 font-medium">
              {session.user?.name || 'Administrator'}
            </span>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs">
              {session.user?.role}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
