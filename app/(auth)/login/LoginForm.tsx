'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { signIn, getSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { motion } from 'framer-motion';
import { Turnstile } from '@marsidev/react-turnstile';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!turnstileToken) {
      setError('Mohon selesaikan CAPTCHA terlebih dahulu.');
      return;
    }
    
    setIsSubmitting(true);
    const res = await signIn('credentials', { email, password, turnstileToken, redirect: false });
    if (res?.error) {
      setError(res.error === 'Verifikasi CAPTCHA gagal' ? res.error : 'Email atau Password salah.');
      setIsSubmitting(false);
    } else {
      const session = await getSession();
      const urlParams = new URLSearchParams(window.location.search);
      const callbackUrl = urlParams.get('callbackUrl');
      
      if (session?.user && (session.user as any).role === 'ADMIN') {
        router.push(callbackUrl || '/admin/dashboard');
      } else {
        router.push(callbackUrl || '/');
      }
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
        className="p-1.5 bg-emerald-950/5 ring-1 ring-emerald-950/10 rounded-[2.5rem]"
      >
        <div className="bg-white p-10 md:p-14 rounded-[calc(2.5rem-0.375rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,1)] flex flex-col">
          
          <div className="text-center mb-10">
            <span className="w-max mx-auto rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-bold bg-emerald-950/5 text-emerald-900 mb-4 block border border-emerald-950/10">
              Otentikasi
            </span>
            <h1 className="text-3xl md:text-4xl font-serif text-emerald-950 leading-tight mb-2 tracking-tight">
              Selamat Datang.
            </h1>
            <p className="text-sm text-[#787774] font-light">
              Silakan masuk ke akun Anda untuk melanjutkan.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {registered && (
              <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl text-xs font-medium text-center ring-1 ring-emerald-200">
                Pendaftaran berhasil! Silakan masuk dengan akun baru Anda.
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 text-red-800 p-4 rounded-2xl text-xs font-medium text-center ring-1 ring-red-200">
                {error}
              </div>
            )}
            
            <Input label="Alamat Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Misal: jamaah@email.com" />
            <Input label="Kata Sandi" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
            
            <div className="flex justify-end mt-[-8px]">
              <Link href="/forgot-password" className="text-[11px] font-semibold text-[#787774] hover:text-emerald-900 transition-colors uppercase tracking-wider">
                Lupa Kata Sandi?
              </Link>
            </div>
            
            <div className="flex justify-center w-full">
              <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'} onSuccess={(token) => setTurnstileToken(token)} />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`group relative flex items-center justify-center gap-4 bg-emerald-950 text-[#FDFBF7] px-8 py-4 rounded-full font-sans font-semibold tracking-wide overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] mt-4 hover:bg-emerald-900 ${isSubmitting ? 'opacity-80 cursor-not-allowed' : ''}`}
            >
              <span className="relative z-10">{isSubmitting ? 'Memverifikasi...' : 'Masuk Akun'}</span>
              <div className="relative z-10 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105">
                {isSubmitting ? (
                  <svg className="animate-spin text-white" width="16" height="16" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-emerald-950/5 text-center">
            <p className="text-xs text-[#787774] font-medium">
              Belum memiliki akun?{' '}
              <Link href="/register" className="text-emerald-900 font-bold hover:underline">
                Daftar Sekarang
              </Link>
            </p>
          </div>
          
        </div>
      </motion.div>
    </div>
  );
}
