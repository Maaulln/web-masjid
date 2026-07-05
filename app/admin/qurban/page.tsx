import React from 'react';
import YearFilter from './YearFilter';
import QurbanForm from './QurbanForm';
import DeleteQurbanBtn from './DeleteQurbanBtn';
import { prisma } from '@/lib/prisma';

export default async function QurbanAdminPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ year?: string }> 
}) {
  const currentYear = new Date().getFullYear();
  const params = await searchParams;
  const activeYear = params.year || currentYear.toString();
  
  // Generate last 5 years for filter options
  const years = Array.from({length: 5}, (_, i) => (currentYear - i).toString());
  
  const records = await prisma.qurban.findMany({
    where: { 
      createdAt: {
        gte: new Date(`${activeYear}-01-01T00:00:00.000Z`),
        lte: new Date(`${activeYear}-12-31T23:59:59.999Z`)
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
    }).format(date);
  };

  const totalSapi = records.filter(r => r.type === 'SAPI').length;
  const totalKambing = records.filter(r => r.type === 'KAMBING').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Manajemen Qurban {activeYear}</h2>
          <p className="text-slate-500 mt-1">Data pendaftar hewan qurban (Mudhohi)</p>
        </div>
        <div className="flex items-center gap-4">
          <YearFilter currentYear={activeYear} years={years} />
          <QurbanForm />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 flex justify-between items-center">
          <div>
            <h3 className="text-emerald-800 font-medium mb-1">Total Pekurban Sapi (1/7)</h3>
            <div className="text-3xl font-bold text-emerald-900">{totalSapi} <span className="text-sm font-medium">Orang</span></div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex justify-between items-center">
          <div>
            <h3 className="text-blue-800 font-medium mb-1">Total Kambing / Domba</h3>
            <div className="text-3xl font-bold text-blue-900">{totalKambing} <span className="text-sm font-medium">Ekor</span></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Tgl Daftar</th>
                <th className="px-6 py-4 font-semibold">Nama Mudhohi</th>
                <th className="px-6 py-4 font-semibold">No. HP</th>
                <th className="px-6 py-4 font-semibold">Jenis Hewan</th>
                <th className="px-6 py-4 font-semibold">Status Bayar</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    Belum ada pendaftar qurban tahun ini.
                  </td>
                </tr>
              ) : (
                records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(rec.createdAt)}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{rec.mudhohiName}</td>
                    <td className="px-6 py-4">{rec.mudhohiPhone || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        rec.type === 'SAPI' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {rec.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        rec.status === 'RECEIVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {rec.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end">
                      <DeleteQurbanBtn id={rec.id} />
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
