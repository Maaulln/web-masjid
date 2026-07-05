'use client';

import React, { useState } from 'react';
import { deleteFinancialRecord } from './actions';
import { Trash2 } from 'lucide-react';

export default function DeleteButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (confirm('Yakin ingin menghapus rekam ini? Aksi ini tidak dapat dibatalkan.')) {
      setLoading(true);
      const res = await deleteFinancialRecord(id);
      setLoading(false);
      if (res.error) alert(res.error);
    }
  };

  return (
    <button
      disabled={loading}
      onClick={handleDelete}
      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
      title="Hapus"
    >
      <Trash2 size={16} />
    </button>
  );
}
