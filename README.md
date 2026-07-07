# 🕌 Sistem Informasi & Donasi Masjid Miftahlul Jannah

Sistem Informasi Manajemen Masjid modern berbasis web yang dilengkapi dengan fitur transparansi keuangan publik, manajemen kegiatan, donasi online, dan pendaftaran kurban. Dirancang dengan desain premium, responsif, dan fokus pada keamanan tinggi.

## 🚀 Fitur Utama

### 👥 Portal Publik (Jamaah)
- **Dashboard Transparansi Kas**: Tampilan real-time pemasukan, pengeluaran, dan saldo kas masjid.
- **Jadwal Sholat Otomatis**: Indikator waktu sholat terdekat berdasarkan waktu lokal perangkat.
- **Donasi Online**: Formulir donasi yang aman dengan integrasi Turnstile CAPTCHA (opsi Hamba Allah/Anonim).
- **Pendaftaran Kurban**: Formulir pendaftaran mudhohi (Sapi/Kambing).
- **Galeri & Informasi Kegiatan**: Jadwal kajian dan aktivitas masjid.
- **Portal Akun Jamaah**: Riwayat donasi dan status transaksi personal.

### 🛡️ Portal Admin
- **Dashboard Analitik**: Grafik keuangan 6 bulan terakhir dan metrik kunci.
- **Verifikasi Donasi**: Sistem *Approve/Reject* donasi yang masuk dengan pencatatan otomatis ke kas.
- **Manajemen Keuangan**: Input manual kas masuk/keluar & Export ke CSV.
- **Manajemen Kegiatan**: Penambahan jadwal kegiatan/kajian (otomatis disembunyikan saat sudah berlalu).
- **Manajemen Qurban**: Pengelolaan data pekurban dan status (Pending, Diterima, Disembelih).

## 🛠️ Tech Stack
- **Framework:** Next.js 16 (App Router) + Turbopack
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Phosphor Icons
- **Animation:** Framer Motion
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Authentication:** NextAuth.js (Credentials, JWT)
- **Security:** Cloudflare Turnstile, Zod Validation, LRU Rate Limiting, Strict Security Headers

## 📦 Cara Instalasi & Menjalankan (Local Development)

1. **Clone repository ini**
   ```bash
   git clone https://github.com/Maaulln/web-masjid.git
   cd web-masjid
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment Variables**
   Buat file `.env` di root direktori berdasarkan `.env.example`:
   ```env
   DATABASE_URL="postgresql://user:pass@host:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://user:pass@host:5432/postgres"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="random_secret_string"
   NEXT_PUBLIC_TURNSTILE_SITE_KEY="your_site_key"
   TURNSTILE_SECRET_KEY="your_secret_key"
   ```

4. **Setup Database (Prisma)**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed # Opsional: Untuk mengisi data dummy awal (admin, kas, kegiatan)
   ```
   *Akun Admin default (jika di-seed): `admin@masjid-alikhlas.or.id` / `AdminIkhlas123`*

5. **Jalankan Development Server**
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di browser.

## 🔒 Catatan Keamanan
Aplikasi ini menerapkan standar keamanan tinggi:
- **Connection Pool**: Menggunakan `prisma.$transaction` untuk menghindari kebocoran pool koneksi di serverless.
- **Rate Limiting**: LRU Cache mencegah spam login, register, dan donasi.
- **Magic Bytes Validation**: Memastikan file gambar upload tidak mengandung script berbahaya.
- **Security Headers**: HSTS, CSP (Content Security Policy), dan pencegahan clickjacking.

## 📝 Lisensi
Proyek ini dibuat untuk kebutuhan pengelolaan Masjid Miftahlul Jannah. 
