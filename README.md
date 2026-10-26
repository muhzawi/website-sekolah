# Website SMK Negeri 1 Nusantara — PPDB System

Aplikasi web sekolah dengan sistem PPDB (Penerimaan Peserta Didik Baru) terintegrasi. Dibangun dengan React + Vite (frontend), Express.js (backend), dan Supabase (database, autentikasi, storage).

## Fitur Utama

- **Landing page** — informasi sekolah, berita, program keahlian, PPDB
- **Autentikasi** — login, registrasi peserta, pemulihan password via Supabase Auth
- **Dashboard Admin** — statistik, kelola pendaftar PPDB, CRUD berita, upload gambar
- **Dashboard Peserta** — isi formulir PPDB, pantau status, kelola profil
- **Manajemen Berita** — publish/draft, gambar sampul di Supabase Storage
- **Pencarian & Filter** — debounced search, filter status/tanggal, sort, pagination
- **Role-based Access** — admin dan peserta dengan route protection
- **Siap Deploy** — konfigurasi Vercel untuk frontend dan backend

## Stack Teknologi

| Layer | Teknologi |
|---|---|
| Frontend | React 19 + Vite 8 |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Backend | Node.js + Express 5 |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Hosting | Vercel (frontend + backend) |

## Arsitektur

```
Browser (React + Vite)
    │
    │ Axios + Bearer Token
    ▼
Backend Express (Vercel Function)
    │
    │ @supabase/supabase-js (service role)
    ▼
Supabase
    ├── PostgreSQL (profiles, ppdb_applications, news, ppdb_settings)
    ├── Auth (JWT, session management)
    └── Storage (news-images bucket)
```

## Struktur Folder

```
website-sekolah/
├── frontend/                  # React + Vite
│   ├── src/
│   │   ├── assets/            # Gambar statis
│   │   ├── components/        # Komponen shared (Navbar, Footer, dll)
│   │   ├── contexts/          # AuthContext
│   │   ├── data/              # Data statis sekolah
│   │   ├── layouts/           # DashboardLayout
│   │   ├── lib/               # Supabase client
│   │   ├── pages/
│   │   │   ├── admin/         # Dashboard admin
│   │   │   ├── auth/          # Login, Register
│   │   │   ├── news/          # List & detail berita
│   │   │   └── peserta/       # Dashboard peserta
│   │   ├── routes/            # ProtectedRoute
│   │   └── services/          # Axios API service
│   ├── .env.example
│   └── vercel.json
│
├── backend/                   # Express.js
│   ├── api/
│   │   └── index.js           # Vercel Function entry point
│   ├── src/
│   │   ├── app.js             # Express app & routes
│   │   ├── server.js          # Local dev server
│   │   ├── lib/supabase.js    # Supabase admin client
│   │   ├── middleware/        # auth.js, errorHandler.js
│   │   ├── routes/            # profile, ppdb, news, adminNews, dashboard
│   │   └── utils/             # queryHelpers.js
│   ├── .env.example
│   └── vercel.json
│
└── supabase/
    └── migration.sql          # SQL migration lengkap
```

## Persyaratan

- Node.js 18+
- npm atau yarn
- Akun Supabase (free tier cukup)
- Akun Vercel (untuk deployment)

## Menjalankan Secara Lokal

### 1. Clone & install

```bash
git clone <repository-url>
cd website-sekolah

# Frontend
cd frontend && npm install && cd ..

# Backend
cd backend && npm install && cd ..
```

### 2. Konfigurasi environment variables

```bash
# Frontend
cp frontend/.env.example frontend/.env

# Backend
cp backend/.env.example backend/.env
```

Isi nilai yang sesuai (lihat bagian Konfigurasi Supabase).

### 3. Jalankan

```bash
# Terminal 1 — Frontend
cd frontend && npm run dev

# Terminal 2 — Backend
cd backend && npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:5000

> **Catatan:** Vite mem-proxy `/api` ke `http://localhost:5000`. Jika `VITE_API_BASE_URL` dikosongkan, frontend memakai `/api` (proxy). Untuk produksi, isi URL backend Vercel.
>
> Root backend (`http://localhost:5000/`) menampilkan status backend dalam JSON. Untuk membuka website, gunakan `http://localhost:5173`; endpoint backend berada di `/api`.

## Environment Variables

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_ANON_KEY
```

### Backend (`backend/.env`)

```env
PORT=5000
FRONTEND_URL=http://localhost:5173

SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

