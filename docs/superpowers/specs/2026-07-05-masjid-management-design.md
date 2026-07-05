# Design Specification: Website Management Masjid (Al-Ikhlas)

Dokumen ini mendefinisikan spesifikasi kebutuhan produk (PRD) dan arsitektur teknis untuk pengembangan Website Management Masjid dengan pendekatan bertahap.

---

## 1. Ringkasan Proyek & Tujuan
Website Management Masjid dirancang untuk mempermudah tata kelola administrasi masjid (keuangan, kegiatan/kajian, qurban, dan donasi) serta memberikan keterbukaan informasi (transparansi kas) kepada jamaah dan publik.

### Peta Jalan Pengembangan (Phased Roadmap)
*   **Fase 1: Inti Sistem & Manajemen Publik (Selesai pada rilis ini)**
    *   Landing Page dengan Transparansi Kas & Kegiatan Terjadwal (Auto-Off).
    *   Autentikasi Multi-role (Admin, User Terdaftar, Tamu).
    *   Manajemen Donasi Manual (Upload bukti transfer) dengan Turnstile & Rate-limiting.
    *   Pengelolaan Keuangan manual & Ekspor CSV.
    *   Manajemen Qurban (Mudhohi & Penyaluran Kupon).
*   **Fase 2: ZISWAF & Sistem Otomasi (Out of Scope untuk Fase 1)**
    *   Modul Kalkulator Zakat & Pengumpulan Zakat/ZISWAF digital terperinci.
    *   Integrasi otomatisasi Payment Gateway (Midtrans/Xendit) untuk donasi dan ZISWAF tanpa verifikasi manual.
    *   Laporan keuangan terperinci (Neraca, Arus Kas standar PSAK 45/ISAK 35).

---

## 2. Pilihan Teknologi (Tech Stack)
*   **Framework Utama**: Next.js 14+ (App Router)
*   **Bahasa Pemrograman**: TypeScript
*   **Styling & UI**: TailwindCSS, Lucide React (ikon)
*   **Database**: PostgreSQL
*   **ORM**: Prisma ORM
*   **Autentikasi & Otorisasi**: NextAuth.js (Auth.js) dengan JWT strategy

---

## 3. Pembagian Peran (Multi-role)
Sistem memiliki 3 level hak akses yang dikelola melalui middleware Next.js:

1.  **Pengunjung Umum / Non-role (Tamu)**
    *   Hanya dapat mengakses Landing Page publik (`/`).
    *   Membaca jadwal kajian, galeri, dan transparansi laporan kas masjid.
    *   Melakukan donasi online (mengisi form & mengunggah bukti transfer tanpa login).
    *   Mendaftar akun (`/register`) dan masuk (`/login`).
2.  **User Terdaftar (`USER`)**
    *   Mengakses Halaman Dashboard User (`/dashboard`).
    *   Melihat riwayat donasi pribadi yang pernah dilakukan.
    *   Melakukan donasi dengan profil yang otomatis terisi.
3.  **Super Admin / Admin Masjid (`ADMIN`)**
    *   Mengakses Halaman Dashboard Admin (`/admin`).
    *   Mengelola keuangan masjid (mencatat pemasukan & pengeluaran kas secara manual).
    *   Mengelola jadwal kegiatan/kajian masjid (dengan rentang waktu aktif).
    *   Memverifikasi donasi masuk (mengubah status donasi dari `PENDING` menjadi `SUCCESS`).
    *   Mengelola data penerimaan dan penyaluran Qurban.

### Catatan Arsitektur: Skalabilitas Peran Masa Depan (Role Extensibility)
*   Meskipun Fase 1 hanya membatasi role pada `ADMIN` dan `USER` guna menyederhanakan peluncuran awal, arsitektur role ini dirancang agar mudah diskalakan tanpa merusak data (*breaking changes*).
*   Di masa depan, jika dibutuhkan pembagian wewenang yang lebih rinci bagi pengurus (misalnya: **Bendahara/Treasurer** yang hanya berhak atas keuangan/donasi, dan **Panitia Qurban** yang hanya mengurusi qurban):
    *   Enum `Role` pada database PostgreSQL dapat ditambahkan nilai baru (misal: `TREASURER`, `CHAIRMAN`, `QURBAN_STAFF`) melalui Prisma migration.
    *   Logika otorisasi di `middleware.ts` dan Server Actions akan disesuaikan menggunakan pemetaan kebijakan (*policy-based access control*), bukan sekadar pengecekan string tunggal (misalnya: `if (user.role === 'ADMIN' || user.role === 'TREASURER')` untuk rute `/admin/keuangan`).
    *   Ini memastikan migrasi peran baru tidak merusak data pengguna lama yang sudah ada.

