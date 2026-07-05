import React from 'react';
import { PrismaClient } from '@prisma/client';
import { Wallet, HeartHandshake, CalendarClock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const prisma = new PrismaClient();

async function getDashboardData() {
  const now = new Date();
  
  // 1. Total Kas (Saldo)
  const kasRecords = await prisma.financialReport.findMany();
  const totalKas = kasRecords.reduce((acc, curr) => {
    return curr.type === 'INCOME' ? acc + curr.amount : acc - curr.amount;
  }, 0);

  // 2. Pending Donations Count
  const pendingDonationsCount = await prisma.donation.count({
    where: { status: 'PENDING' }
  });

  // 3. Active Activities
  const activeActivitiesCount = await prisma.activity.count({
    where: {
      endDateTime: { gte: now }
    }
  });

  return { totalKas, pendingDonationsCount, activeActivitiesCount };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Ikhtisar</h2>
        <p className="text-slate-500 mt-1">Selamat datang di Panel Administrasi Masjid Al-Ikhlas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Kas Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <div className="flex items-center gap-4 text-emerald-600 mb-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Wallet size={24} />
            </div>
            <h3 className="font-semibold text-slate-700">Total Kas Saat Ini</h3>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-4">
            {formatCurrency(data.totalKas)}
          </div>
          <Link href="/admin/keuangan" className="mt-auto flex items-center text-sm text-emerald-600 hover:text-emerald-700 font-medium">
            Kelola Keuangan <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        {/* Pending Donasi Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <div className="flex items-center gap-4 text-amber-500 mb-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <HeartHandshake size={24} />
            </div>
            <h3 className="font-semibold text-slate-700">Donasi Menunggu</h3>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-4">
            {data.pendingDonationsCount} <span className="text-lg font-medium text-slate-500">transaksi</span>
          </div>
          <Link href="/admin/donasi" className="mt-auto flex items-center text-sm text-emerald-600 hover:text-emerald-700 font-medium">
            Verifikasi Donasi <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        {/* Active Activities Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <div className="flex items-center gap-4 text-blue-500 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <CalendarClock size={24} />
            </div>
            <h3 className="font-semibold text-slate-700">Kegiatan Berjalan</h3>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-4">
            {data.activeActivitiesCount} <span className="text-lg font-medium text-slate-500">kegiatan</span>
          </div>
          <Link href="/admin/kegiatan" className="mt-auto flex items-center text-sm text-emerald-600 hover:text-emerald-700 font-medium">
            Kelola Jadwal <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
