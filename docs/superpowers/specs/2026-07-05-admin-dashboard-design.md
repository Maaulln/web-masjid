# Phase 2: Admin Dashboard Design Spec

## 1. Arsitektur & Layout
- **Route Group**: Semua rute admin diletakkan di dalam `app/(admin)`.
- **Layout (`app/(admin)/layout.tsx`)**: 
  - **Sidebar (Kiri)**: Menampilkan tautan ke modul-modul (Dashboard, Keuangan, Donasi, Kegiatan, Qurban). Disertai tombol *Logout* di bawah.
  - **Topbar (Atas)**: Menampilkan judul halaman saat ini dan info admin (Email/Nama).
  - **Main Content**: Area dinamis yang me-render `children`.
- **Proteksi Rute**: Sudah ditangani oleh `middleware.ts` dari Phase 1 (hanya user dengan role `ADMIN` yang bisa masuk).

## 2. Modul & Fungsionalitas
1. **Dashboard Utama (`/admin/dashboard`)**:
   - Menampilkan *Summary Cards* (Total Saldo Kas, Total Donasi Pending, Jumlah Kegiatan Aktif Bulan Ini).
   - Menampilkan tabel *Recent Audit Trails* (Aktivitas terbaru admin).
2. **Manajemen Donasi (`/admin/donasi`)**:
   - Tabel donasi yang masuk dengan filter status (`PENDING`, `SUCCESS`, `FAILED`).
   - Tombol "Verifikasi" untuk donasi `PENDING` yang akan mengubah statusnya menjadi `SUCCESS` dan otomatis memicu pencatatan ke `FinancialReport` (menggunakan *Prisma Transaction* yang sudah kita uji di Phase 1).
3. **Manajemen Keuangan (`/admin/keuangan`)**:
   - Form input pencatatan manual: Pemasukan (Infaq/Jumat/dll) & Pengeluaran (Listrik/Operasional/dll).
   - Tabel riwayat transaksi keuangan lengkap.
4. **Manajemen Kegiatan (`/admin/kegiatan`)**:
   - Form tambah kegiatan (Judul, Tanggal Mulai, Tanggal Selesai, Deskripsi, Tipe).
   - Tabel daftar kegiatan dengan opsi Edit & Hapus.
5. **Manajemen Qurban (`/admin/qurban`)**:
   - Input data *mudhohi* (orang yang berkurban) dan tipe hewannya (Sapi/Kambing).
   - Status pembayaran (Lunas/DP).

## 3. Desain UI & Komponen
- Tetap menggunakan perpaduan **Tailwind CSS** dengan nuansa elegan (Emerald & Gold) atau minimalis modern (Zinc/Slate) agar seragam dengan Landing Page.
- Pembuatan komponen *Reusable*: `DataTable`, `Modal` (untuk form), dan `StatusBadge`.

## 4. Keamanan & Performa
- Semua mutasi data (Tambah/Edit/Hapus) menggunakan **Next.js Server Actions** untuk keamanan penuh di sisi server.
- Pencatatan log (*Audit Trail*) secara otomatis di setiap Server Action mutasi.
