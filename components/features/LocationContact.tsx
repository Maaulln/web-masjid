import React from 'react';

export const LocationContact = () => {
  return (
    <div className="p-1.5 bg-emerald-950/5 ring-1 ring-emerald-950/5 rounded-[2.5rem]">
      <div className="bg-[#FDFBF7] rounded-[calc(2.5rem-0.375rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,1)] flex flex-col md:flex-row overflow-hidden">
        
        {/* Left: Google Maps Embed */}
        <div className="flex-1 min-h-[400px] md:min-h-[500px] bg-gray-200 relative">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15865.176465492265!2d106.82025175!3d-6.224898!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e9a5940e79%3A0xc32c4fb7199c0a64!2sMasjid%20Al-Ikhlas!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid" 
            width="100%" 
            height="100%" 
            style={{ border: 0, filter: 'grayscale(0.6) contrast(1.1) opacity(0.9)' }} 
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 w-full h-full"
          ></iframe>
          <div className="absolute inset-0 ring-1 ring-inset ring-emerald-950/10 pointer-events-none"></div>
        </div>

        {/* Right: Contact Info */}
        <div className="flex-1 p-10 md:p-16 flex flex-col justify-center gap-10">
          <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-900">Lokasi Utama</span>
            <h3 className="text-3xl md:text-4xl font-serif text-emerald-950 leading-tight">Masjid Al-Ikhlas</h3>
            <p className="text-lg text-[#787774] leading-relaxed">
              Jl. Kemaslahatan Umat No. 99<br />
              Kecamatan Damai, Kota Sejahtera<br />
              12345
            </p>
          </div>
          
          <div className="w-full h-px bg-emerald-950/10"></div>
          
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#787774]">Layanan Takmir & Donasi</span>
              <span className="text-xl font-sans font-medium text-emerald-950">+62 812-3456-7890</span>
            </div>
            
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#787774]">Jam Operasional Sekretariat</span>
              <span className="text-lg text-emerald-950">08:00 - 16:00 (Setiap Hari)</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
