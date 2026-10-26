# PROMPT FINAL — PENGEMBANGAN WEBSITE SEKOLAH, SISTEM PPDB, DAN DEPLOYMENT VERCEL

## 1. Peran dan Tujuan

Bertindaklah sebagai Senior Full-Stack Developer yang berpengalaman dalam React, Vite, Node.js, Express.js, Supabase, REST API, keamanan aplikasi web, dan deployment Vercel.

Saya memiliki website informasi sekolah yang saat ini masih berupa frontend statis. Saya ingin mengembangkan website tersebut menjadi aplikasi web dinamis yang terintegrasi dengan database, autentikasi, dashboard admin, dashboard peserta, pendaftaran PPDB, manajemen berita, pencarian, filter, dan pagination.

Website sudah memiliki landing page. Pertahankan desain, identitas visual, komponen, layout, dan fitur yang sudah berfungsi. Jangan membangun ulang website dari awal jika kode yang tersedia masih dapat digunakan.

**Tujuan utama:** menghasilkan aplikasi yang dapat dijalankan secara lokal, terintegrasi dengan Supabase, aman berdasarkan role pengguna, serta siap di-deploy ke Vercel.

## 2. Teknologi Wajib

Gunakan stack berikut:

- Frontend: React + Vite.
- Backend: Node.js + Express.js.
- Database: Supabase PostgreSQL.
- Authentication: Supabase Auth.
- File Storage: Supabase Storage.
- HTTP Client: Axios.
- Frontend Routing: React Router.
- Hosting frontend dan backend: Vercel.
- Version control: Git dan GitHub.

Gunakan JavaScript mengikuti konvensi proyek yang sudah ada.

Jangan mengganti stack dengan Next.js, Laravel, Firebase, atau teknologi backend lain.

## 3. Strategi Arsitektur dan Deployment

Gunakan arsitektur yang kompatibel dengan Vercel.

Target arsitektur:

```text
Pengguna
   |
   v
Frontend React + Vite
   |
   | Axios / HTTPS
   v
Backend Express.js
(Vercel Functions)
   |
   v
Supabase
   |
   +-- PostgreSQL
   +-- Auth
   +-- Storage
```

Ketentuan:

1. Frontend dan backend harus terintegrasi melalui REST API.
2. Supabase menjadi layanan database, autentikasi, dan penyimpanan file.
3. Backend Express menangani logika bisnis, validasi, otorisasi, dan operasi data.
4. Autentikasi menggunakan Supabase Auth.
5. Frontend dapat menggunakan Supabase Auth untuk login, registrasi, dan pengelolaan sesi.
6. Endpoint privat harus memverifikasi access token Supabase.
7. Operasi data bisnis harus melalui backend Express.
8. Jangan mengekspos service role key kepada frontend.
9. Jangan mengasumsikan server Express konvensional yang berjalan terus-menerus tersedia di Vercel.
10. Sesuaikan entry point, routing API, dan konfigurasi Express dengan runtime Vercel Functions.

**Strategi deployment utama:** gunakan satu repositori GitHub dengan frontend dan backend terpisah secara logis. Jika konfigurasi monorepo pada Vercel menjadi rumit, gunakan dua proyek Vercel dari repositori yang sama: satu untuk frontend dan satu untuk backend.

Pilih konfigurasi yang paling sederhana, stabil, dan mudah dipelihara. Dokumentasikan keputusan arsitektur tersebut.

## 4. Tahap Pertama: Audit Proyek

Sebelum mengubah kode, lakukan audit:

- Periksa struktur folder frontend dan backend.
- Periksa seluruh `package.json`.
- Periksa routing, halaman, komponen, CSS, dan aset.
- Identifikasi formulir PPDB yang sudah tersedia.
- Identifikasi bagian yang masih menggunakan data statis.
- Periksa dependensi yang sudah digunakan.
- Periksa konfigurasi Supabase jika sudah ada.
- Periksa konfigurasi Git dan deployment jika tersedia.
- Identifikasi komponen yang dapat digunakan kembali.

