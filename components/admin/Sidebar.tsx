'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Wallet, HeartHandshake, CalendarClock, GitPullRequestDraft, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

const menuItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Keuangan', href: '/admin/keuangan', icon: Wallet },
  { name: 'Donasi', href: '/admin/donasi', icon: HeartHandshake },
  { name: 'Kegiatan', href: '/admin/kegiatan', icon: CalendarClock },
  { name: 'Qurban', href: '/admin/qurban', icon: GitPullRequestDraft },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-emerald-900 text-white min-h-screen flex flex-col shadow-xl">
      <div className="p-6 border-b border-emerald-800">
        <h1 className="text-2xl font-bold tracking-tight">Admin Masjid</h1>
        <p className="text-emerald-300 text-sm mt-1">Al-Ikhlas Management</p>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-emerald-800 text-white font-medium'
                  : 'text-emerald-100 hover:bg-emerald-800/50 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-emerald-800">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-3 px-4 py-3 w-full text-emerald-100 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
