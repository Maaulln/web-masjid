'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulasi pengiriman token pemulihan
    console.log(`Mengirim email reset password ke: ${email}`);
    setMessage('Tautan pemulihan password telah dikirim ke email Anda.');
    setEmail('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded-lg shadow-md w-full max-w-md flex flex-col gap-4 border border-slate-100">
        <h2 className="text-2xl font-bold text-center text-emerald-800">Lupa Password</h2>
        {message && <p className="text-emerald-700 text-sm font-semibold">{message}</p>}
        <Input label="Email Terdaftar" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Button type="submit" className="w-full mt-2">Kirim Tautan Reset</Button>
      </form>
    </div>
  );
}
