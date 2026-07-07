import React from 'react';
import KeuanganForm from './KeuanganForm';
import DeleteButton from './DeleteButton';
import { prisma } from '@/lib/prisma';
import { formatCurrency, formatDate } from '@/lib/utils';

export default async function KeuanganAdminPage() {
  const records = await prisma.financialReport.findMany({
    orderBy: { date: 'desc' },
    take: 100
  });

  const [incomeAgg, expenseAgg] = await prisma.$transaction([
    prisma.financialReport.aggregate({ _sum: { amount: true }, where: { type: 'INCOME' } }),
    prisma.financialReport.aggregate({ _sum: { amount: true }, where: { type: 'EXPENSE' } }),
  ]);
  
  const totalSaldo = (incomeAgg._sum.amount || 0) - (expenseAgg._sum.amount || 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-emerald-950">Manajemen Keuangan</h2>
          <p className="text-[#787774] mt-1">Pencatatan pemasukan dan pengeluaran kas masjid</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/api/keuangan/export" className="px-4 py-3 border border-emerald-950/10 text-emerald-950 hover:bg-emerald-950/5 font-bold uppercase tracking-widest text-xs rounded-full transition-colors">
            Export CSV
          </a>
          <KeuanganForm />
        </div>
      </div>

      <div className="p-1.5 bg-emerald-950/5 ring-1 ring-emerald-950/5 rounded-[2.5rem]">
        <div className="bg-[#FDFBF7] rounded-[calc(2.5rem-0.375rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,1)] p-8 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-emerald-950 uppercase tracking-wider text-xs mb-3">Saldo Akhir Kas</h3>
            <div className="text-4xl lg:text-5xl font-sans font-bold text-emerald-950 tracking-tight">{formatCurrency(totalSaldo)}</div>
          </div>
        </div>
      </div>

      <div className="p-1.5 bg-emerald-950/5 ring-1 ring-emerald-950/5 rounded-[2.5rem]">
        <div className="bg-[#FDFBF7] rounded-[calc(2.5rem-0.375rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,1)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-emerald-950">
              <thead className="bg-emerald-950/[0.03] text-emerald-950 border-b border-emerald-950/5">
                <tr>
                  <th className="px-6 md:px-8 py-5 font-bold uppercase tracking-wider text-xs">Tanggal</th>
                  <th className="px-6 md:px-8 py-5 font-bold uppercase tracking-wider text-xs">Kategori</th>
                  <th className="px-6 md:px-8 py-5 font-bold uppercase tracking-wider text-xs">Deskripsi</th>
                  <th className="px-6 md:px-8 py-5 font-bold uppercase tracking-wider text-xs text-right">Masuk</th>
                  <th className="px-6 md:px-8 py-5 font-bold uppercase tracking-wider text-xs text-right">Keluar</th>
                  <th className="px-6 md:px-8 py-5 font-bold uppercase tracking-wider text-xs text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-950/5">
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-[#787774] italic">
                      Belum ada data keuangan.
                    </td>
                  </tr>
                ) : (
                  records.map((rec) => (
                    <tr key={rec.id} className="hover:bg-emerald-950/[0.02] transition-colors duration-300">
                      <td className="px-6 md:px-8 py-5 whitespace-nowrap font-medium">{formatDate(rec.date)}</td>
                      <td className="px-6 md:px-8 py-5 font-bold text-emerald-950">{rec.category}</td>
                      <td className="px-6 md:px-8 py-5">{rec.description}</td>
                      <td className="px-6 md:px-8 py-5 text-right font-bold text-emerald-600">
                        {rec.type === 'INCOME' ? formatCurrency(rec.amount) : '-'}
                      </td>
                      <td className="px-6 md:px-8 py-5 text-right font-bold text-red-600">
                        {rec.type === 'EXPENSE' ? formatCurrency(rec.amount) : '-'}
                      </td>
                      <td className="px-6 md:px-8 py-5 text-right flex justify-end">
                        <DeleteButton id={rec.id} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