Setelah audit, sampaikan ringkasan struktur proyek dan rencana implementasi. Kemudian lanjutkan pengerjaan secara bertahap tanpa menunggu persetujuan tambahan, kecuali terdapat keputusan penting atau kredensial yang benar-benar diperlukan.

Jangan menghapus fitur yang masih berfungsi dan jangan melakukan refactoring besar tanpa alasan teknis.

## 5. Landing Page

Pertahankan desain landing page yang tersedia.

Lakukan perubahan berikut:

- Pindahkan formulir pendaftaran PPDB ke dashboard peserta.
- Landing page menampilkan informasi sekolah, informasi PPDB, persyaratan, jadwal, alur pendaftaran, dan berita terbaru.
- Tambahkan CTA **Masuk / Daftar** pada pojok kanan atas navbar.
- Pengguna yang belum login diarahkan ke halaman login atau registrasi.
- Peserta yang sudah login diarahkan ke dashboard peserta.
- Admin yang sudah login diarahkan ke dashboard admin.
- Ambil berita terbaru dari backend.
- Buat halaman daftar berita dan detail berita.
- Pastikan seluruh halaman responsif.
- Pertahankan warna, tipografi, layout, dan identitas visual website.
- Jangan menghapus halaman informasi sekolah lain yang masih relevan.

## 6. Login dan Registrasi

### A. Login

Buat halaman login dengan field:

- Email.
- Password.

Fitur:

- Autentikasi melalui Supabase Auth.
- Validasi input.
- Tombol tampilkan atau sembunyikan password.
- Loading state dan pesan error.
- Pemulihan password melalui email jika dikonfigurasi.
- Pemulihan sesi setelah refresh.
- Logout.
- Pengalihan berdasarkan role.

Pengalihan:

- Admin → `/admin/dashboard`
- Peserta → `/peserta/dashboard`

### B. Registrasi peserta

Field:

- Nama lengkap.
- Email.
- Nomor telepon.
- Password.
- Konfirmasi password.

Ketentuan:

- Gunakan Supabase Auth.
- Simpan informasi tambahan pada tabel `profiles`.
- Role default adalah `peserta`.
- Registrasi publik tidak boleh membuat akun admin.
- Validasi email, nomor telepon, dan password.
- Tangani email yang sudah terdaftar.
- Tangani verifikasi email jika diaktifkan.
- Jangan menyimpan password dalam tabel aplikasi atau localStorage.

## 7. Dashboard Admin

Buat dashboard admin dengan sidebar, navbar, kartu statistik, tabel, formulir, notifikasi, dan tampilan responsif.

### A. Statistik

Tampilkan data aktual:

- Total pendaftar.
- Pendaftar menunggu.
- Pendaftar diproses.
- Pendaftar diterima.
- Pendaftar ditolak.
- Jumlah berita yang dipublikasikan.

Jangan gunakan angka dummy setelah integrasi database selesai.

### B. Manajemen pendaftar PPDB

Tabel berisi:

- Nomor pendaftaran.
- Nama lengkap.
- NISN.
- Email.
- Nomor telepon.
- Asal sekolah.
- Tanggal pendaftaran.
- Status.
- Aksi detail.

Fitur:

- Melihat seluruh pendaftar.
- Melihat detail pendaftaran.
- Mengubah status pendaftaran.
- Menambahkan catatan admin.
- Pencarian dan filter.
- Pengurutan.
- Pagination.
- Reset filter.
- Jumlah hasil pencarian.
- Loading, error, dan empty state.

Status pendaftaran:

- `menunggu`
- `diproses`
- `diterima`
- `ditolak`

Semua perubahan harus disimpan ke Supabase melalui backend.

Admin tidak boleh melihat password atau kredensial autentikasi peserta.

### C. Manajemen berita

Buat fitur CRUD berita.

Field:

- Judul.
- Slug.
- Ringkasan.
- Isi berita.
- Gambar sampul.
- Status publikasi.
- Penulis.
- Tanggal pembuatan.
- Tanggal pembaruan.
- Tanggal publikasi.

Fitur:

