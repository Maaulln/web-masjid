'use client';

import React, { useState } from 'react';
import { verifyDonation, rejectDonation } from './actions';
import { Check, X } from 'lucide-react';

export default function VerifyButtons({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (confirm('Yakin ingin memverifikasi donasi ini? Ini akan menambah saldo kas secara otomatis.')) {
      setLoading(true);
      const res = await verifyDonation(id);
      setLoading(false);
      if (res.error) alert(res.error);
    }
  };

  const handleReject = async () => {
    if (confirm('Yakin ingin menolak donasi ini?')) {
      setLoading(true);
      const res = await rejectDonation(id);
      setLoading(false);
      if (res.error) alert(res.error);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        disabled={loading}
        onClick={handleVerify}
        className="p-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg transition-colors"
        title="Verifikasi"
      >
        <Check size={16} />
      </button>
      <button
        disabled={loading}
        onClick={handleReject}
        className="p-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors"
        title="Tolak"
      >
        <X size={16} />
      </button>
    </div>
  );
}
