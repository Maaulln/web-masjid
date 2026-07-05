import React from 'react';
import { PrismaClient } from '@prisma/client';
import { unstable_cache } from 'next/cache';
import { Navbar } from '@/components/shared/Navbar';
import { KasSummary } from '@/components/features/KasSummary';
import { ActivityCard } from '@/components/features/ActivityCard';
import { Footer } from '@/components/shared/Footer';

const prisma = new PrismaClient();

const getCachedFinancialSummary = unstable_cache(
  async () => {
    const reports = await prisma.financialReport.findMany();
    let totalIncome = 0;
    let totalExpense = 0;
    reports.forEach(r => {
      if (r.type === 'INCOME') totalIncome += r.amount;
      else totalExpense += r.amount;
    });
    return { totalIncome, totalExpense, balance: totalIncome - totalExpense };
  },
  ['financial-summary-key'],
  { tags: ['financial-summary'] }
);

export default async function LandingPage() {
  const summary = await getCachedFinancialSummary();
  
  const activeActivities = await prisma.activity.findMany({
    where: {
      endDateTime: { gte: new Date() }
    },
    orderBy: { startDateTime: 'asc' }
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-8">
        <div className="text-center py-12 flex flex-col gap-3">
          <h1 className="text-4xl font-extrabold text-emerald-800 tracking-tight">Selamat Datang di Masjid Al-Ikhlas</h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">Pusat ibadah, pembelajaran agama, dan kegiatan kemasyarakatan yang transparan dan amanah.</p>
        </div>

        <KasSummary {...summary} />

        <div>
          <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">📅 Kegiatan Masjid Terdekat</h3>
          {activeActivities.length === 0 ? (
            <p className="text-slate-500 italic">Belum ada agenda kajian atau kegiatan aktif terdekat.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeActivities.map((act) => (
                <ActivityCard key={act.id} {...act} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