- Membuat berita.
- Melihat daftar dan detail berita.
- Mengedit berita.
- Menghapus berita dengan konfirmasi.
- Mengunggah gambar.
- Mengganti gambar sampul.
- Menyimpan draft.
- Memublikasikan berita.
- Menyimpan perubahan ke Supabase.

Gunakan Supabase Storage untuk gambar. Simpan path gambar pada tabel berita.

Status:

- `draft`
- `published`

Berita draft hanya boleh diakses admin. Pengunjung publik hanya dapat melihat berita published.

Validasi MIME type dan ukuran file. Pastikan file lama dapat dibersihkan ketika gambar diganti atau berita dihapus, tanpa menghapus file yang masih digunakan.

### D. Pencarian dan filter berita admin

Pencarian:

- Judul berita.
- Ringkasan berita.

Filter:

- Status draft atau published.
- Rentang tanggal.
- Penulis jika terdapat beberapa admin.

Pengurutan:

- Terbaru.
- Terlama.
- Judul A–Z.
- Judul Z–A.

Sediakan pagination, reset filter, jumlah hasil, loading state, dan empty state.

## 8. Dashboard Peserta

Buat dashboard peserta yang hanya dapat diakses oleh role `peserta`.

Menu:

- Ringkasan.
- Formulir PPDB.
- Status pendaftaran.
- Profil akun.

### A. Ringkasan

Tampilkan:

- Nama peserta.
- Nomor pendaftaran jika tersedia.
- Status pendaftaran.
- Informasi periode PPDB.
- Langkah selanjutnya.
- Informasi jika pendaftaran belum dibuka atau formulir belum dikirim.

### B. Formulir PPDB

Pindahkan formulir PPDB yang sudah ada dari landing page ke dashboard peserta.

Audit formulir sebelumnya dan pertahankan field yang relevan. Jika belum tersedia, gunakan field:

- Nama lengkap.
- NISN.
- Tempat lahir.
- Tanggal lahir.
- Jenis kelamin.
- Alamat lengkap.
- Asal sekolah.
- Nomor telepon.
- Nama orang tua atau wali.
- Nomor telepon orang tua atau wali.
- Pilihan jurusan atau program keahlian jika relevan.

Ketentuan:

- Isi otomatis nama dan nomor telepon dari profil jika tersedia.
- Validasi seluruh field wajib pada frontend dan backend.
- Izinkan penyimpanan draft.
- Tampilkan ringkasan sebelum pengiriman.
- Minta konfirmasi sebelum mengirim formulir.
- Buat nomor pendaftaran unik melalui backend.
- Simpan data ke Supabase.
- Cegah pendaftaran ganda pada periode yang sama.
- Tampilkan nomor pendaftaran setelah pengajuan.
- Tampilkan status terbaru.
- Batasi perubahan data sesuai status dan kebijakan PPDB.

Jika upload dokumen diperlukan, gunakan bucket privat untuk dokumen sensitif.

### C. Status pendaftaran

Tampilkan:

- Nomor pendaftaran.
- Tanggal pengajuan.
- Status.
- Catatan admin.
- Informasi langkah selanjutnya.

Peserta tidak boleh mengubah status pendaftarannya sendiri.

### D. Profil peserta

Fitur:

- Melihat dan mengubah nama lengkap.
- Melihat email.
- Mengubah nomor telepon.
- Mengubah password melalui Supabase Auth.
- Logout.

## 9. Pencarian, Filter, Pengurutan, dan Pagination

Implementasikan pencarian dan filter yang terintegrasi dengan Express dan Supabase PostgreSQL.

### A. Data pendaftar

Pencarian:

- Nama lengkap.
- Nomor pendaftaran.
- NISN.
- Email.

Filter:

- Status.
- Tanggal mulai dan tanggal akhir.
- Asal sekolah.
- Jurusan jika tersedia.

Pengurutan:

- Tanggal terbaru.
- Tanggal terlama.
- Nama A–Z.
- Nama Z–A.

Fitur tambahan:

- Kombinasi pencarian dan beberapa filter.
- Pagination.
- Reset filter.
- Jumlah hasil.
- Loading, error, dan empty state.

