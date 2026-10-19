# Website SMK Negeri 1 Nusantara

Website frontend untuk menyajikan informasi sekolah, program keahlian, berita dan pengumuman, kontak, serta pendaftaran peserta didik baru (PPDB). Antarmuka dibuat responsif dan menyediakan navigasi mobile, carousel gambar, filter berita, pagination, dan formulir interaktif.

## Teknologi

- React 19 dan JavaScript (ES modules)
- Vite 8 sebagai development server dan build tool
- CSS biasa untuk styling dan responsive layout
- ESLint untuk pemeriksaan kualitas kode

## Menjalankan di komputer lokal

Pastikan Node.js dan npm sudah terpasang. Dari direktori proyek, jalankan:

```bash
cd frontend
npm install
npm run dev
```

Buka URL lokal yang ditampilkan Vite di terminal (biasanya `http://localhost:5173`).

## Perintah lain

Jalankan ESLint:

```bash
cd frontend
npm run lint
```

Buat build produksi:

```bash
cd frontend
npm run build
```

Pratinjau build produksi secara lokal:

```bash
cd frontend
npm run preview
```

## Catatan

Formulir kontak dan PPDB saat ini hanya menjalankan validasi/interaksi di browser. Pengiriman pesan, penyimpanan pendaftaran, dan unggah dokumen memerlukan layanan backend yang belum termasuk dalam proyek ini.
