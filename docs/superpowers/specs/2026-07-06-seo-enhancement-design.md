# SEO Enhancement Design Spec

## Purpose
Meningkatkan SEO (Search Engine Optimization) aplikasi masjid agar lebih mudah ditemukan di mesin pencari (seperti Google). Target utamanya mencakup peningkatan pada seluruh fitur publik (Kajian, Donasi, Profil) dengan melakukan optimasi teknis menggunakan Next.js App Router (sitemap, robots, schema markup, metadata).

## Architecture & Components

### 1. Metadata Dinamis & Static (Next.js Metadata API)
*   **Halaman Statis:** Pembaruan `<title>` dan `<meta name="description">` yang mengandung keyword yang tepat di `app/layout.tsx` dan `app/(public)/page.tsx`.
*   **Halaman Dinamis:** Menggunakan `generateMetadata` untuk mengelola metadata halaman yang bergantung pada data secara otomatis.

### 2. Schema Markup (JSON-LD)
*   Pembuatan komponen React khusus (reusable) `<JsonLd />` untuk menyisipkan data terstruktur.
*   **Beranda:** Menggunakan schema tipe `Mosque` (turunan `LocalBusiness`) untuk mendeskripsikan Masjid Miftahlul Jannah (lokasi, nama, dsb).
*   **Kajian:** Menggunakan tipe `Event` (jika ada data kajian yang dirender) atau schema lain jika relevan.
*   **Umum/Donasi:** Menggunakan tipe `WebPage` pada halaman publik lainnya.

### 3. Sitemap & Robots
*   **sitemap.ts:** File `app/sitemap.ts` untuk menghasilkan sitemap XML statis/dinamis yang mendaftarkan semua rute publik (`/`, `/donasi`, `/layanan`, `/kurban`, `/profil`, dll).
*   **robots.ts:** File `app/robots.ts` yang mengizinkan bot merayapi seluruh halaman publik, tetapi secara eksplisit memblokir (`Disallow`) akses ke `/admin/*`, `/api/*`, `/login`, dan `/register`.

## Data Flow
*   File `sitemap.ts` mendata direktori publik dan mempublikasikannya ke `/sitemap.xml`.
*   File `robots.ts` merender policy secara otomatis di `/robots.txt`.
*   Next.js Metadata di render secara native di head halaman saat SSR.

## Success Criteria
*   Dapat mengakses URL `/sitemap.xml` dan `/robots.txt` di browser dengan output yang valid.
*   Pengecekan *source code* menampilkan tag `<script type="application/ld+json">` yang berisikan data terstruktur JSON-LD di halaman utama.
*   Halaman admin dan autentikasi terlindungi dari crawling.

## Out of Scope
*   Pembuatan modul/tabel database baru untuk fitur Blog atau Artikel. SEO hanya memaksimalkan halaman dan fitur yang saat ini sudah eksis.