### B. Berita publik

Sediakan:

- Pencarian berdasarkan judul.
- Filter kategori jika kategori memang diperlukan.
- Pengurutan berita terbaru atau terlama.
- Pagination atau tombol Muat Lebih Banyak.
- Empty state.

Hanya berita published yang boleh masuk hasil pencarian publik.

### C. Riwayat peserta

Jika aplikasi mendukung beberapa periode PPDB, peserta dapat memfilter riwayat berdasarkan periode dan status.

Jika hanya ada satu pendaftaran aktif, cukup tampilkan detail dan status tanpa menambahkan fitur yang tidak diperlukan.

### D. Ketentuan teknis

- Terapkan pencarian dan filter pada database.
- Gunakan Axios untuk mengirim query parameter.
- Terapkan debounce 300–500 milidetik.
- Reset halaman ke halaman pertama ketika filter berubah.
- Pertahankan filter ketika berpindah halaman.
- Batasi nilai `limit`.
- Validasi semua parameter di backend.
- Gunakan allowlist untuk kolom pengurutan.
- Validasi format tanggal.
- Gunakan query Supabase yang aman.
- Jangan membuat SQL mentah dari penggabungan string input pengguna.
- Batalkan request lama jika memungkinkan.
- Pastikan pencarian tidak dapat digunakan untuk mengakses data di luar hak pengguna.

Contoh:

`GET /api/ppdb?search=andi&status=menunggu&page=1&limit=10&sortBy=created_at&sortOrder=desc`

`GET /api/admin/news?search=pendidikan&status=published&page=1&limit=10&sortBy=created_at&sortOrder=desc`

`GET /api/news?search=pendidikan&page=1&limit=10&sortBy=published_at&sortOrder=desc`

Gunakan metadata pagination yang konsisten, misalnya:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

## 10. Database Supabase

Buat SQL migration yang dapat dijalankan melalui Supabase SQL Editor.

### A. Tabel `profiles`

Kolom:

- `id`: UUID primary key yang mereferensikan `auth.users.id`.
- `full_name`.
- `phone`.
- `role`.
- `created_at`.
- `updated_at`.

Buat mekanisme pembuatan profil yang aman setelah registrasi. Pengguna tidak boleh mengubah role sendiri.

### B. Tabel `ppdb_applications`

Kolom:

- `id`.
- `registration_number`.
- `user_id`.
- `period_id` jika diperlukan.
- `nisn`.
- `birth_place`.
- `birth_date`.
- `gender`.
- `address`.
- `previous_school`.
- `phone`.
- `parent_name`.
- `parent_phone`.
- `major_choice` jika relevan.
- `status`.
- `admin_notes`.
- `submitted_at`.
- `created_at`.
- `updated_at`.

Tambahkan foreign key, constraint, indeks, dan unique constraint yang sesuai. Nomor pendaftaran harus unik.

### C. Tabel `news`

Kolom:

- `id`.
- `title`.
- `slug`.
- `excerpt`.
- `content`.
- `cover_image_path`.
- `status`.
- `author_id`.
- `published_at`.
- `created_at`.
- `updated_at`.

Tambahkan indeks yang dibutuhkan.

### D. Pengaturan PPDB

Jika diperlukan, buat tabel `ppdb_settings` untuk mengatur periode, tanggal pembukaan dan penutupan, serta status pendaftaran.

Backend harus memeriksa apakah periode pendaftaran masih terbuka sebelum menerima pengajuan.

## 11. Backend Express REST API

Gunakan backend yang sudah tersedia. Jika belum tersedia, buat backend Express terpisah dari frontend.

Gunakan Supabase JavaScript SDK untuk operasi database dan verifikasi autentikasi.

### Profil dan autentikasi

- `GET /api/auth/me`
- `GET /api/profile`
- `PATCH /api/profile`

Login dan registrasi dapat menggunakan Supabase Auth dari frontend.

### PPDB

