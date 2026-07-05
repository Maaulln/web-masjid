import React from 'react';
import KeuanganForm from './KeuanganForm';
import DeleteButton from './DeleteButton';

import { prisma } from '@/lib/prisma';

export default async function KeuanganAdminPage() {
  const records = await prisma.financialReport.findMany({
    orderBy: { date: 'desc' },
    take: 100
  });

  const totalSaldo = records.reduce((acc, curr) => {
    return curr.type === 'INCOME' ? acc + curr.amount : acc - curr.amount;
  }, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Manajemen Keuangan</h2>
          <p className="text-slate-500 mt-1">Pencatatan pemasukan dan pengeluaran kas masjid</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/api/keuangan/export" className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium rounded-lg transition-colors">
            Export CSV
          </a>
          <KeuanganForm />
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 flex justify-between items-center">
        <div>
          <h3 className="text-emerald-800 font-medium mb-1">Saldo Akhir Kas</h3>
          <div className="text-3xl font-bold text-emerald-900">{formatCurrency(totalSaldo)}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Tanggal</th>
                <th className="px-6 py-4 font-semibold">Kategori</th>
                <th className="px-6 py-4 font-semibold">Deskripsi</th>
                <th className="px-6 py-4 font-semibold text-right">Masuk</th>
                <th className="px-6 py-4 font-semibold text-right">Keluar</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    Belum ada data keuangan.
                  </td>
                </tr>
              ) : (
                records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(rec.date)}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{rec.category}</td>
                    <td className="px-6 py-4">{rec.description}</td>
                    <td className="px-6 py-4 text-right font-medium text-emerald-600">
                      {rec.type === 'INCOME' ? formatCurrency(rec.amount) : '-'}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-red-600">
                      {rec.type === 'EXPENSE' ? formatCurrency(rec.amount) : '-'}
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end">
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
  );
}
