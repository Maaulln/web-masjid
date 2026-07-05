'use client';

import React, { useRef, useState } from 'react';
import { addActivity } from './actions';
import { Plus } from '@phosphor-icons/react/dist/ssr';

import toast from 'react-hot-toast';

export default function KegiatanForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await addActivity(formData);
    setLoading(false);
    
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success('Kegiatan berhasil ditambahkan');
      setIsOpen(false);
      formRef.current?.reset();
    }
  };

  // Default to today for start, tomorrow for end
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const defaultStart = today.toISOString().slice(0, 16);
  const defaultEnd = tomorrow.toISOString().slice(0, 16);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        <Plus size={20} />
        Tambah Kegiatan
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-emerald-950/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">Tambah Kegiatan Baru</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            
            <form ref={formRef} onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Judul Kegiatan</label>
                <input type="text" name="title" required placeholder="Cth: Kajian Subuh Rutin" className="w-full border border-slate-300 rounded-lg p-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipe / Kategori</label>
                <input type="text" name="type" required placeholder="Cth: Kajian Umum" className="w-full border border-slate-300 rounded-lg p-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi (Opsional)</label>
                <textarea name="description" rows={3} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Waktu Mulai</label>
                <input type="datetime-local" name="startDateTime" required defaultValue={defaultStart} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Waktu Selesai</label>
                <input type="datetime-local" name="endDateTime" required defaultValue={defaultEnd} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
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
