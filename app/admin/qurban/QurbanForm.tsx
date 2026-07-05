'use client';

import React, { useRef, useState } from 'react';
import { addQurban } from './actions';
import { Plus } from '@phosphor-icons/react/dist/ssr';

import toast from 'react-hot-toast';

export default function QurbanForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await addQurban(formData);
    setLoading(false);
    
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success('Pendaftar Qurban berhasil ditambahkan');
      setIsOpen(false);
      formRef.current?.reset();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        <Plus size={20} />
        Tambah Mudhohi
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-emerald-950/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">Pendaftaran Qurban</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            
            <form ref={formRef} onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Mudhohi (Pekurban)</label>
                <input type="text" name="mudhohiName" required placeholder="Cth: Hamba Allah bin Fulan" className="w-full border border-slate-300 rounded-lg p-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">No. HP / WhatsApp (Opsional)</label>
                <input type="text" name="phoneNumber" placeholder="Cth: 08123456789" className="w-full border border-slate-300 rounded-lg p-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Hewan</label>
                <select name="animalType" required className="w-full border border-slate-300 rounded-lg p-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                  <option value="SAPI">Sapi (Kolektif / 7 Orang)</option>
                  <option value="KAMBING">Kambing / Domba</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status Pembayaran</label>
                <select name="status" required className="w-full border border-slate-300 rounded-lg p-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                  <option value="LUNAS">Lunas</option>
                  <option value="DP">Uang Muka (DP)</option>
                </select>
              </div>

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors">Batal</button>
                <button type="submit" disabled={loading} className="flex-1 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50">
                  {loading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
