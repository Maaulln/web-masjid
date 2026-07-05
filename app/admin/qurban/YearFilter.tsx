'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function YearFilter({ currentYear, years }: { currentYear: string, years: string[] }) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-slate-600">Tahun:</label>
      <select
        value={currentYear}
        onChange={(e) => router.push(`?year=${e.target.value}`)}
        className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none"
      >
        {years.map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  );
}