- `GET /api/ppdb` — admin, mendukung pencarian, filter, sort, dan pagination.
- `GET /api/ppdb/me` — peserta.
- `GET /api/ppdb/:id` — detail sesuai izin.
- `POST /api/ppdb` — membuat pendaftaran.
- `PATCH /api/ppdb/me` — memperbarui pendaftaran sendiri jika diizinkan.
- `PATCH /api/ppdb/:id/status` — admin.

### Berita

- `GET /api/news` — berita publik.
- `GET /api/news/:slug` — detail berita published.
- `GET /api/admin/news` — berita admin.
- `POST /api/admin/news` — membuat berita.
- `PATCH /api/admin/news/:id` — mengedit berita.
- `DELETE /api/admin/news/:id` — menghapus berita.
- `POST /api/admin/news/upload` — mengunggah gambar.

### Statistik

- `GET /api/admin/dashboard/stats`

Implementasikan:

- Middleware autentikasi Supabase.
- Middleware otorisasi berdasarkan role.
- Validasi input.
- Pemeriksaan kepemilikan data.
- Error handler terpusat.
- HTTP status code yang sesuai.
- CORS yang terbatas pada domain yang diizinkan.
- Rate limiting untuk endpoint sensitif.
- Pagination, pencarian, dan filter pada database.
- Logging tanpa token atau informasi sensitif.

Nomor pendaftaran harus dibuat melalui mekanisme yang aman dengan constraint database untuk mencegah duplikasi.

## 12. Integrasi Frontend React + Vite

Pertahankan struktur proyek jika sudah terorganisasi.

Jika belum, gunakan struktur modular seperti:

```text
src/
├── components/
├── layouts/
├── pages/
│   ├── auth/
│   ├── admin/
│   ├── peserta/
│   └── news/
├── routes/
├── contexts/
├── hooks/
├── services/
├── utils/
├── App.jsx
└── main.jsx
```

Buat konfigurasi Axios terpusat untuk base URL dan access token.

Implementasikan:

- Auth context atau mekanisme state autentikasi yang sesuai.
- Protected routes.
- Role-based routes.
- Loading state.
- Error state.
- Empty state.
- Notifikasi.
- Validasi formulir.
- Pemulihan sesi.
- Penanganan token kedaluwarsa.
- Debounce pencarian.
- Komponen filter yang dapat digunakan kembali.
- Pagination dan jumlah hasil.

Jangan mengandalkan localStorage sebagai sumber kebenaran role.

## 13. Keamanan

Terapkan prinsip least privilege.

- Aktifkan RLS pada tabel yang dapat diakses melalui Supabase Data API.
- Peserta hanya dapat mengakses data miliknya sendiri.
- Admin yang berwenang dapat melihat seluruh pendaftar.
- Hanya admin yang dapat mengubah status pendaftaran.
- Pengunjung publik hanya dapat membaca berita published.
- Hanya admin yang dapat mengelola berita.
- Gunakan bucket privat untuk dokumen sensitif.
- Verifikasi JWT Supabase pada backend.
- Jangan mengekspos service role key pada frontend.
- Jangan memasukkan secret ke variabel `VITE_`.
- Jangan mengizinkan pengguna menetapkan role sendiri.
- Jika backend menggunakan service role key, lakukan pemeriksaan autentikasi, otorisasi, dan kepemilikan data sebelum operasi.
- Siapkan prosedur aman untuk membuat admin pertama.
- Jangan menganggap route guard frontend cukup untuk mengamankan data.

## 14. Konfigurasi Environment Variables

Buat `.env.example` untuk frontend dan backend.

### Frontend

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

### Backend

