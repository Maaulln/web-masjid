'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function KurbanForm() {
  const [mudhohiName, setMudhohiName] = useState('');
  const [mudhohiPhone, setMudhohiPhone] = useState('');
  const [type, setType] = useState('SAPI');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/qurban/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mudhohiName, mudhohiPhone, type }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Terjadi kesalahan');

      setMessage('Pendaftaran Kurban berhasil! Pengurus kami akan segera menghubungi Anda melalui WhatsApp.');
      setMudhohiName('');
      setMudhohiPhone('');
      setType('SAPI');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg p-1.5 bg-emerald-950/5 ring-1 ring-emerald-950/10 rounded-[2.5rem] transform transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.01]">
      <div className="bg-white p-8 md:p-12 rounded-[calc(2.5rem-0.375rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,1)] relative overflow-hidden">
        
        <h2 className="text-2xl font-serif text-emerald-950 mb-8">Formulir Mudhohi</h2>
        
        {error && <div className="p-4 bg-orange-50 text-orange-700 rounded-2xl text-sm font-semibold border border-orange-100 mb-6">{error}</div>}
        {message && <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl text-sm font-semibold border border-emerald-100 mb-6">{message}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
          <Input 
            label="Nama Lengkap (Sohibul Qurban)" 
            type="text" 
            value={mudhohiName} 
            onChange={(e) => setMudhohiName(e.target.value)} 
            required 
            placeholder="Misal: Budi Santoso bin Fulan"
          />
          
          <Input 
            label="Nomor WhatsApp" 
            type="tel" 
            value={mudhohiPhone} 
            onChange={(e) => setMudhohiPhone(e.target.value)} 
            required 
            placeholder="08123456789"
          />

          <div className="w-full flex flex-col gap-2">
            <label className="text-[11px] uppercase tracking-wider font-semibold text-[#787774] font-sans">Pilihan Hewan</label>
            <div className="relative">
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value)} 
                className="w-full px-3 py-3 h-[48px] bg-white border border-[#EAEAEA] rounded-[8px] focus:outline-none focus:ring-1 focus:ring-emerald-950 focus:border-emerald-950 font-sans text-emerald-950 transition-colors appearance-none"
              >
                <option value="SAPI">Sapi (Utuh)</option>
                <option value="SAPI_PATUNGAN">Sapi (Patungan 1/7)</option>
                <option value="KAMBING">Kambing / Domba</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-emerald-950">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-emerald-950/5">
            <p className="text-xs text-[#787774] font-medium leading-relaxed mb-6">
              *Dengan mendaftar, panitia akan memverifikasi kesediaan Anda dan memberikan rincian harga hewan kurban tahun ini.
            </p>
            <button 
              type="submit" 
              disabled={loading}
              className="group relative w-full flex items-center justify-center gap-4 bg-emerald-950 text-[#FDFBF7] px-8 py-4 rounded-full font-sans font-semibold tracking-wide overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] disabled:opacity-70"
            >
              <span className="relative z-10">{loading ? 'Memproses...' : 'Daftar Sekarang'}</span>
              {!loading && (
                <div className="relative z-10 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
