import React from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { KasSummary } from '@/components/features/KasSummary';
import { KasChart } from '@/components/features/KasChart';
import { KasTable } from '@/components/features/KasTable';

import { SectionBadge } from '@/components/ui/SectionBadge';

import { prisma } from '@/lib/prisma';

export const metadata = {
  title: 'Transparansi Keuangan - Masjid Miftahlul Jannah',
  description: 'Laporan kas keuangan Masjid Miftahlul Jannah yang transparan dan dapat diakses jamaah',
};

export default async function TransparansiPage() {
  // Fetch all for summary and chart
  const reports = await prisma.financialReport.findMany({
    orderBy: { date: 'asc' }
  });

  // Calculate summary
  let totalIncome = 0;
  let totalExpense = 0;
  reports.forEach(r => {
    if (r.type === 'INCOME') totalIncome += r.amount;
    else totalExpense += r.amount;
  });
  const balance = totalIncome - totalExpense;

  // Aggregate data by month for Chart (Last 12 Months)
  const monthlyMap = new Map<string, { pemasukan: number, pengeluaran: number }>();
  
  // Initialize last 12 months with 0
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = new Intl.DateTimeFormat('id-ID', { month: 'short', year: 'numeric' }).format(d);
    monthlyMap.set(monthKey, { pemasukan: 0, pengeluaran: 0 });
  }

  // Populate data
  reports.forEach(r => {
    const monthKey = new Intl.DateTimeFormat('id-ID', { month: 'short', year: 'numeric' }).format(r.date);
    if (monthlyMap.has(monthKey)) {
      const data = monthlyMap.get(monthKey)!;
      if (r.type === 'INCOME') data.pemasukan += r.amount;
      else data.pengeluaran += r.amount;
    }
  });

  const chartData = Array.from(monthlyMap.entries()).map(([month, data]) => ({
    month,
    pemasukan: data.pemasukan,
    pengeluaran: data.pengeluaran,
  }));

  // Latest 50 transactions for table
  const latestTransactions = await prisma.financialReport.findMany({
    orderBy: { date: 'desc' },
    take: 50
  });

  return (
    <div className="min-h-[100dvh] bg-[#FDFBF7] flex flex-col relative overflow-hidden">
      {/* Noise Texture Overlay for Editorial Luxury Vibe */}
      <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      <Navbar />
      
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-24 md:py-32 flex flex-col gap-16 md:gap-32 relative z-10">
        
        {/* Header Title */}
        <div className="flex flex-col items-center text-center gap-6 mt-12 md:mt-0">
          <SectionBadge>Transparansi & Akuntabilitas</SectionBadge>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-emerald-950 tracking-tight leading-[1.05]">
            Laporan<br />Keuangan Masjid.
          </h1>
          <p className="text-[#787774] mt-2 text-lg md:text-xl font-light max-w-2xl leading-relaxed">
            Amanah dari jamaah, untuk kemakmuran masjid dan umat. Laporan ini bersifat <span className="italic font-medium text-emerald-950">real-time</span>.
          </p>
        </div>

        <section>
           <KasSummary totalIncome={totalIncome} totalExpense={totalExpense} balance={balance} />
        </section>

        <section className="flex flex-col gap-8">
          <div className="flex justify-center md:justify-between items-end mb-4">
             <SectionBadge>Grafik Kas 12 Bulan Terakhir</SectionBadge>
          </div>
          <div className="p-1.5 bg-emerald-950/5 ring-1 ring-emerald-950/5 rounded-[2.5rem]">
            <div className="bg-[#FDFBF7] p-6 md:p-12 rounded-[calc(2.5rem-0.375rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,1)]">
               <KasChart data={chartData} />
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-8">
          <div className="flex justify-center md:justify-between items-end mb-4">
            <SectionBadge>Riwayat Transaksi Terbaru</SectionBadge>
          </div>
          <div className="p-1.5 bg-emerald-950/5 ring-1 ring-emerald-950/5 rounded-[2.5rem]">
            <div className="bg-[#FDFBF7] rounded-[calc(2.5rem-0.375rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,1)] overflow-hidden">
               <KasTable transactions={latestTransactions} />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
