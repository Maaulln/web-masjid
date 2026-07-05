import React from 'react';
import { PrismaClient } from '@prisma/client';
import VerifyButtons from './VerifyButtons';

const prisma = new PrismaClient();

export default async function DonasiAdminPage() {
  const donations = await prisma.donation.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Manajemen Donasi</h2>
          <p className="text-slate-500 mt-1">Verifikasi donasi masuk dari jamaah</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Waktu</th>
                <th className="px-6 py-4 font-semibold">Nama Donatur</th>
                <th className="px-6 py-4 font-semibold">Nominal</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Tipe</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {donations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    Belum ada data donasi.
                  </td>
                </tr>
              ) : (
                donations.map((don) => (
                  <tr key={don.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(don.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{don.donorName}</div>
                      {don.donorEmail && <div className="text-xs text-slate-500">{don.donorEmail}</div>}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">{formatCurrency(don.amount)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        don.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                        don.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {don.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium bg-slate-100 rounded text-center m-4">{don.paymentType}</td>
                    <td className="px-6 py-4 text-right flex justify-end">
                      {don.status === 'PENDING' ? (
                        <VerifyButtons id={don.id} />
                      ) : (
                        <span className="text-slate-400 text-xs italic">Selesai</span>
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
  );
}
