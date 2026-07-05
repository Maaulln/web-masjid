import React from 'react';
import { PrismaClient } from '@prisma/client';
import KegiatanForm from './KegiatanForm';
import DeleteActivityBtn from './DeleteActivityBtn';
import { Calendar as CalendarIcon, Clock } from '@phosphor-icons/react/dist/ssr';

const prisma = new PrismaClient();

export default async function KegiatanAdminPage() {
  const activities = await prisma.activity.findMany({
    orderBy: { startDateTime: 'asc' },
    take: 100
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const now = new Date();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Manajemen Kegiatan</h2>
          <p className="text-slate-500 mt-1">Kelola jadwal kajian dan acara masjid</p>
        </div>
        <KegiatanForm />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed">
            Belum ada jadwal kegiatan yang ditambahkan.
          </div>
        ) : (
          activities.map((act) => {
            const isActive = act.endDateTime >= now;
            
            return (
              <div key={act.id} className={`bg-white rounded-xl border p-5 relative overflow-hidden transition-all hover:shadow-md ${isActive ? 'border-emerald-200' : 'border-slate-200 opacity-75'}`}>
                {isActive && (
                  <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    Aktif
                  </div>
                )}
                
                <div className="text-xs font-medium text-emerald-600 mb-2 inline-block px-2 py-1 bg-emerald-50 rounded">
                  {act.type}
                </div>
                
                <h3 className="text-lg font-bold text-slate-800 mb-2">{act.title}</h3>
                
                {act.description && (
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{act.description}</p>
                )}

                <div className="space-y-2 mt-auto">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <CalendarIcon size={14} className="text-slate-400" />
                    <span>{formatDate(act.startDateTime)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock size={14} className="text-slate-400" />
                    <span>{formatTime(act.startDateTime)} - {formatTime(act.endDateTime)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                  <DeleteActivityBtn id={act.id} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
