# Aturan Proyek Masjid Miftahlul Jannah (Antigravity IDE)

Ini adalah panduan untuk agen AI saat memodifikasi, men-debug, atau membuat fitur di proyek ini.

## Konvensi Kode & Arsitektur
1. **Framework:** Menggunakan Next.js 16 App Router (`app/`). Komponen berada di `components/`.
2. **Server & Client Components:** 
   - Secara default gunakan Server Components. 
   - Tambahkan `'use client'` hanya jika membutuhkan state (useState), efek (useEffect), atau event handler (onClick).
3. **Database & Prisma:**
   - Gunakan `prisma.$transaction()` saat melakukan multiple query secara bersamaan (misal di Dashboard) untuk mencegah *Connection Pool Exhaustion* karena limit koneksi database serverless (`connection_limit=1`).
4. **Keamanan:**
   - Setiap route `/api` publik (seperti `/api/auth/register`, `/api/donasi`) **WAJIB** menerapkan rate limiting menggunakan fungsi `checkRateLimit` dari `lib/rate-limit.ts`.
   - Validasi input **WAJIB** menggunakan `zod` untuk endpoint API. (Ingat bahwa Zod v4 menggunakan `.issues`, bukan `.errors`).
   - Sesi autentikasi (`requireAdmin()` dan `middleware.ts`) selalu memeriksa role pengguna.

## Desain & Styling
1. **Tailwind CSS:** Gunakan styling yang sudah ada. Hindari style sembarang.
2. **Estetika Premium:** Proyek ini menggunakan warna *emerald-950*, *emerald-900*, latar *#FDFBF7*, serta bayangan *inset* (shadow) untuk kesan kartu elegan. Pertahankan estetika "editorial luxury" (elegan, minimalis, profesional).
3. **Animasi:** Gunakan Framer Motion untuk micro-interactions (hover scale, durasi 500-700ms).

## Lingkungan
- Pastikan tidak ada `ignoreBuildErrors: true` di konfigurasi TypeScript. 
- Sebelum menyelesaikan tugas, agen **WAJIB** menjalankan `npm run lint` dan `npm run build` untuk memverifikasi tidak ada build error.
