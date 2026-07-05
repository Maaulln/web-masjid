import React from 'react';
import { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sistem Informasi & Donasi Masjid Al-Ikhlas',
  description: 'Transparansi saldo kas, jadwal kegiatan kajian, dan donasi online cepat untuk kemaslahatan umat.',
  openGraph: {
    title: 'Sistem Informasi & Donasi Masjid Al-Ikhlas',
    description: 'Transparansi saldo kas, jadwal kegiatan kajian, dan donasi online cepat untuk kemaslahatan umat.',
    url: 'https://masjid-alikhlas.or.id',
    siteName: 'Masjid Al-Ikhlas',
    images: [
      {
        url: '/images/og-masjid.png', // letakkan logo di public/images/
        width: 1200,
        height: 630,
        alt: 'Masjid Al-Ikhlas Preview',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
