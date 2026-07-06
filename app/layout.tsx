import React from 'react';
import { Metadata } from 'next';
import './globals.css';
import { DM_Sans, Newsreader } from 'next/font/google';
import ToastProvider from '@/components/providers/ToastProvider';
import SessionProvider from '@/components/providers/SessionProvider';
import JsonLd from '@/components/seo/JsonLd';

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans' });
const newsreader = Newsreader({ subsets: ['latin'], variable: '--font-serif' });

export const metadata: Metadata = {
  title: 'Sistem Informasi & Donasi Masjid Miftahlul Jannah',
  description: 'Transparansi saldo kas, jadwal kegiatan kajian, dan donasi online cepat untuk kemaslahatan umat.',
  openGraph: {
    title: 'Sistem Informasi & Donasi Masjid Miftahlul Jannah',
    description: 'Transparansi saldo kas, jadwal kegiatan kajian, dan donasi online cepat untuk kemaslahatan umat.',
    url: 'https://masjid-alikhlas.or.id',
    siteName: 'Masjid Miftahlul Jannah',
    images: [
      {
        url: '/images/og-masjid.png',
        width: 1200,
        height: 630,
        alt: 'Masjid Miftahlul Jannah Preview',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const mosqueSchema = {
    "@context": "https://schema.org",
    "@type": "Mosque",
    "name": "Masjid Miftahlul Jannah",
    "url": "https://masjid-alikhlas.or.id",
    "description": "Transparansi saldo kas, jadwal kegiatan kajian, dan donasi online cepat untuk kemaslahatan umat."
  };

  return (
    <html lang="id">
      <body className={`${dmSans.variable} ${newsreader.variable} font-sans antialiased text-emerald-950 bg-[#FBFBFA]`}>
        <SessionProvider>
          <ToastProvider />
          <JsonLd schema={mosqueSchema} />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
