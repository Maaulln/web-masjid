'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SquaresFour as LayoutDashboard, Wallet, Handshake as HeartHandshake, Calendar as CalendarClock, GitPullRequest as GitPullRequestDraft, SignOut as LogOut } from '@phosphor-icons/react/dist/ssr';
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
    <aside className="w-full h-full bg-emerald-950 text-white flex flex-col rounded-[2rem] shadow-2xl relative overflow-hidden">
      {/* Subtle highlight */}
      <div className="absolute top-0 right-0 w-[150%] h-[100%] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/[0.07] via-transparent to-transparent opacity-80 pointer-events-none"></div>

      <div className="p-8 border-b border-white/[0.05] relative z-10">
        <h1 className="text-3xl font-serif font-bold tracking-tight text-white">Admin.</h1>
        <p className="text-white/40 text-[10px] mt-2 uppercase tracking-widest font-bold">Masjid Al-Ikhlas</p>
      </div>

      <nav className="flex-1 py-8 px-4 space-y-2 relative z-10 overflow-y-auto hide-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
                isActive
                  ? 'bg-white/10 text-white font-bold shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                  : 'text-white/50 hover:bg-white/5 hover:text-white font-medium'
              }`}
            >
              <Icon size={22} weight={isActive ? "fill" : "regular"} />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 relative z-10">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-4 px-5 py-4 w-full text-white/50 hover:bg-red-500/10 hover:text-red-400 rounded-2xl transition-all duration-300 group"
        >
          <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
