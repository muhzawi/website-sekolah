import { Link } from 'react-router-dom'
import PageHeading from '../components/PageHeading.jsx'
import { programs, registrationSteps, requiredDocuments } from '../data/schoolData.js'
import { ErrorState, Spinner } from '../components/Feedback.jsx'
import { usePpdbPeriod } from '../hooks/usePpdbPeriod.js'

function formatDate(value) {
  if (!value) return ''
  return new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function PpdbPage() {
  const { period, loading, error, refetch } = usePpdbPeriod()

  const rangeLabel = period
    ? `${formatDate(period.open_date)} — ${formatDate(period.close_date)}`
    : 'Jadwal akan diumumkan'

  return (
    <>
      <PageHeading
        breadcrumbs={['Beranda', 'PPDB']}
        title={period ? `PPDB ${period.academic_year}` : 'PPDB'}
        description="Informasi pendaftaran, persyaratan, jadwal penting, dan langkah pendaftaran siswa baru SMK Negeri 1 Nusantara."
      />

      {error && <ErrorState message={error} onRetry={refetch} />}

      <section className="ppdb-status surface">
        <div>
          <span className="tag">Status Pendaftaran</span>
          <h2>{loading ? 'Memuat jadwal pendaftaran' : period ? 'Pendaftaran Dibuka' : 'Pendaftaran Belum Dibuka'}</h2>
          <p>
            {loading
              ? 'Jadwal PPDB sedang dimuat.'
              : period
              ? `${period.period_name} dibuka mulai ${formatDate(period.open_date)} hingga ${formatDate(period.close_date)}. Pastikan Anda memenuhi seluruh persyaratan dan mengikuti alur pendaftaran dengan benar.`
              : 'Pantau halaman ini dan berita sekolah untuk informasi pembukaan PPDB.'}
          </p>
        </div>
        <div className="period-box">
          <span>Rentang Pendaftaran</span>
          <strong>{rangeLabel}</strong>
        </div>
      </section>

      <div className="ppdb-subnav">
        <Link to="/ppdb/faq">Pertanyaan umum</Link>
        <Link to="/login">Buka formulir pendaftaran</Link>
      </div>

      <section className="section-block">
        <div className="section-heading">
          <h2>Alur Pendaftaran</h2>
        </div>
        <ol className="steps-grid">
          {registrationSteps.map((step, index) => (
            <li className="step-card surface" key={step.title}>
              <span className="step-number">{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section-block ppdb-documents">
        <div className="section-heading">
          <h2>Persyaratan</h2>
        </div>
        <div className="surface content-card">
          <ol className="number-list">
            {requiredDocuments.map((document, index) => (
              <li key={document}>
                <span className="number-badge">{index + 1}</span>
                <span>{document}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="registration-cta surface">
        <div>
          <h2>Siap mendaftar?</h2>
          <p>Masuk atau buat akun untuk mengisi formulir pendaftaran online di dashboard peserta.</p>
        </div>
        <Link className="button" to="/login">Masuk / Daftar Akun</Link>
      </section>
    </>
  )
}

const faqItems = [
  {
    category: 'PERIODE PENDAFTARAN',
    question: 'Kapan pendaftaran PPDB dibuka?',
    answer: 'Jadwal pendaftaran mengikuti periode aktif yang ditampilkan di halaman PPDB. Masuk ke dashboard peserta untuk melihat status terbaru.',
  },
  {
    category: 'REGISTRASI ONLINE',
    question: 'Bagaimana cara memulai pendaftaran?',
    answer: 'Buat akun peserta dan masuk ke dashboard, kemudian isi formulir PPDB secara lengkap.',
  },
  {
    category: 'PROGRAM KEAHLIAN',
    question: 'Apa saja pilihan program keahlian yang tersedia?',
    answer: `SMK Negeri 1 Nusantara memiliki empat program keahlian: ${programs.map(p => p.shortTitle).join(', ')}.`,
  },
  {
    category: 'PERSYARATAN',
    question: 'Dokumen apa saja yang perlu disiapkan?',
    answer: 'Siapkan persyaratan berikut untuk pendaftaran:',
    documents: requiredDocuments,
  },
  {
    category: 'HASIL SELEKSI',
    question: 'Bagaimana mengetahui hasil seleksi dan tahap berikutnya?',
    answer: 'Cek hasil seleksi melalui dashboard peserta. Selanjutnya, lakukan daftar ulang dan konfirmasi keikutsertaan sebelum pembukaan tahun ajaran.',
  },
]

export function FaqPage() {
  const { period, loading, error, refetch } = usePpdbPeriod()

  const rangeLabel = period
    ? `${formatDate(period.open_date)} — ${formatDate(period.close_date)}`
    : 'Jadwal akan diumumkan'

  return (
    <>
      <PageHeading
        breadcrumbs={['Beranda', 'PPDB', 'Pertanyaan Umum']}
        title="FAQ / Pertanyaan Umum"
        description="Temukan jawaban seputar PPDB, program keahlian, dan persyaratan pendaftaran."
      />
      {error && <ErrorState message={error} onRetry={refetch} />}
      <div className="info-banner faq-banner">
        <span>ⓘ &nbsp; Informasi {period ? `PPDB ${period.academic_year}` : 'PPDB'}</span>
        <span>{loading ? <Spinner label="Memuat jadwal PPDB" size="small" /> : rangeLabel}</span>
      </div>

      <div className="faq-layout">
        <div className="faq-list">
          {faqItems.map((item) => (
            <article className="surface content-card faq-card" key={item.question}>
              <span className="faq-category">{item.category}</span>
              <h2>{item.question}</h2>
              <p>{item.answer}</p>
              {item.documents && (
                <ol className="faq-document-list">
                  {item.documents.map((document, index) => (
                    <li key={document}>
                      <span className="number-badge">{index + 1}</span>
                      <span>{document}</span>
                    </li>
                  ))}
                </ol>
              )}
            </article>
          ))}
        </div>

        <aside className="faq-aside">
          <section className="surface content-card faq-steps">
            <h2>Alur Pendaftaran</h2>
            <p>Lima tahap pendaftaran calon peserta didik baru.</p>
            <ol>
              {registrationSteps.map((step, index) => (
                <li key={step.title}>
                  <span className="step-number">{index + 1}</span>
                  <div>
                    <strong>{step.title}</strong>
                    <p>{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
          <section className="aside-note">
            <h2>Sebelum mendaftar</h2>
            <p>
              Pastikan Anda memenuhi seluruh persyaratan dan mengikuti alur
              pendaftaran dengan benar.
            </p>
            <Link to="/login">Buka formulir pendaftaran</Link>
          </section>
        </aside>
      </div>
    </>
  )
}
