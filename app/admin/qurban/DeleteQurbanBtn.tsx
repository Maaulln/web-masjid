'use client';

import React, { useState } from 'react';
import { deleteQurban } from './actions';
import { Trash2 } from 'lucide-react';

export default function DeleteQurbanBtn({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (confirm('Yakin ingin menghapus data qurban ini?')) {
      setLoading(true);
      const res = await deleteQurban(id);
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
