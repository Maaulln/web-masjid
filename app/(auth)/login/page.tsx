import React, { Suspense } from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { LoginForm } from './LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-[100dvh] bg-[#FDFBF7] flex flex-col relative overflow-hidden">
      {/* Noise Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      <Navbar />

      <main className="flex-1 w-full px-4 py-32 md:px-12 md:py-40 relative z-10 flex items-center justify-center">
        <Suspense fallback={
          <div className="w-full max-w-lg p-1.5 bg-emerald-950/5 ring-1 ring-emerald-950/10 rounded-[2.5rem] animate-pulse">
            <div className="bg-white/50 h-[500px] rounded-[calc(2.5rem-0.375rem)]"></div>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
