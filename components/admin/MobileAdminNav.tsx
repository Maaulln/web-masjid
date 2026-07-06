'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { SquaresFour as LayoutDashboard, Wallet, Handshake as HeartHandshake, Calendar as CalendarClock, GitPullRequest as GitPullRequestDraft } from '@phosphor-icons/react/dist/ssr';

const menuItems = [
  { name: 'Dash', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Kas', href: '/admin/keuangan', icon: Wallet },
  { name: 'Donasi', href: '/admin/donasi', icon: HeartHandshake },
  { name: 'Acara', href: '/admin/kegiatan', icon: CalendarClock },
  { name: 'Qurban', href: '/admin/qurban', icon: GitPullRequestDraft },
];

export default function MobileAdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    menuItems.forEach((item) => {
      router.prefetch(item.href);
    });
  }, [router]);

  return (
    <div className="md:hidden fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
        className="pointer-events-auto w-max max-w-full p-1.5 bg-emerald-950/80 backdrop-blur-2xl ring-1 ring-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] rounded-[2.5rem]"
      >
        <div className="flex items-center gap-1 sm:gap-2 px-2 py-2 bg-emerald-900/60 rounded-[calc(2.5rem-0.375rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                prefetch={true}
                className="relative group px-4 py-2 flex flex-col items-center justify-center transition-transform active:scale-95"
              >
                {isActive && (
                  <motion.div
                    layoutId="mobileNavIndicator"
                    className="absolute inset-0 bg-white/10 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-white' : 'text-emerald-50/50'}`}>
                  <Icon size={22} weight={isActive ? "fill" : "regular"} />
                </div>
                <span className={`relative z-10 text-[10px] mt-1 font-bold uppercase tracking-wider transition-colors duration-300 ${isActive ? 'text-white' : 'text-emerald-50/50'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </motion.nav>
    </div>
  );
}
