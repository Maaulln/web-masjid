import React from 'react';
import KegiatanForm from './KegiatanForm';
import DeleteActivityBtn from './DeleteActivityBtn';
import { Calendar as CalendarIcon, Clock } from '@phosphor-icons/react/dist/ssr';

import { prisma } from '@/lib/prisma';
import { formatDate, formatTime } from '@/lib/utils';

export default async function KegiatanAdminPage() {
  const activities = await prisma.activity.findMany({
    orderBy: { startDateTime: 'asc' },
    take: 100
  });

  const now = new Date();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-serif font-bold text-emerald-950">Manajemen Kegiatan</h2>
          <p className="text-[#787774] mt-1">Kelola jadwal kajian dan acara masjid</p>
        </div>
        <KegiatanForm />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.length === 0 ? (
          <div className="col-span-full py-12 text-center text-[#787774] bg-[#FDFBF7] ring-1 ring-emerald-950/5 rounded-2xl border-dashed">
            Belum ada jadwal kegiatan yang ditambahkan.
          </div>
        ) : (
          activities.map((act) => {
            const isActive = act.endDateTime >= now;
            
            return (
              <div key={act.id} className={`p-1.5 rounded-[2.5rem] ${isActive ? 'bg-emerald-950/5 ring-1 ring-emerald-950/5' : 'bg-black/5 ring-1 ring-black/5 opacity-75'} transition-all hover:shadow-md`}>
                <div className="bg-[#FDFBF7] rounded-[calc(2.5rem-0.375rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,1)] p-6 h-full flex flex-col relative overflow-hidden">
                  {isActive && (
                    <div className="absolute top-0 right-0 bg-emerald-950 text-[#FDFBF7] text-[10px] font-bold px-4 py-2 rounded-bl-2xl uppercase tracking-widest">
                      Aktif
                    </div>
                  )}
                  
                  <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-950 mb-3 inline-block px-3 py-1 bg-emerald-950/5 rounded-full w-fit">
                    {act.type}
                  </div>
                  
                  <h3 className="text-xl font-sans font-bold text-emerald-950 mb-2 tracking-tight">{act.title}</h3>
                  
                  {act.description && (
                    <p className="text-sm text-[#787774] mb-6 line-clamp-2">{act.description}</p>
                  )}

                  <div className="space-y-3 mt-auto mb-6">
                    <div className="flex items-center gap-3 text-sm text-[#787774]">
                      <CalendarIcon size={16} className="text-emerald-950/50" />
                      <span className="font-medium text-emerald-950">{formatDate(act.startDateTime)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[#787774]">
                      <Clock size={16} className="text-emerald-950/50" />
                      <span className="font-medium text-emerald-950">{formatTime(act.startDateTime)} - {formatTime(act.endDateTime)}</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-emerald-950/5 flex justify-end">
                    <DeleteActivityBtn id={act.id} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