> ⚠️ **PENTING:** Jangan pernah expose `SUPABASE_SERVICE_ROLE_KEY` ke frontend atau commit ke Git.

## Konfigurasi Supabase

### 1. Buat project Supabase

Kunjungi https://app.supabase.com dan buat project baru.

### 2. Jalankan SQL Migration

Buka **SQL Editor** di Supabase Dashboard, paste dan jalankan isi file `supabase/migration.sql`.

### 3. Buat Storage Buckets

Migration SQL juga membuat bucket dan kebijakan Storage. Jika bucket belum ada, buat di dashboard:

| Bucket | Visibility | Keterangan |
|---|---|---|
| `news-images` | Public | Gambar sampul berita |
| `ppdb-documents` | Private | Dokumen pendaftar (opsional) |

### 4. Konfigurasi Auth

Di **Authentication → URL Configuration**:
- **Site URL**: URL frontend Anda (misal: `https://smkn1nusantara.vercel.app`)
- **Redirect URLs**: tambahkan URL frontend + `/login`, `/reset-password`

### 5. Dapatkan API Keys

Di **Settings → API**:
- `Project URL` → `SUPABASE_URL` dan `VITE_SUPABASE_URL`
- `anon / public key` → `SUPABASE_ANON_KEY` dan `VITE_SUPABASE_PUBLISHABLE_KEY`
- `service_role key` → `SUPABASE_SERVICE_ROLE_KEY` (backend only, jaga kerahasiaan!)

## Skema Database

Tabel yang dibuat oleh migration:

- **`profiles`** — extends `auth.users`, berisi `full_name`, `phone`, `role`
- **`ppdb_settings`** — konfigurasi periode PPDB (open_date, close_date, is_active)
- **`ppdb_applications`** — data pendaftar PPDB (nomor unik, email, draft/submit, status)
- **`news`** — artikel berita dengan status draft/published dan slug unik

Row Level Security (RLS) aktif pada semua tabel.

### Mengatur periode PPDB aktif

Untuk membuka periode PPDB 2026/2027 sesuai jadwal saat ini, jalankan isi file `supabase/activate-ppdb-2026-2027.sql` di Supabase SQL Editor. Script akan menonaktifkan periode aktif lain dan mengaktifkan atau memperbarui jadwal 26 Oktober–25 Desember 2026. Perubahan pada file migration saja tidak memperbarui database yang sudah berjalan.

## Endpoint API

### Public (tanpa autentikasi)
```
GET  /api/health
GET  /api/news                          Daftar berita published
GET  /api/news/:slug                    Detail berita
GET  /api/ppdb/settings                 Periode PPDB aktif
```

### Auth-required
```
GET  /api/auth/me                       Info user
GET  /api/profile                       Profil lengkap
PATCH /api/profile                      Update profil
GET  /api/ppdb/me                       Pendaftaran milik peserta
POST /api/ppdb                          Kirim pendaftaran
PATCH /api/ppdb/me                      Update pendaftaran sendiri
GET  /api/ppdb/:id                      Detail pendaftaran
```

### Admin only
```
GET  /api/ppdb                          Semua pendaftar (search/filter/sort/pagination)
PATCH /api/ppdb/:id/status              Update status pendaftar
GET  /api/admin/news                    Semua berita (draft + published)
GET  /api/admin/news/:id                Detail berita by ID
POST /api/admin/news                    Buat berita
PATCH /api/admin/news/:id               Edit berita
DELETE /api/admin/news/:id              Hapus berita
POST /api/admin/news/upload             Upload gambar sampul
GET  /api/admin/dashboard/stats         Statistik dashboard
```

### Query Parameters (PPDB Admin & Berita)
```
?search=<string>          Pencarian
?status=<string>          Filter status
?date_from=<YYYY-MM-DD>   Filter dari tanggal
?date_to=<YYYY-MM-DD>     Filter sampai tanggal
?page=<number>            Halaman (default: 1)
?limit=<number>           Per halaman (default: 10, maks: 50)
?sortBy=<column>          Kolom pengurutan
?sortOrder=asc|desc       Urutan (default: desc)
```

## Membuat Admin Pertama

Setelah mendaftar via halaman Register, jalankan di **Supabase SQL Editor**:

```sql
SELECT public.promote_to_admin('email-admin@domain.com');
```

