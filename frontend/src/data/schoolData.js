import accountingImage from '../assets/akutansi.webp'
import careerImage from '../assets/bimbingan.webp'
import graphicDesignImage from '../assets/designgrafis.webp'
import competitionImage from '../assets/lomba-coding.webp'
import logoImage from '../assets/logo-sekolah.webp'
import announcementImage from '../assets/pengumuman-pretasi.webp'
import ppdbImage from '../assets/ppdb.webp'
import schoolImage from '../assets/sekolah.webp'
import networkImage from '../assets/TKJ.webp'
import examImage from '../assets/ujian.webp'
import ceremonyImage from '../assets/upacara.webp'

export { logoImage, schoolImage }

export const heroSlides = [
  {
    image: ceremonyImage,
    alt: 'Siswa mengikuti upacara di halaman sekolah',
    title: 'Kegiatan upacara sekolah',
  },
  {
    image: schoolImage,
    alt: 'Gedung dan halaman SMK Negeri 1 Nusantara',
    title: 'Lingkungan SMK Negeri 1 Nusantara',
  },
  {
    image: careerImage,
    alt: 'Siswa mengikuti kegiatan bimbingan karier',
    title: 'Bimbingan karier untuk siswa',
  },
]

export const programs = [
  {
    title: 'Teknik Komputer dan Jaringan',
    shortTitle: 'Teknik Komputer',
    icon: 'cpu',
    image: networkImage,
    description:
      'Program ini membekali siswa dengan kemampuan pemrograman, pengembangan aplikasi, pengelolaan jaringan, dan perawatan perangkat komputer.',
    highlights: [
      'Pemrograman aplikasi berbasis web dan mobile',
      'Instalasi, konfigurasi, dan perawatan jaringan komputer',
      'Perawatan dan troubleshooting perangkat komputer',
    ],
    summary:
      'Membekali siswa dengan kemampuan pemrograman dan jaringan komputer.',
  },
  {
    title: 'Multimedia dan Desain Grafis',
    shortTitle: 'Multimedia',
    icon: 'palette',
    image: graphicDesignImage,
    description:
      'Program ini mengembangkan kreativitas siswa dalam membuat konten visual, desain grafis, video, dan animasi untuk berbagai platform digital.',
    highlights: [
      'Desain grafis, identitas visual, dan materi promosi',
      'Pembuatan video, editing, dan animasi digital',
      'Pengembangan konten visual untuk media sosial',
    ],
    summary:
      'Mengembangkan kreativitas dalam desain grafis, video, dan animasi.',
  },
  {
    title: 'Akuntansi dan Keuangan Lembaga',
    shortTitle: 'Akuntansi',
    icon: 'calculator',
    image: accountingImage,
    description:
      'Program ini menyiapkan lulusan yang mampu mengelola keuangan, membuat laporan keuangan, dan melakukan analisis keuangan lembaga.',
    highlights: [
      'Pengelolaan kas, bank, dan piutang lembaga',
      'Pembuatan laporan keuangan dan neraca',
      'Analisis keuangan dan perencanaan anggaran',
    ],
    summary:
      'Menyiapkan lulusan yang siap mengelola keuangan perusahaan.',
  },
  {
    title: 'Administrasi Perkantoran',
    shortTitle: 'Administrasi Perkantoran',
    icon: 'briefcase',
    summary:
      'Membentuk tenaga administrasi yang profesional dan terampil.',
  },
]

