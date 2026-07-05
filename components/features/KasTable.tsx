import React from 'react';

interface Transaction {
  id: string;
  date: Date;
  type: string;
  category: string;
  description: string;
  amount: number;
}

interface KasTableProps {
  transactions: Transaction[];
}

export const KasTable: React.FC<KasTableProps> = ({ transactions }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="w-full overflow-hidden bg-transparent">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-[#787774]">
          <thead className="bg-emerald-950/[0.03] text-emerald-950 border-b border-emerald-950/5">
            <tr>
              <th className="px-6 md:px-10 py-5 font-bold uppercase tracking-wider text-[10px] whitespace-nowrap">Tanggal</th>
              <th className="px-6 md:px-10 py-5 font-bold uppercase tracking-wider text-[10px]">Kategori</th>
              <th className="px-6 md:px-10 py-5 font-bold uppercase tracking-wider text-[10px]">Deskripsi</th>
              <th className="px-6 md:px-10 py-5 font-bold uppercase tracking-wider text-[10px] text-right">Nominal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.04]">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-[#787774] font-medium">
                  Belum ada data transaksi keuangan.
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-emerald-950/[0.02] transition-colors duration-300">
                  <td className="px-6 md:px-10 py-5 whitespace-nowrap text-emerald-950 font-bold">{formatDate(tx.date)}</td>
                  <td className="px-6 md:px-10 py-5">
                    <span className="px-3 py-1 bg-emerald-950/5 text-emerald-950 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-6 md:px-10 py-5 font-medium">{tx.description}</td>
                  <td className={`px-6 md:px-10 py-5 text-right font-bold whitespace-nowrap ${
                    tx.type === 'INCOME' ? 'text-emerald-700' : 'text-orange-700'
                  }`}>
                    {tx.type === 'INCOME' ? '+' : '-'} {formatCurrency(tx.amount)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