---


## 4. Estetika, Desain Visual, SEO & Aksesibilitas (UI/UX)
*   **Tema Warna**: **Emerald & Gold (Klasik & Elegan)**
    *   Primer: Emerald Green (`#065f46` / `#047857`) - memberikan kesan Islami yang tenang dan profesional.
    *   Aksen: Warm Gold (`#d97706` / `#b45309`) - digunakan untuk tombol aksi penting (seperti "Donasi").
    *   Latar Belakang: Light Slate (`#f8fafc`) dengan teks gelap slate (`#1e293b`) untuk kontras tinggi.
*   **Tipografi**: Menggunakan Google Fonts **Plus Jakarta Sans** atau **Inter** untuk tampilan sans-serif yang modern dan bersih.
*   **Fitur Visual**: Glassmorphism (efek kaca blur) pada navigasi atas (navbar) dan kartu transparansi kas, serta micro-animations (efek hover transisi halus) pada tombol dan kartu info kegiatan.

### A. Persyaratan SEO & Berbagi (OpenGraph)
*   **Meta Tags Deskriptif**: Setiap halaman publik wajib memuat judul dan meta-description yang relevan (terutama untuk optimalisasi SEO mesin pencari).
*   **WhatsApp/Telegram Link Preview (OpenGraph)**:
    Menambahkan OpenGraph metadata pada root layout (`layout.tsx`) agar saat tautan dibagikan ke WhatsApp grup pengurus/jamaah, muncul preview yang indah:
    *   `og:title`: "Sistem Informasi & Donasi Masjid Al-Ikhlas"
    *   `og:description`: "Transparansi saldo kas, jadwal kegiatan kajian, dan donasi online cepat untuk kemaslahatan umat."
    *   `og:image`: Gambar representasi masjid (favicon / logo resolusi tinggi 1200x630).
    *   `og:type`: "website"

### B. Persyaratan Aksesibilitas (Accessibility / WCAG AA)
*   **Rasio Kontras Warna (Contrast Ratio)**:
    *   Teks di atas latar belakang **Emerald Green (`#065f46`)** wajib menggunakan warna putih bersih (`#ffffff`) atau hijau sangat terang untuk memenuhi rasio kontras WCAG AA (minimal 4.5:1).
    *   Teks di atas latar belakang **Warm Gold (`#d97706`)** **TIDAK BOLEH** menggunakan warna putih. Wajib menggunakan teks berwarna sangat gelap (`text-slate-900` atau `#1f2937`) agar terbaca dengan jelas oleh penyandang gangguan penglihatan (low vision).
*   **Aksesibilitas Media (Alt Text)**:
    *   Semua tag `<img>` untuk poster kegiatan wajib memiliki atribut `alt` yang deskriptif dan dinamis berdasarkan data database (contoh: `alt={`Poster Kajian: ${activity.title} bersama ${activity.speaker}`}`).
    *   Tombol ikonik (tanpa teks) wajib menyertakan atribut `aria-label` yang jelas.

### C. Kebijakan Privasi Donatur & Keamanan Kredensial
*   **Kebijakan Privasi (`/privacy-policy`)**:
    *   Halaman statis `/privacy-policy` ditambahkan di footer publik untuk menginformasikan penggunaan data donatur.
    *   Sistem berkomitmen hanya menyimpan data kontak (Email & Nomor WhatsApp) untuk verifikasi pembayaran, notifikasi penerimaan, dan pengiriman bukti transfer.
    *   **Anonimitas Publik**: Donatur dapat mencentang opsi "Anonim (Hamba Allah)" saat donasi. Nama asli mereka tidak akan dipublikasikan pada halaman transparansi kas (ditampilkan sebagai "Hamba Allah"), tetapi data identitas & kontak tetap disimpan secara privat di database untuk diaudit oleh Admin.
*   **Pemulihan Kredensial (Forgot Password)**:
    *   Rute `/forgot-password` disediakan untuk pengguna terdaftar yang lupa kata sandinya.
    *   Proses reset menggunakan token unik bertanda waktu (OTP atau tautan verifikasi email) yang dikirim ke email terdaftar menggunakan Nodemailer/Resend untuk keamanan akses.

---


## 5. Skema Database (Prisma Schema)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  ADMIN
  USER
}

