import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { prisma } from '@/lib/prisma';
import { LogoutButton } from '@/components/features/LogoutButton';

export default async function AkunPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login?callbackUrl=/akun');
  }

  const userEmail = session.user.email || '';
  const userId = (session.user as { id?: string }).id || '';

  // Fetch Donations
  const donations = await prisma.donation.findMany({
    where: { 
      OR: [
        { userId: userId },
        { donorEmail: userEmail }
      ]
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  // Fetch Qurban
  const qurbans = await prisma.qurban.findMany({
    where: { mudhohiEmail: userEmail },
    orderBy: { createdAt: 'desc' }
  });

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const totalDonation = donations.filter(d => d.status === 'SUCCESS').reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="min-h-[100dvh] bg-[#FDFBF7] text-emerald-950 flex flex-col relative overflow-hidden">
      {/* Noise Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      <Navbar />

      <main className="flex-1 w-full px-4 py-32 md:px-12 md:py-40 relative z-10 flex flex-col items-center">
        
        {/* Header Sapaan */}
        <div className="max-w-6xl w-full text-center mb-16">
          <span className="w-max rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium bg-emerald-950/5 text-emerald-900 mb-6 mx-auto block border border-emerald-950/10">
            Dasbor Jamaah
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-emerald-950 leading-[1.1] mb-4">
            Ahlan wa sahlan, {session.user.name || 'Hamba Allah'}.
          </h1>
          <p className="text-[#787774] font-sans font-light">
            {userEmail}
          </p>
        </div>

        {/* Bento Grid (High-End Design) */}
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* Kiri: Ringkasan Donasi */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {/* Total Card */}
            <div className="p-1.5 bg-emerald-950/5 ring-1 ring-emerald-950/10 rounded-[2.5rem]">
              <div className="bg-white p-10 rounded-[calc(2.5rem-0.375rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,1)]">
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#787774] mb-2 block">Total Infaq & Sedekah</span>
                <div className="text-4xl md:text-5xl font-serif text-emerald-950 mb-2">
                  {formatRupiah(totalDonation)}
                </div>
                <p className="text-xs text-[#787774] font-light">
                  Semoga Allah menerima amal ibadah Anda dan memberkahinya.
                </p>
              </div>
            </div>

            {/* Riwayat Table */}
            <div className="p-1.5 bg-white ring-1 ring-emerald-950/5 rounded-[2.5rem]">
              <div className="bg-[#FDFBF7]/50 p-8 rounded-[calc(2.5rem-0.375rem)] h-full">
                <h3 className="text-lg font-serif mb-6 text-emerald-950">5 Riwayat Donasi Terakhir</h3>
                
                {donations.length === 0 ? (
                  <div className="text-center py-10 text-[#787774] text-sm">
                    Belum ada riwayat donasi.
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {donations.map((don) => (
                      <div key={don.id} className="flex justify-between items-center py-3 border-b border-emerald-950/5 last:border-0">
                        <div>
                          <p className="font-semibold text-sm text-emerald-950">{don.category}</p>
                          <p className="text-xs text-[#787774]">{new Date(don.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-serif text-emerald-950">{formatRupiah(don.amount)}</p>
                          <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-full ${don.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700' : 'bg-orange-50 text-orange-700'}`}>
                            {don.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Kanan: Ringkasan Kurban */}
          <div className="lg:col-span-5 p-1.5 bg-emerald-950 ring-1 ring-emerald-950 rounded-[2.5rem]">
            <div className="h-full bg-emerald-900/50 p-10 rounded-[calc(2.5rem-0.375rem)] flex flex-col relative overflow-hidden text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
              <span className="text-[10px] uppercase tracking-widest font-bold text-white/50 mb-4 block">Partisipasi Kurban</span>
              <h2 className="text-2xl font-serif mb-8 text-white">Riwayat Kurban Anda</h2>

              {qurbans.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                  <p className="text-white/70 font-light text-sm mb-6">
                    Anda belum terdaftar sebagai mudhohi pada program kurban kami.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-6 flex-1">
                  {qurbans.map((q) => (
                    <div key={q.id} className="bg-emerald-950/40 p-4 rounded-2xl ring-1 ring-white/10">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-emerald-50 text-sm">Hewan: {q.type.replace('_', ' ')}</span>
                        <span className="text-[10px] uppercase tracking-widest bg-emerald-800 text-white px-2 py-1 rounded-full">
                          {q.status}
                        </span>
                      </div>
                      <p className="text-xs text-white/70 mb-1">A.N: {q.mudhohiName}</p>
                      <p className="text-[10px] text-white/40">{new Date(q.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer Akun (Logout Button) */}
        <div className="mt-8">
          <LogoutButton />
        </div>

      </main>

      <Footer />
    </div>
  );
}
