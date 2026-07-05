'use client';
import React, { useState } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const DonasiForm = () => {
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
    <div className="w-full p-1.5 bg-emerald-950/5 ring-1 ring-emerald-950/5 rounded-[2.5rem]">
      <form onSubmit={handleSubmit} className="bg-[#FDFBF7] p-8 md:p-14 rounded-[calc(2.5rem-0.375rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,1)] flex flex-col gap-6">
        
        {error && <div className="p-4 bg-orange-50 text-orange-700 rounded-2xl text-sm font-semibold border border-orange-100">{error}</div>}
        {message && <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl text-sm font-semibold border border-emerald-100">{message}</div>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Jumlah Donasi (Nominal Rp)" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required min="10000" />
          <Input label="Nama Donatur (Opsional)" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Hamba Allah" />
        </div>
        
        <Input label="Email Donatur (Opsional)" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Untuk bukti kuitansi digital" />
        
        <div className="my-4 flex justify-center">
          <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x0000000000000000000000'} onSuccess={handleSuccess} />
        </div>
        
        <Button type="submit" className="w-full py-4 text-xs font-bold tracking-widest uppercase rounded-full bg-emerald-950 hover:bg-emerald-900 text-white shadow-lg transition-colors">Salurkan Donasi</Button>
      </form>
    </div>
  );
};
