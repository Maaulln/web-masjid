import React from 'react';
import { Wallet, Handshake as HeartHandshake, Calendar as CalendarClock, ArrowRight, Users, Receipt } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

import { prisma } from '@/lib/prisma';

async function getDashboardData() {
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 6);
  
  const [incomeAgg, expenseAgg, pendingDonationsCount, activeActivitiesCount, totalJamaah, recentTransactions, financialReports] = await prisma.$transaction([
    prisma.financialReport.aggregate({ _sum: { amount: true }, where: { type: 'INCOME' } }),
    prisma.financialReport.aggregate({ _sum: { amount: true }, where: { type: 'EXPENSE' } }),
    prisma.donation.count({ where: { status: 'PENDING' } }),
    prisma.activity.count({ where: { endDateTime: { gte: now } } }),
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.financialReport.findMany({
      take: 5,
      orderBy: { date: 'desc' }
    }),
    prisma.financialReport.findMany({
      where: { date: { gte: sixMonthsAgo } },
      orderBy: { date: 'asc' }
    })
  ]);

  const totalIncome = incomeAgg._sum.amount || 0;
  const totalExpense = expenseAgg._sum.amount || 0;
  const totalKas = totalIncome - totalExpense;

  // Group data for chart
  const monthlyData: Record<string, { month: string, income: number, expense: number }> = {};
  
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = d.toLocaleString('id-ID', { month: 'short' });
    monthlyData[monthKey] = { month: monthKey, income: 0, expense: 0 };
  }

  financialReports.forEach(report => {
    const monthKey = report.date.toLocaleString('id-ID', { month: 'short' });
    if (monthlyData[monthKey]) {
      if (report.type === 'INCOME') {
        monthlyData[monthKey].income += report.amount;
      } else {
        monthlyData[monthKey].expense += report.amount;
      }
    }
  });

  const chartData = Object.values(monthlyData);

  return { 
    totalKas, 
    pendingDonationsCount, 
    activeActivitiesCount, 
    totalJamaah,
    chartData,
    recentTransactions 
  };
}

import { formatCurrency } from '@/lib/utils';
import { FinancialChart } from './FinancialChart';

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <div>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-emerald-950 tracking-tight">Ikhtisar</h2>
        <p className="text-[#787774] mt-3 font-medium text-sm md:text-base">Selamat datang di Panel Administrasi Masjid Miftahlul Jannah</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        {/* Total Jamaah Card */}
        <div className="p-1.5 bg-emerald-950/5 ring-1 ring-emerald-950/5 rounded-[2.5rem] group">
          <div className="h-full bg-[#FDFBF7] rounded-[calc(2.5rem-0.375rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,1)] p-8 flex flex-col relative overflow-hidden">
            <div className="flex items-center gap-4 text-purple-800 mb-6">
              <div className="p-4 bg-purple-900/10 rounded-2xl">
                <Users size={24} weight="duotone" />
              </div>
              <h3 className="font-bold text-emerald-950 uppercase tracking-wider text-xs">Total Jamaah</h3>
            </div>
            <div className="text-3xl lg:text-4xl font-sans font-bold text-emerald-950 mb-6 tracking-tight">
              {data.totalJamaah} <span className="text-sm font-bold uppercase tracking-widest text-[#787774]">orang</span>
            </div>
            {/* Menggunakan div saja jika tidak ada halaman /admin/users, jika ada ganti ke Link */}
            <div className="mt-auto flex items-center text-xs text-purple-700 font-bold uppercase tracking-widest transition-colors">
              Jamaah Terdaftar
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 p-1.5 bg-emerald-950/5 ring-1 ring-emerald-950/5 rounded-[2.5rem]">
          <div className="h-full bg-[#FDFBF7] rounded-[calc(2.5rem-0.375rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,1)] p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-emerald-950">Statistik Finansial (6 Bulan)</h3>
            </div>
            <FinancialChart data={data.chartData} />
          </div>
        </div>

        {/* Recent Transactions Section */}
        <div className="lg:col-span-1 p-1.5 bg-emerald-950/5 ring-1 ring-emerald-950/5 rounded-[2.5rem]">
          <div className="h-full bg-[#FDFBF7] rounded-[calc(2.5rem-0.375rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,1)] p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-emerald-900/10 rounded-xl text-emerald-800">
                <Receipt size={20} weight="duotone" />
              </div>
              <h3 className="text-lg font-bold text-emerald-950">Transaksi Terbaru</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {data.recentTransactions.length === 0 ? (
                <div className="text-center text-sm text-[#787774] py-8">Belum ada transaksi.</div>
              ) : (
                data.recentTransactions.map((trx) => (
                  <div key={trx.id} className="flex justify-between items-center p-4 rounded-2xl bg-white border border-emerald-950/5">
                    <div>
                      <p className="text-sm font-bold text-emerald-950 line-clamp-1">{trx.description}</p>
                      <p className="text-xs text-[#787774] mt-1">
                        {trx.date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} • {trx.category}
                      </p>
                    </div>
                    <div className={`text-sm font-bold whitespace-nowrap ${trx.type === 'INCOME' ? 'text-emerald-700' : 'text-red-600'}`}>
                      {trx.type === 'INCOME' ? '+' : '-'}{formatCurrency(trx.amount)}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <Link href="/admin/keuangan" className="mt-6 flex justify-center items-center py-3 text-xs text-emerald-900 font-bold uppercase tracking-widest bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors">
              Lihat Semua
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
