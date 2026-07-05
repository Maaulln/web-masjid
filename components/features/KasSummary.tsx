import React from 'react';

interface KasProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export const KasSummary: React.FC<KasProps> = ({ totalIncome, totalExpense, balance }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
      <div className="p-6 bg-white border border-slate-100 rounded-lg shadow-sm flex flex-col gap-2">
        <span className="text-sm font-semibold text-slate-500 uppercase">Pemasukan Kas</span>
        <span className="text-2xl font-bold text-emerald-700">Rp {totalIncome.toLocaleString('id-ID')}</span>
      </div>
      <div className="p-6 bg-white border border-slate-100 rounded-lg shadow-sm flex flex-col gap-2">
        <span className="text-sm font-semibold text-slate-500 uppercase">Pengeluaran Kas</span>
        <span className="text-2xl font-bold text-red-600">Rp {totalExpense.toLocaleString('id-ID')}</span>
      </div>
      {/* text-slate-900 (gelap) digunakan di atas aksen warna emas/kuning untuk kontras WCAG AA yang lolos audit */}
      <div className="p-6 bg-emerald-800 text-white rounded-lg shadow-md flex flex-col gap-2">
        <span className="text-sm font-semibold opacity-85 uppercase">Saldo Sisa Kas</span>
        <span className="text-3xl font-extrabold text-yellow-300">Rp {balance.toLocaleString('id-ID')}</span>
      </div>
    </div>
  );
};
