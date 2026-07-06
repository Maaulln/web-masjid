import React from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-emerald-950 flex flex-col justify-between">
      <div>
        <Navbar />
        <main className="max-w-3xl mx-auto px-6 py-32 md:py-40 flex flex-col gap-6 relative z-10">
          <h1 className="text-3xl font-bold text-emerald-800">Kebijakan Privasi Donatur</h1>
          <p className="text-sm text-slate-500">Terakhir diperbarui: 5 Juli 2026</p>
          
          <p>Masjid Miftahlul Jannah berkomitmen untuk melindungi data pribadi jamaah dan donatur kami. Halaman ini menjelaskan bagaimana kami mengumpulkan dan mengelola data Anda.</p>
          
          <h2 className="text-xl font-bold text-slate-900 mt-4">1. Data Yang Kami Kumpulkan</h2>
          <p>Kami hanya mengumpulkan data kontak esensial seperti nama, alamat email, dan nomor WhatsApp guna kebutuhan pengiriman notifikasi transaksi, tanda terima resmi, dan verifikasi.</p>

          <h2 className="text-xl font-bold text-slate-900 mt-4">2. Opsi Anonim (Hamba Allah)</h2>
          <p>Demi kenyamanan donatur, kami menyediakan opsi <strong>"Anonim (Hamba Allah)"</strong> pada formulir donasi. Jika opsi ini dicentang, nama asli donatur tidak akan pernah ditampilkan di Landing Page transparansi publik (ditampilkan sebagai "Hamba Allah"). Namun, data kontak asli tetap disimpan secara privat di sistem untuk kebutuhan audit internal oleh pengurus masjid.</p>

          <h2 className="text-xl font-bold text-slate-900 mt-4">3. Keamanan Data</h2>
          <p>Kami menjamin data donatur disimpan secara aman dan tidak akan pernah dijual atau dibagikan kepada pihak ketiga di luar kebutuhan verifikasi langsung.</p>
        </main>
      </div>
      <Footer />
    </div>
  );
}
