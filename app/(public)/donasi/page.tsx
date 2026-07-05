'use client';
import React, { useState } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function DonasiPage() {
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSuccess = (token: string) => setToken(token);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Harap selesaikan verifikasi Captcha.');
      return;
    }
    setError('');
    setMessage('');

    const res = await fetch('/api/donasi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, donorName: name, donorEmail: email, turnstileToken: token }),
    });

    const data = await res.json();
    if (data.error) {
      setError(data.error);
    } else {
      setMessage('Donasi berhasil didaftarkan! Mohon transfer nominal ke rekening masjid.');
      setAmount('');
      setName('');
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded-lg shadow-md w-full max-w-lg flex flex-col gap-4 border border-slate-100">
        <h2 className="text-2xl font-bold text-center text-emerald-800">Donasi Online Masjid</h2>
        {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}
        {message && <p className="text-emerald-700 text-sm font-semibold">{message}</p>}
        <Input label="Jumlah Donasi (Nominal Rp)" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required min="10000" />
        <Input label="Nama Donatur (Kosongkan jika Hamba Allah)" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Email Donatur" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        
        <div className="my-2 flex justify-center">
          <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x0000000000000000000000'} onSuccess={handleSuccess} />
        </div>
        
        <Button type="submit" className="w-full">Kirim Donasi</Button>
      </form>
    </div>
  );
}
