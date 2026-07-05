'use client';

import React, { useState } from 'react';
import { deleteActivity } from './actions';
import { Trash as Trash2 } from '@phosphor-icons/react/dist/ssr';

import toast from 'react-hot-toast';

export default function DeleteActivityBtn({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (confirm('Yakin ingin menghapus kegiatan ini?')) {
      setLoading(true);
      const res = await deleteActivity(id);
      setLoading(false);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success('Kegiatan dihapus');
      }
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
