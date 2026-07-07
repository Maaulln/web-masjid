# Admin Dashboard Enhancement Design

## 1. Overview
Dashboard Admin Masjid saat ini hanya menampilkan 3 kartu ikhtisar: Total Kas, Donasi Menunggu, dan Kegiatan Berjalan. Tujuan dari desain ini adalah melengkapi dashboard menjadi pusat informasi yang lebih *powerful* dengan menambahkan statistik tambahan, visualisasi data berupa grafik, dan daftar aktivitas terbaru yang relevan dengan keuangan masjid.

## 2. Architecture & Components

Kita akan memodifikasi halaman `app/admin/dashboard/page.tsx` untuk menampilkan komponen-komponen berikut:

### 2.1. Statistik Tambahan (Kartu Ikhtisar Baru)
- **Total Jamaah Terdaftar**: Akan menghitung jumlah `User` dari database (tabel `User`).
- **UI**: Akan ditempatkan sejajar dengan 3 kartu yang sudah ada (Total Kas, Donasi Menunggu, Kegiatan Berjalan) sehingga menjadi grid 4 kolom atau 2x2 grid yang proporsional.

### 2.2. Grafik Finansial (Bar Chart)
- **Komponen**: "Pemasukan vs Pengeluaran 6 Bulan Terakhir".
- **Data Source**: Agregasi dari tabel `FinancialReport` (pemasukan & pengeluaran) yang dikelompokkan per bulan selama 6 bulan ke belakang.
- **Library/UI**: Menggunakan *Recharts* atau *Chart.js* (tergantung library yang sudah terpasang di project, kemungkinan *Recharts* jika menggunakan desain modern di Next.js).
- **Layout**: Ditempatkan di bawah bagian kartu ikhtisar dengan *card* tersendiri yang lebar.

### 2.3. Aktivitas Terbaru (Tabel)
- **Komponen**: "5 Transaksi Keuangan Terakhir".
- **Data Source**: Mengambil 5 baris terakhir dari tabel `FinancialReport` yang diurutkan berdasarkan tanggal terbaru (`orderBy: { date: 'desc' }`).
- **Data Ditampilkan**: Tanggal, Deskripsi, Kategori, Tipe (Pemasukan/Pengeluaran), dan Jumlah (Amount).
- **Layout**: Ditempatkan di samping atau di bawah grafik finansial, sebagai *card* berukuran sedang.

## 3. Data Flow

1. Fungsi `getDashboardData()` di dalam `page.tsx` akan diperbarui untuk mengambil:
   - Jumlah `User` (`prisma.user.count()`).
   - Data agregasi 6 bulan terakhir dari `FinancialReport`.
   - 5 entri terbaru dari `FinancialReport`.
2. Data akan dilempar (*passed*) ke *Client Component* untuk rendering grafik (karena grafik membutuhkan `use client`).

## 4. Error Handling & Testing
- Memastikan *fallback* (misal: "Belum ada transaksi") jika data `FinancialReport` kosong.
- Mengoptimalkan *query* Prisma agar pengambilan agregasi data per bulan tidak memberatkan server.
