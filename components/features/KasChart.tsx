'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface ChartData {
  month: string;
  pemasukan: number;
  pengeluaran: number;
}

interface KasChartProps {
  data: ChartData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#FDFBF7]/90 backdrop-blur-md p-5 border border-emerald-950/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl">
        <p className="font-bold text-emerald-950 mb-2">{label}</p>
        <p className="text-emerald-700 text-xs font-bold uppercase tracking-wider">
          Pemasukan: Rp {payload[0]?.value.toLocaleString('id-ID')}
        </p>
        <p className="text-orange-700 text-xs font-bold uppercase tracking-wider mt-2">
          Pengeluaran: Rp {payload[1]?.value.toLocaleString('id-ID')}
        </p>
      </div>
    );
  }
  return null;
};

export const KasChart: React.FC<KasChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-[#787774] border border-dashed border-emerald-950/10 rounded-3xl bg-transparent">
        Belum ada data grafik keuangan.
      </div>
    );
  }

  const formatYAxis = (tickItem: number) => {
    if (tickItem === 0) return '0';
    if (tickItem >= 1000000) return `Rp ${(tickItem / 1000000).toFixed(1)}Jt`;
    if (tickItem >= 1000) return `Rp ${(tickItem / 1000).toFixed(0)}rb`;
    return `Rp ${tickItem}`;
  };

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorPemasukan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#047857" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#047857" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPengeluaran" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#c2410c" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#c2410c" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="month" 
            tick={{ fill: '#787774', fontSize: 11, fontWeight: 600, textAnchor: 'middle' }} 
            axisLine={false} 
            tickLine={false} 
            dy={15} 
          />
          <YAxis 
            tickFormatter={formatYAxis} 
            tick={{ fill: '#787774', fontSize: 11, fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
            dx={-10}
          />
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(0,0,0,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
          <Area
            type="monotone"
            dataKey="pemasukan"
            name="Pemasukan"
            stroke="#047857"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorPemasukan)"
          />
          <Area
            type="monotone"
            dataKey="pengeluaran"
            name="Pengeluaran"
            stroke="#c2410c"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorPengeluaran)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
