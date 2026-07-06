'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { motion } from 'framer-motion';

export function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Terjadi kesalahan');
      }

      // Automatically redirect to login page after successful registration
      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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
              Registrasi
            </span>
            <h1 className="text-3xl md:text-4xl font-serif text-emerald-950 leading-tight mb-2 tracking-tight">
              Bergabung.
            </h1>
            <p className="text-sm text-[#787774] font-light">
              Buat akun untuk kemudahan donasi dan akses layanan.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {error && (
              <div className="bg-red-50 text-red-800 p-4 rounded-2xl text-xs font-medium text-center ring-1 ring-red-200">
                {error}
              </div>
            )}
            
            <Input label="Nama Lengkap" type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Misal: Abdullah Ahmad" />
            <Input label="Alamat Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Misal: jamaah@email.com" />
            <Input label="Kata Sandi Baru" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Minimal 6 karakter" />
            
            <button 
              type="submit" 
              disabled={loading}
              className={`group relative flex items-center justify-center gap-4 bg-emerald-950 text-[#FDFBF7] px-8 py-4 rounded-full font-sans font-semibold tracking-wide overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : 'active:scale-[0.98] hover:bg-emerald-900'}`}
            >
              <span className="relative z-10">{loading ? 'Memproses...' : 'Daftar Sekarang'}</span>
              
              {!loading && (
                <div className="relative z-10 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-emerald-950/5 text-center">
            <p className="text-xs text-[#787774] font-medium">
              Sudah memiliki akun?{' '}
              <Link href="/login" className="text-emerald-900 font-bold hover:underline">
                Masuk di sini
              </Link>
            </p>
          </div>
          
        </div>
      </motion.div>
    </div>
  );
}
