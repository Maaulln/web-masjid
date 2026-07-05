import React from 'react';
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <h1 className="text-4xl font-bold text-red-600">Akses Ditolak (403)</h1>
      <p className="text-slate-600">Anda tidak memiliki izin untuk mengakses halaman admin.</p>
      <Link href="/" className="text-emerald-700 underline font-semibold">Kembali ke Beranda</Link>
    </div>
  );
}
