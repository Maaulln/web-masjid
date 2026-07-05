import React from 'react';

interface ActivityProps {
  title: string;
  description?: string | null;
  speaker?: string | null;
  startDateTime: Date;
  endDateTime: Date;
  location: string;
  posterUrl?: string | null;
}

export const ActivityCard: React.FC<ActivityProps> = ({ title, description, speaker, startDateTime, endDateTime, location, posterUrl }) => {
  return (
    <div className="p-6 bg-white border-l-4 border-emerald-700 rounded-r-lg shadow-sm flex flex-col gap-3 relative">
      <span className="absolute top-4 right-4 bg-emerald-50 text-emerald-800 text-xs font-bold px-2 py-1 rounded">AKTIF</span>
      <h4 className="font-bold text-lg text-slate-900">{title}</h4>
      {speaker && <p className="text-sm text-slate-600 font-semibold">Ustadz: {speaker}</p>}
      {description && <p className="text-sm text-slate-600">{description}</p>}
      {posterUrl && (
        <img 
          src={posterUrl} 
          alt={`Poster Kajian/Kegiatan: ${title} bersama ${speaker || 'Pengurus Masjid'}`} 
          className="w-full h-48 object-cover rounded-md mt-2" 
        />
      )}
      <div className="text-xs text-slate-500 mt-2 flex flex-col gap-1 border-t border-slate-100 pt-2">
        <span>⏳ Mulai: {startDateTime.toLocaleString('id-ID')}</span>
        <span>⏹️ Selesai: {endDateTime.toLocaleString('id-ID')}</span>
        <span>📍 Lokasi: {location}</span>
      </div>
    </div>
  );
};
