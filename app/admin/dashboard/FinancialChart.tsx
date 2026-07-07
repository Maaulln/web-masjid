"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ChartData {
  month: string;
  income: number;
  expense: number;
}

export function FinancialChart({ data }: { data: ChartData[] }) {
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            dataKey="month" 
            tickLine={false} 
            axisLine={false}
            tick={{ fill: '#787774', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            tickFormatter={(value) => `Rp${value / 1000000}M`}
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#787774', fontSize: 12 }}
            dx={-10}
          />
          <Tooltip 
            formatter={(value: any) => [formatRupiah(Number(value)), ""]}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
            cursor={{ fill: 'transparent' }}
          />
          <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
          <Bar dataKey="income" name="Pemasukan" fill="#059669" radius={[4, 4, 0, 0]} barSize={24} />
          <Bar dataKey="expense" name="Pengeluaran" fill="#DC2626" radius={[4, 4, 0, 0]} barSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
