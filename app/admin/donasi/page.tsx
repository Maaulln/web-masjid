import React from 'react';
import VerifyButtons from './VerifyButtons';
import { prisma } from '@/lib/prisma';
import { formatCurrency, formatDate } from '@/lib/utils';

export default async function DonasiAdminPage() {
  const donations = await prisma.donation.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-serif font-bold text-emerald-950">Manajemen Donasi</h2>
          <p className="text-[#787774] mt-1">Verifikasi donasi masuk dari jamaah</p>
        </div>
      </div>

      <div className="p-1.5 bg-emerald-950/5 ring-1 ring-emerald-950/5 rounded-[2.5rem]">
        <div className="bg-[#FDFBF7] rounded-[calc(2.5rem-0.375rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,1)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-emerald-950">
              <thead className="bg-emerald-950/[0.03] text-emerald-950 border-b border-emerald-950/5">
                <tr>
                  <th className="px-6 md:px-8 py-5 font-bold uppercase tracking-wider text-xs">Waktu</th>
                  <th className="px-6 md:px-8 py-5 font-bold uppercase tracking-wider text-xs">Nama Donatur</th>
                  <th className="px-6 md:px-8 py-5 font-bold uppercase tracking-wider text-xs">Nominal</th>
                  <th className="px-6 md:px-8 py-5 font-bold uppercase tracking-wider text-xs">Status</th>
                  <th className="px-6 md:px-8 py-5 font-bold uppercase tracking-wider text-xs">Tipe</th>
                  <th className="px-6 md:px-8 py-5 font-bold uppercase tracking-wider text-xs text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-950/5">
                {donations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-[#787774] italic">
                      Belum ada data donasi.
                    </td>
                  </tr>
                ) : (
                  donations.map((don) => (
                    <tr key={don.id} className="hover:bg-emerald-950/[0.02] transition-colors duration-300">
                      <td className="px-6 md:px-8 py-5 whitespace-nowrap font-medium">{formatDate(don.createdAt, true)}</td>
                      <td className="px-6 md:px-8 py-5">
                        <div className="font-bold text-emerald-950">{don.donorName}</div>
                        {don.donorEmail && <div className="text-xs text-[#787774] mt-1">{don.donorEmail}</div>}
                      </td>
                      <td className="px-6 md:px-8 py-5 font-bold text-emerald-950">{formatCurrency(don.amount)}</td>
                      <td className="px-6 md:px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          don.status === 'PENDING' ? 'bg-orange-100 text-orange-800' :
                          don.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {don.status}
                        </span>
                      </td>
                      <td className="px-6 md:px-8 py-5 text-[10px] font-bold uppercase tracking-widest bg-black/5 rounded text-center m-4">{don.paymentType}</td>
                      <td className="px-6 md:px-8 py-5 text-right flex justify-end items-center h-full min-h-[5rem]">
                        {don.status === 'PENDING' ? (
                          <VerifyButtons id={don.id} />
                        ) : (
                          <span className="text-[#787774] text-[10px] font-bold uppercase tracking-widest">Selesai</span>
                        )}
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
