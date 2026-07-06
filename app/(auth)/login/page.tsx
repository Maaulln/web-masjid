'use client';
import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn('credentials', { email, password, redirect: false });
    if (res?.error) {
      setError('Email atau Password salah.');
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      const callbackUrl = urlParams.get('callbackUrl');
      router.push(callbackUrl || '/admin/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 bg-white rounded-lg shadow-md w-full max-w-md flex flex-col gap-4 border border-slate-100">
      <h2 className="text-2xl font-bold text-center text-emerald-800">Masuk Masjid Miftahlul Jannah</h2>
      {registered && <p className="text-emerald-600 bg-emerald-50 p-2 rounded text-sm text-center font-medium">Pendaftaran berhasil! Silakan masuk dengan akun baru Anda.</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <Button type="submit" className="w-full mt-2">Masuk</Button>
      <div className="flex justify-between items-center text-sm mt-2 text-emerald-700">
        <Link href="/forgot-password" className="hover:underline">Lupa password?</Link>
        <Link href="/register" className="hover:underline font-semibold">Daftar Akun Baru</Link>
      </div>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