```env
PORT=5000
FRONTEND_URL=http://localhost:5173

SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

Sesuaikan nama variabel dengan implementasi SDK. Service role key hanya digunakan jika diperlukan dan hanya di backend.

Jangan mengisi `.env.example` dengan kredensial asli. Masukkan file `.env` ke `.gitignore`.

## 15. Deployment Vercel

Siapkan proyek agar dapat di-deploy ke Vercel.

### A. Frontend

- Build menggunakan `npm run build`.
- Gunakan output directory `dist`.
- Konfigurasikan URL backend melalui `VITE_API_BASE_URL`.
- Pastikan React Router bekerja saat halaman di-refresh.
- Tambahkan rewrite SPA jika diperlukan.
- Pastikan tidak ada secret backend dalam bundle frontend.

### B. Backend

- Deploy Express sebagai Vercel Function.
- Gunakan entry point dan routing API yang kompatibel dengan Vercel.
- Pastikan backend tidak bergantung pada proses server lokal yang berjalan terus-menerus.
- Pastikan upload gambar menggunakan Supabase Storage, bukan filesystem lokal yang dianggap persisten.
- Pastikan operasi database sesuai dengan batas waktu dan model eksekusi serverless.
- Atur CORS berdasarkan origin frontend yang sebenarnya.
- Tambahkan environment variables backend di Vercel.

Jika monorepo membutuhkan konfigurasi yang rumit, gunakan dua proyek Vercel dari satu repositori GitHub: frontend dan backend.

### C. Supabase

- Tetap gunakan Supabase sebagai layanan eksternal.
- Konfigurasikan URL website pada pengaturan autentikasi.
- Atur redirect untuk login, verifikasi email, dan pemulihan password.
- Jalankan SQL migration.
- Periksa RLS dan kebijakan Storage.
- Uji akses data melalui domain deployment.

### D. Environment variables Vercel

Konfigurasikan variabel yang dibutuhkan pada Settings → Environment Variables.

Pisahkan nilai Development, Preview, dan Production sesuai kebutuhan.

Setelah mengubah environment variables, lakukan deployment ulang agar nilai baru diterapkan.

### E. Pengujian deployment

Pastikan:

- Landing page dapat diakses.
- Halaman login dan registrasi bekerja.
- API backend dapat diakses.
- Dashboard admin dan peserta bekerja.
- Formulir PPDB tersimpan.
- Pencarian, filter, dan pagination bekerja.
- CRUD berita dan upload gambar bekerja.
- Refresh pada halaman internal tidak menghasilkan 404.
- CORS dan autentikasi bekerja pada domain produksi.
- RLS mencegah akses tidak sah.

Jangan menyatakan deployment berhasil jika belum benar-benar dilakukan dan diuji.

## 16. Routing Website

Gunakan rute berikut sebagai target jika sesuai dengan struktur proyek:

- `/` — landing page.
- `/login` — login.
- `/register` — registrasi.
- `/news` — daftar berita.
- `/news/:slug` — detail berita.
- `/peserta/dashboard` — dashboard peserta.
- `/peserta/ppdb` — formulir PPDB.
- `/peserta/status` — status pendaftaran.
- `/peserta/profil` — profil peserta.
- `/admin/dashboard` — dashboard admin.
- `/admin/ppdb` — manajemen pendaftar.
- `/admin/ppdb/:id` — detail pendaftar.
- `/admin/news` — manajemen berita.
- `/admin/news/create` — tambah berita.
- `/admin/news/:id/edit` — edit berita.

Sesuaikan rute dengan implementasi yang sudah ada.

## 17. Pengujian

Uji seluruh skenario berikut:

1. Registrasi dan login peserta.
2. Login admin.
3. Logout dan pemulihan sesi.
4. Peserta tidak dapat mengakses dashboard admin.
5. Admin dapat melihat seluruh pendaftar.
6. Peserta hanya dapat melihat data miliknya sendiri.
7. Formulir PPDB tersimpan dengan benar.
8. Nomor pendaftaran unik.
9. Pendaftaran ganda dicegah.
10. Admin dapat memperbarui status.
11. Peserta tidak dapat mengubah status sendiri.
12. Pencarian berdasarkan nama, NISN, email, dan nomor pendaftaran.
13. Filter berdasarkan status dan tanggal.
14. Pengurutan dan pagination bekerja.
15. Reset filter bekerja.
16. CRUD berita berfungsi.
17. Upload gambar berfungsi.
18. Berita draft tidak dapat diakses publik.
19. Endpoint privat menolak request tanpa autentikasi.
20. RLS mencegah akses tidak sah.
21. Website responsif.
22. Environment variables tidak terekspos.
23. Frontend dan backend dapat berjalan secara lokal.
24. Build dan deployment Vercel dapat berjalan sesuai konfigurasi.

Jangan mengklaim pengujian berhasil jika belum dijalankan.

## 18. Dokumentasi README.md

Buat atau perbarui `README.md` yang mencakup:

- Deskripsi proyek.
- Fitur utama.
- Stack teknologi.
- Arsitektur aplikasi.
- Struktur folder aktual.
- Persyaratan instalasi.
- Cara menjalankan frontend dan backend.
- Konfigurasi environment variables.
- Konfigurasi Supabase.
- SQL migration dan skema database.
- Daftar endpoint API.
- Cara membuat admin pertama.
- Prosedur pengujian.
- Panduan deployment Vercel.
- Troubleshooting.
- Catatan keamanan.

Pastikan dokumentasi sesuai dengan kode aktual, bukan sekadar contoh arsitektur.

## 19. Tahapan Pengerjaan

Kerjakan secara berurutan.

**Tahap 1 — Audit proyek**

- Periksa struktur dan dependensi.
- Identifikasi fitur yang sudah ada.
- Laporkan rencana implementasi.

**Tahap 2 — Database dan keamanan**

- Buat SQL migration.
- Konfigurasikan tabel, relasi, constraint, indeks, RLS, dan Storage.

**Tahap 3 — Backend**

- Implementasikan koneksi Supabase.
- Implementasikan middleware autentikasi dan otorisasi.
- Buat REST API.
- Implementasikan pencarian, filter, sort, dan pagination.
- Siapkan entry point yang kompatibel dengan Vercel.

**Tahap 4 — Autentikasi frontend**

- Implementasikan login, registrasi, sesi, dan proteksi route.

**Tahap 5 — Dashboard**

- Implementasikan dashboard admin.
- Implementasikan dashboard peserta.
- Pindahkan formulir PPDB.
- Implementasikan manajemen berita.

**Tahap 6 — Integrasi**

- Hubungkan seluruh fitur ke backend dan Supabase.
- Hapus data dummy pada fitur yang sudah terintegrasi.
- Uji seluruh alur.

**Tahap 7 — Deployment**

- Siapkan konfigurasi Vercel.
- Siapkan environment variables.
- Periksa build dan routing.
- Uji integrasi frontend, backend, dan Supabase.

**Tahap 8 — Dokumentasi**

- Buat README.md final.
- Dokumentasikan konfigurasi, endpoint, pengujian, dan deployment.

## 20. Ketentuan Akhir

- Implementasikan perubahan langsung pada file proyek jika akses tersedia.
- Jangan hanya memberikan contoh kode atau pseudocode.
- Jangan mengganti stack teknologi.
- Jangan merombak desain landing page secara keseluruhan.
- Jangan menghapus fitur yang sudah berfungsi.
- Jangan menggunakan data dummy sebagai pengganti integrasi database.
- Jangan mengekspos secret key.
- Jangan mengandalkan frontend untuk keamanan data.
- Gunakan kode modular dan mudah dipelihara.
- Dokumentasikan asumsi dan konfigurasi yang belum tersedia.
- Jika kredensial Supabase belum tersedia, kerjakan bagian yang dapat dilakukan dan jelaskan konfigurasi yang perlu saya selesaikan.
- Jika deployment memerlukan akses akun Vercel atau Supabase yang belum tersedia, siapkan konfigurasi dan berikan instruksi yang jelas tanpa mengarang keberhasilan deployment.

Setelah setiap tahap, laporkan file yang dibuat atau diubah, fitur yang selesai, pengujian yang telah dilakukan, kendala yang ditemukan, dan langkah berikutnya.

**MULAI DARI AUDIT PROYEK YANG SUDAH ADA. LANJUTKAN IMPLEMENTASI SECARA BERTAHAP HINGGA WEBSITE PPDB TERINTEGRASI DENGAN REACT + VITE, EXPRESS.JS, SUPABASE, DAN SIAP DI-DEPLOY KE VERCEL.**