export const newsItems = [
  {
    id: 'ppdb-pertama',
    category: 'Pengumuman',
    date: '12 Jan 2024',
    title: 'Pembukaan PPDB Gelombang Pertama Tahun Ajaran 2024/2025',
    description:
      'Pendaftaran PPDB gelombang pertama resmi dibuka mulai 12 Januari 2024. Calon peserta didik dapat melakukan pendaftaran secara daring melalui portal resmi sekolah.',
    image: ppdbImage,
    alt: 'Informasi penerimaan peserta didik baru SMK Negeri 1 Nusantara',
  },
  {
    id: 'juara-lomba',
    category: 'Berita',
    date: '05 Jan 2024',
    title: 'Siswa SMK Negeri 1 Nusantara Raih Juara 1 Lomba Pemrograman Nasional',
    description:
      'Tim siswa berhasil mengalahkan peserta dari berbagai sekolah vokasi dan membawa pulang trofi juara utama.',
    image: competitionImage,
    alt: 'Siswa dan guru merayakan kemenangan lomba pemrograman',
  },
  {
    id: 'ujian-semester',
    category: 'Pengumuman',
    date: '28 Des 2023',
    title: 'Jadwal Ujian Semester Genap Tahun Pelajaran 2023/2024',
    description:
      'Jadwal ujian semester genap telah dirilis dan dapat diakses oleh seluruh siswa melalui portal akademik sekolah.',
    image: examImage,
    alt: 'Siswa mengerjakan ujian di ruang kelas',
  },
  {
    id: 'bimbingan-karier',
    category: 'Kegiatan',
    date: '20 Des 2023',
    title: 'Kegiatan Bimbingan Karier untuk Siswa Kelas XII',
    description:
      'Kegiatan bimbingan karier membahas strategi pendaftaran kerja, portofolio, dan persiapan wawancara.',
    image: careerImage,
    alt: 'Siswa mengikuti sesi bimbingan karier',
  },
  {
    id: 'beasiswa-prestasi',
    category: 'Pengumuman',
    date: '15 Des 2023',
    title: 'Pengumuman Hasil Seleksi Beasiswa Prestasi Semester Gasal',
    description:
      'Daftar penerima beasiswa prestasi semester gasal telah diumumkan dan dapat dilihat melalui halaman pengumuman.',
    image: announcementImage,
    alt: 'Siswa membaca pengumuman beasiswa prestasi',
  },
  {
    id: 'workshop-desain',
    category: 'Kegiatan',
    date: '10 Des 2023',
    title: 'Workshop Desain Grafis untuk Siswa Program Multimedia',
    description:
      'Kegiatan workshop membahas teknik desain visual, branding, dan pengembangan portofolio digital.',
    image: graphicDesignImage,
    alt: 'Siswa program multimedia mengikuti workshop desain grafis',
  },
  {
    id: 'magang-industri',
    category: 'Berita',
    date: '05 Des 2023',
    title: 'Pembukaan Pendaftaran Magang Industri Semester Genap',
    description:
      'Pendaftaran magang industri dibuka untuk siswa kelas XI dan XII yang ingin mengikuti program praktik lapangan.',
    image: networkImage,
    alt: 'Siswa melakukan praktik jaringan komputer',
  },
  {
    id: 'upacara-sekolah',
    category: 'Kegiatan',
    date: '02 Des 2023',
    title: 'Kegiatan Upacara Bendera di Halaman Sekolah',
    description:
      'Siswa dan guru mengikuti kegiatan upacara bersama di lingkungan sekolah.',
    image: ceremonyImage,
    alt: 'Siswa mengikuti upacara bendera di halaman sekolah',
  },
  {
    id: 'lingkungan-sekolah',
    category: 'Berita',
    date: '28 Nov 2023',
    title: 'Lingkungan Sekolah Mendukung Kegiatan Belajar Praktik',
    description:
      'Fasilitas dan ruang belajar digunakan untuk mendukung pembelajaran vokasi.',
    image: schoolImage,
    alt: 'Gedung dan fasilitas SMK Negeri 1 Nusantara',
  },
  {
    id: 'praktik-akuntansi',
    category: 'Kegiatan',
    date: '24 Nov 2023',
    title: 'Praktik Pencatatan Transaksi Program Akuntansi',
    description:
      'Siswa berlatih mencatat transaksi dan menyusun laporan keuangan.',
    image: accountingImage,
    alt: 'Siswa belajar pencatatan transaksi akuntansi',
  },
  {
    id: 'praktik-jaringan',
    category: 'Kegiatan',
    date: '20 Nov 2023',
    title: 'Praktik Instalasi Jaringan Komputer di Laboratorium',
    description:
      'Pembelajaran praktik membantu siswa memahami instalasi dan konfigurasi jaringan.',
    image: networkImage,
    alt: 'Siswa praktik memasang perangkat jaringan komputer',
  },
  {
    id: 'portofolio-multimedia',
    category: 'Berita',
    date: '15 Nov 2023',
    title: 'Siswa Program Multimedia Menyiapkan Portofolio Digital',
    description:
      'Portofolio digital menjadi salah satu sarana untuk menampilkan hasil karya siswa.',
    image: graphicDesignImage,
    alt: 'Siswa mengerjakan desain grafis di laboratorium multimedia',
  },
  {
    id: 'info-pendaftaran',
    category: 'Pengumuman',
    date: '10 Nov 2023',
    title: 'Informasi Persiapan Pendaftaran Peserta Didik Baru',
    description:
      'Calon peserta didik dapat mulai menyiapkan data diri dan dokumen persyaratan pendaftaran.',
    image: ppdbImage,
    alt: 'Poster informasi penerimaan peserta didik baru',
  },
  {
    id: 'prestasi-siswa',
    category: 'Berita',
    date: '05 Nov 2023',
    title: 'Apresiasi untuk Siswa Berprestasi Semester Gasal',
    description:
      'Sekolah memberikan apresiasi kepada siswa atas capaian dan partisipasi selama semester gasal.',
    image: announcementImage,
    alt: 'Siswa melihat pengumuman prestasi sekolah',
  },
  {
    id: 'ujian-persiapan',
    category: 'Pengumuman',
    date: '01 Nov 2023',
    title: 'Persiapan Ujian Semester bagi Siswa',
    description:
      'Siswa diimbau memperhatikan informasi jadwal dan mempersiapkan diri untuk ujian semester.',
    image: examImage,
    alt: 'Suasana ruang kelas saat ujian semester',
  },
  {
    id: 'kelas-karier',
    category: 'Kegiatan',
    date: '28 Okt 2023',
    title: 'Sesi Bimbingan Karier bagi Siswa Kelas Akhir',
    description:
      'Sesi bimbingan membahas pilihan karier dan persiapan setelah menyelesaikan pendidikan.',
    image: careerImage,
    alt: 'Siswa mengikuti sesi bimbingan karier',
  },
  {
    id: 'karya-desain',
    category: 'Berita',
    date: '24 Okt 2023',
    title: 'Karya Desain Grafis Siswa Program Multimedia',
    description:
      'Siswa mengembangkan keterampilan desain visual melalui proyek pembelajaran.',
    image: graphicDesignImage,
    alt: 'Karya desain grafis dalam kegiatan pembelajaran',
  },
  {
    id: 'program-penerimaan',
    category: 'Pengumuman',
    date: '20 Okt 2023',
    title: 'Informasi Program Keahlian dan Penerimaan Siswa',
    description:
      'Informasi program keahlian dapat menjadi bahan pertimbangan calon peserta didik.',
    image: schoolImage,
    alt: 'Gedung sekolah sebagai latar informasi program keahlian',
  },
]