enum FlowType {
  INCOME  // Pemasukan
  EXPENSE // Pengeluaran
}

enum DonationStatus {
  PENDING
  SUCCESS
  FAILED
}

enum QurbanType {
  SAPI
  KAMBING
  DOMBA
}

enum QurbanStatus {
  RECEIVED     // Diterima
  SLAUGHTERED  // Disembelih
  DISTRIBUTED  // Disalurkan
}

enum DistributionStatus {
  PENDING
  DISTRIBUTED
}

enum RecipientCategory {
  FAKIR_MISKIN
  WARGA_SEKITAR
  PANITIA
  MUSTAHIK_LUAR
}

model User {
  id           String     @id @default(uuid())
  name         String
  email        String     @unique
  passwordHash String
  role         Role       @default(USER)
  donations    Donation[]
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
}

model Activity {
  id            String   @id @default(uuid())
  title         String
  description   String?
  startDateTime DateTime // Waktu mulai kegiatan/kajian
  endDateTime   DateTime // Waktu berakhir kegiatan (Logika Auto-Off)
  speaker       String?  // Penceramah/Ustadz
  location      String   @default("Ruang Utama Masjid")
  posterUrl     String?  // Foto/pamflet kegiatan
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model FinancialReport {
  id          String   @id @default(uuid())
  type        FlowType
  amount      Float
  description String
  date        DateTime @default(now())
  category    String   // Contoh: "Jumat", "Operasional", "Renovasi", "Donasi Online"
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Donation {
  id             String         @id @default(uuid())
  amount         Float
  donorName      String         @default("Hamba Allah")
  donorEmail     String?
  status         DonationStatus @default(PENDING)
  paymentProof   String?        // URL bukti transfer jika manual
  paymentType    String         @default("MANUAL") // "MANUAL" atau "GATEWAY"
  gatewayRef     String?        // ID referensi transaksi dari Midtrans/Xendit untuk audit & sync
  userId         String?        // Terhubung jika user login
  user           User?          @relation(fields: [userId], references: [id])
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt
}

model Qurban {
  id            String               @id @default(uuid())
  mudhohiName   String               // Nama pekurban
  mudhohiEmail  String?
  mudhohiPhone  String?
  type          QurbanType
  weight        Float?               // Berat hewan qurban (opsional)
  price         Float?               // Harga jika dibeli via masjid
  status        QurbanStatus         @default(RECEIVED)
  distributions QurbanDistribution[] // Relasi penyaluran daging qurban
  createdAt     DateTime             @default(now())
  updatedAt     DateTime             @updatedAt
}

model QurbanDistribution {
  id               String             @id @default(uuid())
  recipientName    String             // Nama penerima manfaat
  recipientAddress String?
  category         RecipientCategory  @default(FAKIR_MISKIN)
  couponNumber     String             @unique // Nomor kupon qurban
  status           DistributionStatus @default(PENDING)
  qurbanId         String?            // Relasi opsional ke hewan Qurban asal daging
  qurban           Qurban?            @relation(fields: [qurbanId], references: [id])
  distributedAt    DateTime?          // Tanggal & waktu penyerahan daging
  createdAt        DateTime           @default(now())
  updatedAt        DateTime           @updatedAt
}


model AuditTrail {
  id        String   @id @default(uuid())
  userId    String
  userEmail String
  action    String   // Contoh: "Memverifikasi Donasi ID [id]", "Menambah Kas Pemasukan"
  details   String?  // Info tambahan dalam format JSON string
  createdAt DateTime @default(now())
}
```



---

## 6. Detail Logika & Alur Fitur Utama

### A. Fitur Kegiatan Otomatis Off (Active Time Range Filter)
Setiap kegiatan didefinisikan dengan rentang waktu aktif mulai (`startDateTime`) dan berakhir (`endDateTime`).
*   **Logika Filter Tampilan**:
    Pada query halaman utama (Landing Page), Next.js Server Component hanya akan menarik kegiatan yang belum kedaluwarsa dengan filter Prisma berikut:
    ```typescript
    const activeActivities = await prisma.activity.findMany({
      where: {
        endDateTime: {
          gte: new Date(), // Menampilkan kegiatan yang waktu berakhirnya >= waktu saat ini
        },
      },
      orderBy: {
        startDateTime: 'asc',
      },
    });
    ```
*   **Dampak**: Ketika waktu di server melewati `endDateTime` suatu kegiatan, kegiatan tersebut secara otomatis tidak akan dirender di Landing Page publik tanpa memerlukan intervensi manual dari Admin.

### B. Otomatisasi Integrasi Keuangan (Donasi & Qurban) & Audit Logging
Untuk menjaga keakuratan laporan kas masjid serta akuntabilitas data admin:
1.  **Alur Donasi Sukses**:
    *   Setiap donasi masuk berstatus `PENDING`.
    *   Admin memverifikasi bukti transfer donasi di dashboard `/admin/donasi`.
    *   Saat tombol "Verifikasi" ditekan, sistem menjalankan transaksi database terenkapsulasi (**Prisma transaction**) untuk:
        *   Mengubah status `Donation` menjadi `SUCCESS`.
        *   Membuat data baru pada tabel `FinancialReport` dengan tipe `INCOME` dan kategori `"Donasi Online"`, serta jumlah (`amount`) yang sama dengan nilai donasi.
        *   Mencatat aksi ini ke dalam tabel `AuditTrail` untuk merekam siapa admin yang melakukan verifikasi tersebut.
2.  **Alur Pembayaran Qurban**:
    *   Setiap kali ada pendaftaran Qurban baru di mana mudhohi melakukan pembayaran melalui masjid (nilai `price` terisi dan divalidasi oleh admin):
    *   Sistem secara otomatis (dalam transaksi database terenkapsulasi) akan:
        *   Membuat data `Qurban` baru dengan status `RECEIVED`.
        *   Membuat data baru pada tabel `FinancialReport` dengan tipe `INCOME` dan kategori `"Qurban"`, serta jumlah (`amount`) yang sama dengan nilai `price` qurban tersebut dengan deskripsi `"Pembayaran Qurban Mudhohi: [Nama Mudhohi]"`.
        *   Mencatat entri pada `AuditTrail` (misal: "Admin Ahmad mencatat penerimaan qurban & kas masuk dari Mudhohi: [Nama]").
3.  Setiap mutasi kas di atas (Donasi & Qurban) akan memicu revalidasi cache data keuangan sehingga tampilan saldo kas di Landing Page terupdate secara real-time.


### C. Optimasi Cache & Revalidasi Kas (Next.js Revalidation)
*   Laporan kas di Landing Page di-load menggunakan fungsi yang di-cache menggunakan tag khusus:
    ```typescript
    const getCachedFinancialSummary = unstable_cache(
      async () => fetchFinancialSummaryFromDb(),
      ['financial-summary-key'],
      { tags: ['financial-summary'] }
    );
    ```
*   Setiap kali Admin menambahkan laporan kas manual (`/admin/keuangan`) atau memverifikasi donasi masuk (`/admin/donasi`), server action Next.js akan memanggil:
    ```typescript
    revalidateTag('financial-summary');
    ```
*   Hal ini memastikan Landing Page memuat kas secara instan untuk pengunjung (dari cache) dan diperbarui secara otomatis hanya saat ada perubahan data di sisi admin.

### D. Keamanan & Strategi Penyimpanan Unggah Bukti Transfer (Reused helper for Donasi & Qurban)
Formulir donasi publik serta formulir pembayaran Qurban menerima unggahan file bukti transfer. Untuk menjamin keamanan aplikasi dan menghindari duplikasi kode (*DRY Principle*), serta mengatasi sifat **ephemeral filesystem** di hosting Vercel (di mana file disk lokal akan hilang secara otomatis):
1.  **Object Storage Cloud Permanen**: File **TIDAK BOLEH** disimpan di penyimpanan disk lokal server. File wajib diunggah secara langsung ke Cloud Object Storage eksternal, seperti **Vercel Blob**, **Cloudflare R2**, atau **AWS S3**.
2.  **Penyimpanan URL di Database**: Kolom `paymentProof` di model `Donation` dan bukti pembayaran di model `Qurban` akan menyimpan **URL lengkap absolut** dari Object Storage (misal: `https://[bucket-name].public.blob.vercel-storage.com/bukti-[uuid].png`), bukan path disk lokal.
3.  **Fungsi Utility Bersama (Shared Helper)**: Logika interaksi dengan cloud storage dipusahkan menjadi helper tunggal di `/lib/upload.ts` yang melayani modul donasi maupun qurban.
4.  **Validasi Client & Server**: File divalidasi ganda di sisi front-end (untuk responsivitas UI) dan di tingkat API backend (sebagai gerbang keamanan utama).
5.  **Ukuran File**: Ukuran file dibatasi maksimal **2MB** untuk efisiensi transfer data dan penyimpanan.
6.  **Sanitisasi Tipe File (MIME-Type)**: Hanya menerima tipe file gambar (`image/png`, `image/jpeg`, `image/jpg`). Ekstensi dan header file dicek secara ketat di server Next.js sebelum di-stream ke Object Storage.
7.  **Enkripsi Nama File**: Nama file asli diubah secara acak menggunakan UUID baru untuk menghindari serangan *overwriting* dan *directory traversal*.



### E. Perlindungan Anti-Spam & Rate Limiting (Form Donasi Publik)
Form donasi online yang dapat diakses tanpa login (oleh tamu) rawan disalahgunakan oleh bot untuk spamming data dan spam upload file. 
*   **Integrasi Captcha (Cloudflare Turnstile)**:
    *   Halaman Donasi (`DonationForm.tsx`) mengintegrasikan widget **Cloudflare Turnstile** (menggunakan library `@marsidev/react-turnstile` atau script HTML Turnstile).
    *   Sebelum form disubmit, pengguna harus melewati verifikasi Turnstile untuk mendapatkan token verifikasi client.
    *   Token ini dikirimkan ke backend Next.js API Route/Server Actions bersama payload donasi.
    *   Di tingkat backend, token diverifikasi menggunakan fetch API ke endpoint Cloudflare:
        ```typescript
        const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
          method: "POST",
          body: JSON.stringify({ secret: process.env.TURNSTILE_SECRET_KEY, response: token }),
          headers: { "Content-Type": "application/json" }
        });
        const outcome = await res.json();
        if (!outcome.success) throw new Error("Verifikasi Captcha Gagal!");
        ```
*   **Rate Limiting di API Route / Server Actions**:
    *   Membatasi jumlah request submit donasi dari satu IP address yang sama untuk mencegah serangan brute force / kehabisan bandwidth.
    *   Menggunakan `@upstash/ratelimit` berbasis Redis (atau library memory-cache sederhana di level Middleware/API) dengan batas maksimum **5 kali pengajuan donasi per jam per IP Address**:
        ```typescript
        const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
        const { success } = await ratelimit.limit(ip);
        if (!success) {
          return new Response("Terlalu Banyak Permintaan. Silakan coba lagi dalam beberapa jam.", { status: 429 });
        }
        ```

### F. Mekanisme Notifikasi (WhatsApp & Email)
Sistem notifikasi diimplementasikan untuk memberikan kepastian kepada donatur dan kemudahan pemantauan bagi pengurus masjid:
1.  **Notifikasi untuk Donatur (Saat Terverifikasi)**:
    *   Setiap kali Admin mengubah status donasi dari `PENDING` ke `SUCCESS` (setelah verifikasi manual), sistem secara asinkronus memicu pengiriman pesan terima kasih.
    *   **WhatsApp API (Fonnte / Wablas)**: Mengirim pesan WhatsApp ke nomor telepon donatur (jika diisi) yang berisi ringkasan donasi (Nama, Nominal, Tanggal, dan doa penerimaan donasi).
    *   **Email (Resend / Nodemailer)**: Jika email donatur diisi, email HTML dengan template resmi berwarna Emerald & Gold akan dikirim secara otomatis sebagai tanda terima donasi.
2.  **Notifikasi untuk Admin (Saat Donasi Baru Masuk)**:
    *   Setiap kali ada donasi baru yang masuk dengan status `PENDING`, sistem akan mengirimkan notifikasi instan ke nomor WhatsApp Admin utama menggunakan API Fonnte/Wablas.
    *   Hal ini mengurangi kebutuhan admin untuk terus-menerus mengecek halaman `/admin/donasi` secara manual.


---



## 7. Reusable Component Architecture & Konsistensi Style
Untuk menjaga konsistensi gaya visual **Emerald & Gold** serta kerapian kode, komponen visual dipisahkan dari halaman utama ke dalam struktur komponen reusable.

### A. Klasifikasi Komponen
1.  **UI Components (`components/ui`)**: Komponen atomik murni tanpa state database, menerima props untuk styling standar.
    *   `Button.tsx`: Tombol standar dengan varian tema `primary` (emerald), `secondary` (gold), dan `outline`.
    *   `Card.tsx`: Wadah modular dengan styling border halus dan efek bayangan (shadow) konsisten.
    *   `Badge.tsx`: Label status kecil (contoh: status donasi `PENDING`, `SUCCESS`, status kegiatan `AKTIF`).
    *   `Input.tsx`: Input field terstandarisasi untuk form.
2.  **Shared Components (`components/shared`)**: Komponen layout utama yang digunakan di berbagai halaman.
    *   `Navbar.tsx`: Navigasi atas dengan efek glassmorphism transparan dan blur backdrop.
    *   `Footer.tsx`: Kaki halaman dengan informasi hak cipta dan sosial media masjid.
    *   `Sidebar.tsx`: Navigasi samping khusus dashboard admin (`/admin`) dan user (`/dashboard`).
3.  **Feature Components (`components/features`)**: Komponen kompleks yang berinteraksi dengan API atau memuat logika bisnis tertentu.
    *   `KasSummary.tsx`: Panel ringkasan kas (Pemasukan, Pengeluaran, Saldo Sisa).
    *   `ActivityCard.tsx`: Menampilkan informasi kajian beserta penanda status "Aktif".
    *   `DonationForm.tsx`: Formulir donasi yang digunakan di landing page maupun dashboard.

---

## 8. Struktur Folder Proyek Clean Architecture
```text
/
├── app/                  # Next.js App Router (Routing & Pages)
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── forgot-password/page.tsx  # Halaman Pemulihan/Lupa Password
│   ├── (public)/
│   │   ├── page.tsx      # Landing Page (mengonsumsi KasSummary & ActivityCard)
│   │   ├── donasi/page.tsx
│   │   ├── privacy-policy/page.tsx   # Halaman Kebijakan Privasi Donatur
│   │   └── unauthorized/page.tsx
│   ├── dashboard/        # Dashboard User
│   │   ├── page.tsx
│   │   ├── donations/page.tsx
│   │   └── profile/page.tsx
│   ├── admin/            # Dashboard Admin
│   │   ├── page.tsx
│   │   ├── keuangan/page.tsx
│   │   ├── kegiatan/page.tsx
│   │   ├── qurban/page.tsx
│   │   └── donasi/page.tsx
│   ├── api/auth/[...nextauth]/route.ts
│   ├── layout.tsx
│   └── middleware.ts

├── components/           # Reusable UI & Feature Components
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   └── Input.tsx
│   ├── shared/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   └── features/
│       ├── KasSummary.tsx
│       ├── ActivityCard.tsx
│       └── DonationForm.tsx
├── prisma/
│   ├── schema.prisma     # Skema Database PostgreSQL
│   └── seed.ts           # Script inisialisasi akun ADMIN pertama
├── public/               # File statis (logo, pamflet kajian)
└── styles/
    └── globals.css       # CSS Global & Tailwind Configuration
```


---

## 9. Fitur Ekspor Laporan Keuangan ke CSV
Untuk mendukung transparansi dan kebutuhan pelaporan offline bagi pengurus masjid, data laporan keuangan dapat diekspor ke file `.csv` melalui halaman `/admin/keuangan`.
*   **Alur Implementasi**:
    1.  Admin menekan tombol "Ekspor CSV" di halaman laporan keuangan.
    2.  Next.js API route (`/api/keuangan/export`) mengambil data dari tabel `FinancialReport` menggunakan Prisma, memfilter berdasarkan rentang tanggal yang dipilih admin (opsional).
    3.  Data tersebut diformat menjadi format CSV standar (termasuk kolom: Tanggal, Deskripsi, Tipe (Pemasukan/Pengeluaran), Kategori, dan Nominal).
    4.  Response dikirim kembali dengan header `Content-Type: text/csv` dan `Content-Disposition: attachment; filename=laporan-keuangan-masjid-[tanggal].csv` sehingga browser otomatis mengunduh file tersebut.

---

## 10. Aturan Penulisan Kode (Clean Code Rules)
Untuk menjaga keterbacaan kode (maintainability) dan skalabilitas jangka panjang, setiap developer wajib mengikuti aturan penulisan kode berikut:

1.  **Strict TypeScript**: TypeScript strict mode harus diaktifkan. Hindari penggunaan tipe `any`. Semua parameter fungsi dan response API wajib memiliki tipe data/interface yang jelas.
2.  **Standardisasi Ikon (SVG Only)**:
    *   Semua ikon di aplikasi wajib menggunakan format **SVG** murni agar tajam, responsif, dan konsisten.
    *   Disarankan menggunakan library **Lucide React** (yang berbasis SVG) secara eksklusif. 
    *   Jika menggunakan SVG kustom, simpan sebagai komponen React di dalam `/components/ui/icons/` dan pastikan memiliki warna `currentColor` agar dapat dikontrol ukurannya dengan TailwindCSS (`w-5 h-5 text-emerald-600`).
3.  **Clean Code Conventions**:
    *   **Kecil dan Fokus**: Satu file komponen React maksimal berisi 150-200 baris kode. Jika lebih besar, bagi ke sub-komponen.
    *   **Penamaan File**: Gunakan PascalCase untuk file komponen (misal: `Button.tsx`, `KasSummary.tsx`) dan camelCase untuk file utilitas/API (misal: `export.ts`).
    *   **Pemisahan Logika & Tampilan**: Gunakan Next.js Server Actions untuk interaksi database. Hindari menulis logika SQL/Prisma mentah langsung di dalam komponen UI client.

---

## 11. Definition of Done (DoD)
Setiap fitur atau modul baru dianggap selesai dan siap digabungkan (merge) hanya jika memenuhi kriteria berikut:

*   [ ] **Bebas Error Build**: Aplikasi dapat dikompilasi dengan sukses (`npm run build` berhasil tanpa error TypeScript atau linting).
*   [ ] **Keamanan Akses (Otorisasi)**: Proteksi rute telah divalidasi. Pengguna tanpa role yang sesuai diredirect dengan benar dan tidak dapat memanggil API terproteksi.
*   [ ] **Responsif & Konsistensi Style**: Desain antarmuka diuji di layar desktop, tablet, dan mobile, serta konsisten dengan palet warna **Emerald & Gold** serta menggunakan ikon SVG yang seragam.
*   [ ] **Pengujian Otomatis (Green Tests)**: Seluruh pengujian otomatis (Unit & Integration tests) lolos dengan tingkat kelulusan 100% (`npm run test` sukses).
*   [ ] **Uji Logika Otomatis & Transaksi**:
    *   Sistem menyembunyikan otomatis kegiatan yang melewati `endDateTime`.
    *   Transaksi donasi yang berhasil memicu pencatatan kas otomatis dengan benar di database.
    *   Ekspor CSV menghasilkan file dengan data yang lengkap dan format tanggal yang sesuai standar.
*   [ ] **Sistem Notifikasi & Audit**:
    *   Pesan WhatsApp/Email berhasil dikirim ke donatur dan admin saat donasi berstatus sukses/masuk.
    *   Setiap aksi admin terekam dengan sukses di tabel `AuditTrail`.

---

## 12. Strategi Backup & Kebijakan Retensi Audit Trail
Untuk menjamin keamanan, ketersediaan, dan kepatuhan hukum atas data keuangan masjid yang sensitif secara sosial, diimplementasikan strategi berikut:

### A. Strategi Backup Database Otomatis
*   **Backup Otomatis Harian (Daily Automated Backup)**:
    *   Database PostgreSQL diatur untuk melakukan backup harian otomatis (database dump) pada pukul 02:00 WIB (saat trafik rendah) menggunakan fitur snapshot dari provider cloud database (seperti Supabase, Railway, atau AWS RDS).
    *   Snapshot disimpan di penyimpanan cloud terpisah (seperti AWS S3 / Cloudflare R2) yang berbeda dari server database utama untuk menghindari kegagalan titik tunggal (*Single Point of Failure*).
*   **Retensi Backup**: Backup harian disimpan dengan masa retensi minimal **30 hari ke belakang** sebelum dihapus secara otomatis.

### B. Kebijakan Retensi Audit Trail & Pengarsipan (Retention Policy)
*   **Masa Aktif Data (Active Retention)**: Data `AuditTrail` (log aktivitas admin) akan disimpan dalam database utama selama **1 tahun (12 bulan)** untuk kebutuhan audit aktif.
*   **Prosedur Pembersihan (Auto-cleanup / Archiving)**:
    *   Sistem akan menjalankan cron job terjadwal secara bulanan (menggunakan pg_cron atau task scheduler server) untuk menghapus atau mengarsipkan data audit yang berusia lebih dari 1 tahun agar performa query database tetap optimal:
        ```sql
        DELETE FROM "AuditTrail" WHERE "createdAt" < NOW() - INTERVAL '1 year';
        ```
    *   Sebelum dihapus dari database utama, data audit tahun lalu tersebut secara otomatis diekspor ke file CSV/JSON terkompresi dan disimpan di arsip penyimpanan eksternal pengurus masjid untuk kebutuhan dokumentasi jangka panjang.

---

## 13. Strategi Pengujian Otomatis (Testing Strategy)
Untuk meminimalkan regresi fungsional dan memastikan kualitas aplikasi, kita menerapkan pengujian otomatis menggunakan **Jest** dan **React Testing Library** (atau **Vitest**):

### A. Unit Testing (Logika Bisnis & Model Database)
*   **Filter Kegiatan Terjadwal (Auto-Off)**:
    *   Menguji logika filter query `Activity`.
    *   *Test Case 1*: Memasukkan data mock kegiatan dengan `endDateTime` yang sudah lewat dari `new Date()`. Memastikan data tersebut tidak terambil di hasil akhir query.
    *   *Test Case 2*: Memasukkan kegiatan aktif (waktu selesai di masa depan). Memastikan data terambil dengan benar.
*   **Transaksi Donasi ke Kas & Logging Audit**:
    *   Menguji fungsi Server Action untuk memverifikasi donasi.
    *   Memastikan jika database gagal mengupdate status donasi, transaksi di-rollback secara penuh (kas tidak bertambah dan audit trail tidak ditulis).
    *   Memastikan jika transaksi sukses, status donasi bernilai `SUCCESS`, record kas baru tercipta dengan relasi yang benar, dan `AuditTrail` tercatat dengan kredensial penguji.

### B. Integration Testing (Otorisasi Rute & API)
*   **Next.js Middleware (Route Guard)**:
    *   Mocking token JWT NextAuth.js untuk mensimulasikan permintaan dari berbagai jenis user.
    *   *Test Case 1*: Request ke `/admin/keuangan` oleh token dengan `role: USER` menghasilkan redirect ke `/unauthorized`.
    *   *Test Case 2*: Request ke `/admin/keuangan` oleh token dengan `role: ADMIN` diizinkan lewat.
    *   *Test Case 3*: Request ke `/dashboard` tanpa token JWT menghasilkan redirect ke `/login`.
*   **API Ekspor CSV**:
    *   Memastikan request GET ke `/api/keuangan/export` dari user tanpa otorisasi ADMIN mengembalikan HTTP 403.
    *   Memastikan request dari ADMIN menghasilkan header response `text/csv` yang valid dan file berhasil diunduh.

---

## 14. Environment, Deployment & CI/CD Pipeline

### A. Manajemen Environment Variables
Semua kunci rahasia dan konfigurasi eksternal dikelola melalui file `.env` di server dan disediakan `.env.example` di repositori git:
```text
# Database Connection
DATABASE_URL="postgresql://[user]:[password]@[host]:[port]/[db]?schema=public"

# NextAuth Config
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="kunci-rahasia-jwt-min-32-karakter"

# Cloudflare Turnstile Captcha
NEXT_PUBLIC_TURNSTILE_SITE_KEY="site-key-turnstile"
TURNSTILE_SECRET_KEY="secret-key-turnstile"

# WhatsApp API (Fonnte/Wablas)
FONNTE_API_TOKEN="token-api-fonnte"
FONNTE_SENDER="nomor-pengirim-terdaftar"

# Email Configuration (Resend/Nodemailer)
RESEND_API_KEY="re_key_rahasia"
```

### B. Target Hosting & Arsitektur Cloud
*   **Frontend & Serverless Backend**: Di-host di **Vercel** karena merupakan standar industri untuk optimalisasi deployment Next.js monolitik (mendukung ISR caching, Edge Middleware, dan integrasi repositori instan).
*   **Database PostgreSQL**: Menggunakan managed database cloud provider seperti **Supabase** atau **Railway** yang andal untuk region terdekat (Singapore/Jakarta) guna menekan latensi kueri database.

### C. Pipeline CI/CD (GitHub Actions Workflow)
Setiap *Pull Request* ke branch `main` harus melewati pemeriksaan otomatis sebelum bisa digabungkan (merge-gate). 
Buat berkas workflow di `.github/workflows/ci.yml`:
```yaml
name: Continuous Integration Checks

on:
  pull_request:
    branches: [ main ]
  push:
    branches: [ main ]

jobs:
  verify:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout Repository
      uses: actions/checkout@v4

    - name: Setup Node.js Environment
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'

    - name: Install Dependencies
      run: npm ci

    - name: Run ESLint Checks
      run: npm run lint

    - name: Run TypeScript Compile Check
      run: npx tsc --noEmit

    - name: Run Automated Tests
      run: npm run test
      env:
        DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/test-db?schema=public"
        NEXTAUTH_SECRET: "mock-secret-for-ci-testing"

    - name: Verify Production Build
      run: npm run build
      env:
        DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/test-db?schema=public"
        NEXTAUTH_SECRET: "mock-secret-for-ci-testing"
```