Atau langsung:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'email-admin@domain.com');
```

## Routing Website

| Route | Halaman |
|---|---|
| `/` | Landing page |
| `/profil` | Profil sekolah |
| `/program` | Program keahlian |
| `/news` | Daftar berita |
| `/news/:slug` | Detail berita |
| `/kontak` | Kontak & lokasi |
| `/ppdb` | Info PPDB |
| `/ppdb/faq` | FAQ PPDB |
| `/login` | Login |
| `/register` | Registrasi peserta |
| `/reset-password` | Atur password baru (dari email pemulihan) |
| `/peserta/dashboard` | Dashboard peserta |
| `/peserta/ppdb` | Formulir PPDB |
| `/peserta/status` | Status pendaftaran |
| `/peserta/profil` | Profil peserta |
| `/admin/dashboard` | Dashboard admin |
| `/admin/ppdb` | Kelola pendaftar |
| `/admin/ppdb/:id` | Detail pendaftar |
| `/admin/news` | Kelola berita |
| `/admin/news/create` | Buat berita baru |
| `/admin/news/:id/edit` | Edit berita |

## Keputusan Arsitektur

Frontend dan backend berada di satu repositori, tetapi di-deploy sebagai **dua proyek Vercel** (root `frontend` dan `backend`). Ini menghindari konfigurasi monorepo yang rumit, menjaga service role key hanya di backend, dan sesuai runtime Vercel Functions (tanpa proses Express yang berjalan terus-menerus).

Supabase tetap layanan eksternal (PostgreSQL, Auth, Storage). Operasi bisnis selalu lewat REST API Express; frontend hanya memakai kunci publishable untuk sesi Auth.

## Deployment Vercel

### Dua Proyek dari Satu Repository

**Proyek 1 — Frontend:**
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Framework: Vite

Environment Variables:
```
VITE_API_BASE_URL=https://your-backend.vercel.app/api
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

**Proyek 2 — Backend:**
- Root Directory: `backend`
- Build Command: (kosong atau `npm install`)
- Output Directory: (kosong)
- Framework: Other

Environment Variables:
```
FRONTEND_URL=https://your-frontend.vercel.app
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Setelah deploy backend, update `VITE_API_BASE_URL` di frontend dengan URL backend yang sebenarnya, lalu redeploy frontend.

## Troubleshooting

| Masalah | Solusi |
|---|---|
| `401 Unauthorized` | Cek token Supabase, pastikan session masih aktif |
| `403 Forbidden` | Cek role user di tabel `profiles` |
| `CORS error` | Pastikan `FRONTEND_URL` di backend sesuai dengan URL frontend |
| `404 di refresh` | Pastikan `vercel.json` dengan rewrite SPA sudah ada di folder frontend |
| Gambar tidak muncul | Cek bucket `news-images` sudah Public dan RLS mengizinkan SELECT |
| Admin tidak bisa login | Jalankan `promote_to_admin('email@domain.com')` di SQL Editor |
| Backend timeout di Vercel | Operasi database harus < 10 detik (Vercel Functions limit) |

## Catatan Keamanan

- `SUPABASE_SERVICE_ROLE_KEY` **hanya** ada di backend, tidak pernah di frontend
- Variabel `VITE_*` masuk ke bundle frontend — hanya gunakan untuk anon key dan URL publik
- RLS aktif di semua tabel — backend menggunakan service role, bukan langsung dari client
- Route protection ada di dua lapis: frontend (React Router) dan backend (middleware auth)
- Password tidak pernah disimpan di tabel aplikasi
- Rate limiting aktif di endpoint sensitif (300 req/15 menit umum, 30 req/15 menit untuk POST/PATCH PPDB)

## Pengujian Lokal

Setelah environment dan migration siap:

```bash
cd backend && npm run dev
cd frontend && npm run dev
```

Periksa:

1. `GET http://localhost:5000/api/health`
2. Registrasi & login peserta; admin via `promote_to_admin`
3. Peserta tidak dapat membuka `/admin/dashboard`
4. Formulir PPDB (draft + kirim), nomor unik, cegah ganda
5. Admin mengubah status; peserta tidak bisa mengubah status
6. Pencarian/filter/pagination pendaftar dan berita
7. CRUD berita, upload gambar, draft tidak tampil di `/news`
8. Refresh halaman internal tidak 404 (SPA rewrite)

Pengujian di atas memerlukan kredensial Supabase. Build frontend dapat dijalankan tanpa kredensial: `cd frontend && npm run build`.

Deployment ke Vercel dan uji domain produksi hanya dinyatakan berhasil setelah Anda menjalankan langkah di dashboard Vercel dan Supabase.
