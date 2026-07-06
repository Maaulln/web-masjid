'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function RegisterPage() {
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded-lg shadow-md w-full max-w-md flex flex-col gap-4 border border-slate-100">
        <h2 className="text-2xl font-bold text-center text-emerald-800">Daftar Akun Masjid</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <Input label="Nama Lengkap" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button type="submit" className="w-full mt-2" disabled={loading}>
          {loading ? 'Mendaftar...' : 'Daftar'}
        </Button>
        <div className="text-sm mt-2 text-center text-emerald-700">
          Sudah punya akun? <Link href="/login" className="hover:underline font-semibold">Masuk di sini</Link>
        </div>
      </form>
    </div>
  );
}
