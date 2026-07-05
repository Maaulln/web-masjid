import React from 'react';
import { Wallet, Handshake as HeartHandshake, Calendar as CalendarClock, ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

import { prisma } from '@/lib/prisma';

async function getDashboardData() {
  const now = new Date();
  
  const [incomeAgg, expenseAgg, pendingDonationsCount, activeActivitiesCount] = await Promise.all([
    prisma.financialReport.aggregate({
      _sum: { amount: true },
      where: { type: 'INCOME' }
    }),
    prisma.financialReport.aggregate({
      _sum: { amount: true },
      where: { type: 'EXPENSE' }
    }),
    prisma.donation.count({
      where: { status: 'PENDING' }
    }),
    prisma.activity.count({
      where: { endDateTime: { gte: now } }
    })
  ]);

  const totalIncome = incomeAgg._sum.amount || 0;
  const totalExpense = expenseAgg._sum.amount || 0;
  const totalKas = totalIncome - totalExpense;

  return { totalKas, pendingDonationsCount, activeActivitiesCount };
}

import { formatCurrency } from '@/lib/utils';

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <div>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-emerald-950 tracking-tight">Ikhtisar</h2>
        <p className="text-[#787774] mt-3 font-medium text-sm md:text-base">Selamat datang di Panel Administrasi Masjid Al-Ikhlas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Kas Card */}
        <div className="p-1.5 bg-emerald-950/5 ring-1 ring-emerald-950/5 rounded-[2.5rem] group">
          <div className="h-full bg-[#FDFBF7] rounded-[calc(2.5rem-0.375rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,1)] p-8 flex flex-col relative overflow-hidden">
            <div className="flex items-center gap-4 text-emerald-800 mb-6">
              <div className="p-4 bg-emerald-900/10 rounded-2xl">
                <Wallet size={24} weight="duotone" />
              </div>
              <h3 className="font-bold text-emerald-950 uppercase tracking-wider text-xs">Total Kas Saat Ini</h3>
            </div>
            <div className="text-3xl lg:text-4xl font-sans font-bold text-emerald-950 mb-6 tracking-tight">
              {formatCurrency(data.totalKas)}
            </div>
            <Link href="/admin/keuangan" className="mt-auto flex items-center text-xs text-emerald-700 hover:text-emerald-900 font-bold uppercase tracking-widest transition-colors">
              Kelola Keuangan <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Pending Donasi Card */}
        <div className="p-1.5 bg-emerald-950/5 ring-1 ring-emerald-950/5 rounded-[2.5rem] group">
          <div className="h-full bg-[#FDFBF7] rounded-[calc(2.5rem-0.375rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,1)] p-8 flex flex-col relative overflow-hidden">
            <div className="flex items-center gap-4 text-orange-800 mb-6">
              <div className="p-4 bg-orange-900/10 rounded-2xl">
                <HeartHandshake size={24} weight="duotone" />
              </div>
              <h3 className="font-bold text-emerald-950 uppercase tracking-wider text-xs">Donasi Menunggu</h3>
            </div>
            <div className="text-3xl lg:text-4xl font-sans font-bold text-emerald-950 mb-6 tracking-tight">
              {data.pendingDonationsCount} <span className="text-sm font-bold uppercase tracking-widest text-[#787774]">trx</span>
            </div>
            <Link href="/admin/donasi" className="mt-auto flex items-center text-xs text-orange-700 hover:text-orange-900 font-bold uppercase tracking-widest transition-colors">
              Verifikasi Donasi <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Active Activities Card */}
        <div className="p-1.5 bg-emerald-950/5 ring-1 ring-emerald-950/5 rounded-[2.5rem] group">
          <div className="h-full bg-[#FDFBF7] rounded-[calc(2.5rem-0.375rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,1)] p-8 flex flex-col relative overflow-hidden">
            <div className="flex items-center gap-4 text-blue-800 mb-6">
              <div className="p-4 bg-blue-900/10 rounded-2xl">
                <CalendarClock size={24} weight="duotone" />
              </div>
              <h3 className="font-bold text-emerald-950 uppercase tracking-wider text-xs">Kegiatan Berjalan</h3>
            </div>
            <div className="text-3xl lg:text-4xl font-sans font-bold text-emerald-950 mb-6 tracking-tight">
              {data.activeActivitiesCount} <span className="text-sm font-bold uppercase tracking-widest text-[#787774]">acara</span>
            </div>
            <Link href="/admin/kegiatan" className="mt-auto flex items-center text-xs text-blue-700 hover:text-blue-900 font-bold uppercase tracking-widest transition-colors">
              Kelola Jadwal <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
