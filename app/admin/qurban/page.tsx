import React from 'react';
import YearFilter from './YearFilter';
import QurbanForm from './QurbanForm';
import DeleteQurbanBtn from './DeleteQurbanBtn';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';

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

  const totalSapi = records.filter(r => r.type === 'SAPI').length;
  const totalKambing = records.filter(r => r.type === 'KAMBING').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-emerald-950">Manajemen Qurban {activeYear}</h2>
          <p className="text-[#787774] mt-1">Data pendaftar hewan qurban (Mudhohi)</p>
        </div>
        <div className="flex items-center gap-4">
          <YearFilter currentYear={activeYear} years={years} />
          <QurbanForm />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-1.5 bg-emerald-950/5 ring-1 ring-emerald-950/5 rounded-[2.5rem]">
          <div className="bg-[#FDFBF7] rounded-[calc(2.5rem-0.375rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,1)] p-6 flex justify-between items-center h-full">
            <div>
              <h3 className="font-bold text-emerald-950 uppercase tracking-wider text-xs mb-3">Total Pekurban Sapi (1/7)</h3>
              <div className="text-3xl font-sans font-bold text-emerald-950 tracking-tight">{totalSapi} <span className="text-sm font-bold uppercase tracking-widest text-[#787774]">Orang</span></div>
            </div>
          </div>
        </div>
        <div className="p-1.5 bg-emerald-950/5 ring-1 ring-emerald-950/5 rounded-[2.5rem]">
          <div className="bg-[#FDFBF7] rounded-[calc(2.5rem-0.375rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,1)] p-6 flex justify-between items-center h-full">
            <div>
              <h3 className="font-bold text-emerald-950 uppercase tracking-wider text-xs mb-3">Total Kambing / Domba</h3>
              <div className="text-3xl font-sans font-bold text-emerald-950 tracking-tight">{totalKambing} <span className="text-sm font-bold uppercase tracking-widest text-[#787774]">Ekor</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-1.5 bg-emerald-950/5 ring-1 ring-emerald-950/5 rounded-[2.5rem]">
        <div className="bg-[#FDFBF7] rounded-[calc(2.5rem-0.375rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,1)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-emerald-950">
              <thead className="bg-emerald-950/[0.03] text-emerald-950 border-b border-emerald-950/5">
                <tr>
                  <th className="px-6 md:px-8 py-5 font-bold uppercase tracking-wider text-xs">Tgl Daftar</th>
                  <th className="px-6 md:px-8 py-5 font-bold uppercase tracking-wider text-xs">Nama Mudhohi</th>
                  <th className="px-6 md:px-8 py-5 font-bold uppercase tracking-wider text-xs">No. HP</th>
                  <th className="px-6 md:px-8 py-5 font-bold uppercase tracking-wider text-xs">Jenis Hewan</th>
                  <th className="px-6 md:px-8 py-5 font-bold uppercase tracking-wider text-xs">Status Bayar</th>
                  <th className="px-6 md:px-8 py-5 font-bold uppercase tracking-wider text-xs text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-950/5">
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-[#787774] italic">
                      Belum ada pendaftar qurban tahun ini.
                    </td>
                  </tr>
                ) : (
                  records.map((rec) => (
                    <tr key={rec.id} className="hover:bg-emerald-950/[0.02] transition-colors duration-300">
                      <td className="px-6 md:px-8 py-5 whitespace-nowrap font-medium">{formatDate(rec.createdAt)}</td>
                      <td className="px-6 md:px-8 py-5 font-bold text-emerald-950">{rec.mudhohiName}</td>
                      <td className="px-6 md:px-8 py-5 text-[#787774]">{rec.mudhohiPhone || '-'}</td>
                      <td className="px-6 md:px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          rec.type === 'SAPI' ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-950/10 text-emerald-950'
                        }`}>
                          {rec.type}
                        </span>
                      </td>
                      <td className="px-6 md:px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          rec.status === 'RECEIVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'
                        }`}>
                          {rec.status}
                        </span>
                      </td>
                      <td className="px-6 md:px-8 py-5 text-right flex justify-end">
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
    </div>
  );
}
