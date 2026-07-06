import React from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { RegisterForm } from './RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-[100dvh] bg-[#FDFBF7] flex flex-col relative overflow-hidden">
      {/* Noise Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      <Navbar />

      <main className="flex-1 w-full px-4 py-32 md:px-12 md:py-40 relative z-10 flex items-center justify-center">
        <RegisterForm />
      </main>

      <Footer />
    </div>
  );
}