export const registrationSteps = [
  {
    title: 'Registrasi Online',
    description:
      'Buat akun pendaftaran dan lengkapi data diri calon peserta didik.',
  },
  {
    title: 'Unggah Dokumen',
    description:
      'Unggah dokumen persyaratan yang dipersyaratkan untuk proses verifikasi.',
  },
  {
    title: 'Seleksi',
    description:
      'Mengikuti proses seleksi administratif dan akademik sesuai ketentuan.',
  },
  {
    title: 'Pengumuman',
    description:
      'Cek hasil seleksi dan informasi kelanjutan pendaftaran melalui portal.',
  },
  {
    title: 'Daftar Ulang',
    description:
      'Melakukan daftar ulang dan konfirmasi keikutsertaan sebelum pembukaan tahun ajaran.',
  },
]

export const requiredDocuments = [
  'Fotokopi ijazah SMP/MTs atau sederajat yang telah dilegalisir.',
  'Fotokopi nilai rapor kelas IX semester 1-5 yang telah dilegalisir.',
  'Akta kelahiran atau surat keterangan lahir yang masih berlaku.',
  'Kartu Keluarga (KK) atau surat keterangan domisili yang masih berlaku.',
  'Surat keterangan sehat dari dokter atau puskesmas.',
  'Pas foto terbaru ukuran 3×4 sebanyak 2 lembar.',
]
