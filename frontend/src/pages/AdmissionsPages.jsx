import { useState } from 'react'
import PageHeading from '../components/PageHeading.jsx'
import { programs, registrationSteps, requiredDocuments } from '../data/schoolData.js'

const period = '12 Jan - 28 Feb 2024'

function PpdbPage({ onNavigate }) {
  return (
    <>
      <PageHeading
        breadcrumbs={['Beranda', 'PPDB']}
        title="PPDB 2024/2025"
        description="Informasi pendaftaran, persyaratan, jadwal penting, dan langkah pendaftaran siswa baru SMK Negeri 1 Nusantara."
      />

      <section className="ppdb-status surface">
        <div>
          <span className="tag">Status Pendaftaran</span>
          <h2>Pendaftaran Dibuka</h2>
          <p>
            Pendaftaran online dibuka mulai 12 Januari 2024 hingga 28 Februari
            2024. Pastikan Anda memenuhi seluruh persyaratan dan mengikuti alur
            pendaftaran dengan benar.
          </p>
        </div>
        <div className="period-box">
          <span>Rentang Pendaftaran</span>
          <strong>{period}</strong>
        </div>
      </section>

      <div className="ppdb-subnav">
        <a
          href="?page=faq"
          onClick={(event) => onNavigate(event, 'faq')}
        >
          Pertanyaan umum
        </a>
        <a
          href="?page=registration"
          onClick={(event) => onNavigate(event, 'registration')}
        >
          Buka formulir pendaftaran
        </a>
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
          <p>Lengkapi data calon siswa pada formulir pendaftaran online.</p>
        </div>
        <a
          className="button"
          href="?page=registration"
          onClick={(event) => onNavigate(event, 'registration')}
        >
          Buka Formulir Pendaftaran
        </a>
      </section>
    </>
  )
}

const initialForm = {
  fullName: 'Aditya Pratama',
  nisn: '0098765432',
  birthplace: 'Bandung',
  birthDate: '2009-05-15',
  gender: 'Laki-laki',
  address: 'Jl. Melati No. 12, Bandung',
  previousSchool: 'SMP Negeri 5 Bandung',
  guardian: 'Budi Pratama',
  phone: '0812 3456 7890',
  email: 'aditya.pratama@example.com',
  program: 'Teknik Komputer dan Jaringan',
}

const identityFields = [
  { name: 'fullName', label: 'Nama lengkap', autoComplete: 'name' },
  { name: 'nisn', label: 'NISN', inputMode: 'numeric' },
  { name: 'birthplace', label: 'Tempat lahir' },
  { name: 'birthDate', label: 'Tanggal lahir', type: 'date' },
  { name: 'gender', label: 'Jenis kelamin', type: 'select' },
  { name: 'address', label: 'Alamat tempat tinggal', autoComplete: 'street-address' },
]

const contactFields = [
  { name: 'previousSchool', label: 'Asal sekolah' },
  { name: 'guardian', label: 'Nama orang tua / wali' },
  { name: 'phone', label: 'Nomor telepon', type: 'tel', autoComplete: 'tel' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
]

function FormField({ field, value, onChange }) {
  if (field.type === 'select') {
    return (
      <label className="registration-field">
        <span>{field.label}</span>
        <select name={field.name} value={value} onChange={onChange} required>
          <option value="">Pilih jenis kelamin</option>
          <option value="Laki-laki">Laki-laki</option>
          <option value="Perempuan">Perempuan</option>
        </select>
      </label>
    )
  }

  return (
    <label className="registration-field">
      <span>{field.label}</span>
      <input
        name={field.name}
        type={field.type ?? 'text'}
        inputMode={field.inputMode}
        autoComplete={field.autoComplete}
        value={value}
        onChange={onChange}
        required
      />
    </label>
  )
}

function RegistrationPage() {
  const [form, setForm] = useState(initialForm)
  const [message, setMessage] = useState('')

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setMessage('')
  }

  function saveDraft() {
    setMessage(
      'Draf tersimpan sementara selama halaman ini terbuka. Data tidak dikirim ke server.',
    )
  }

  function continueRegistration(event) {
    event.preventDefault()
    setMessage(
      'Data formulir berhasil divalidasi di browser. Pengunggahan dokumen belum tersedia.',
    )
  }

  return (
    <>
      <PageHeading
        breadcrumbs={['Beranda', 'PPDB', 'Formulir Pendaftaran']}
        title="Formulir Pendaftaran PPDB"
        description="Lengkapi data calon siswa dan pilih program keahlian di SMK Negeri 1 Nusantara."
      />
      <div className="info-banner registration-banner">
        <span>▦ &nbsp; PPDB 2024/2025</span>
        <span>Pendaftaran: {period}</span>
      </div>

      <div className="registration-layout">
        <form
          className="registration-form surface content-card"
          onSubmit={continueRegistration}
        >
          <div className="registration-form-heading">
            <h2>Data calon siswa</h2>
            <span className="tag">Contoh pengisian</span>
          </div>

          <section className="form-section">
            <h3><span>01</span> Identitas diri</h3>
            <div className="registration-fields">
              {identityFields.map((field) => (
                <FormField
                  key={field.name}
                  field={field}
                  value={form[field.name]}
                  onChange={updateField}
                />
              ))}
            </div>
          </section>

          <section className="form-section">
            <h3><span>02</span> Asal sekolah &amp; kontak</h3>
            <div className="registration-fields">
              {contactFields.map((field) => (
                <FormField
                  key={field.name}
                  field={field}
                  value={form[field.name]}
                  onChange={updateField}
                />
              ))}
            </div>
          </section>

          <section className="form-section">
            <h3><span>03</span> Pilihan program keahlian</h3>
            <div className="program-choice-grid">
              {programs.map((program) => (
                <label
                  className={
                    form.program === program.title
                      ? 'program-choice is-selected'
                      : 'program-choice'
                  }
                  key={program.title}
                >
                  <input
                    type="radio"
                    name="program"
                    value={program.title}
                    checked={form.program === program.title}
                    onChange={updateField}
                    required
                  />
                  <span className="choice-icon" aria-hidden="true">
                    {program.icon === 'cpu'
                      ? '▣'
                      : program.icon === 'palette'
                        ? '◉'
                        : program.icon === 'calculator'
                          ? '▦'
                          : '▢'}
                  </span>
                  <span className="choice-copy">
                    <strong>{program.shortTitle}</strong>
                    <small>{program.summary}</small>
                  </span>
                  <span className="choice-radio" aria-hidden="true" />
                </label>
              ))}
            </div>
          </section>

          <p className="form-note">
            Periksa kembali data diri dan pilihan program sebelum melanjutkan
            ke tahap unggah dokumen.
          </p>
          <div className="registration-actions">
            <button
              className="button button--secondary"
              type="button"
              onClick={saveDraft}
            >
              Simpan draf
            </button>
            <button className="button" type="submit">
              Lanjut ke unggah dokumen
            </button>
          </div>
          <p className="status-message" role="status" aria-live="polite">
            {message}
          </p>
        </form>

        <aside className="registration-aside">
          <section className="surface content-card aside-step">
            <span>TAHAP PENDAFTARAN</span>
            <h2>1. Registrasi Online</h2>
            <p>
              Lengkapi data diri calon peserta didik. Tahap berikutnya adalah
              unggah dokumen untuk proses verifikasi.
            </p>
          </section>
          <section className="surface content-card aside-documents">
            <h2>▤ &nbsp; Siapkan dokumen</h2>
            <p>Dokumen persyaratan untuk tahap unggah dokumen:</p>
            <ol className="number-list">
              {requiredDocuments.map((document, index) => (
                <li key={document}>
                  <span className="number-badge">{index + 1}</span>
                  <span>{document}</span>
                </li>
              ))}
            </ol>
          </section>
          <section className="aside-note">
            <h2>Tentang pendaftaran</h2>
            <p>
              Pertanyaan umum memuat informasi periode PPDB, alur pendaftaran,
              dan persyaratan dokumen.
            </p>
          </section>
        </aside>
      </div>
    </>
  )
}

const faqItems = [
  {
    category: 'PERIODE PENDAFTARAN',
    question: 'Kapan pendaftaran PPDB dibuka?',
    answer:
      'Pendaftaran online tahun ajaran 2024/2025 dibuka mulai 12 Januari 2024 hingga 28 Februari 2024.',
  },
  {
    category: 'REGISTRASI ONLINE',
    question: 'Bagaimana cara memulai pendaftaran?',
    answer:
      'Buat akun pendaftaran dan lengkapi data diri calon peserta didik. Setelah registrasi online, unggah dokumen persyaratan untuk proses verifikasi.',
  },
  {
    category: 'PROGRAM KEAHLIAN',
    question: 'Apa saja pilihan program keahlian yang tersedia?',
    answer:
      'SMK Negeri 1 Nusantara memiliki empat program keahlian: Teknik Komputer, Multimedia, Akuntansi, dan Administrasi Perkantoran.',
  },
  {
    category: 'PERSYARATAN',
    question: 'Dokumen apa saja yang perlu disiapkan?',
    answer: 'Siapkan enam persyaratan berikut untuk pendaftaran:',
    documents: requiredDocuments,
  },
  {
    category: 'HASIL SELEKSI',
    question: 'Bagaimana mengetahui hasil seleksi dan tahap berikutnya?',
    answer:
      'Cek hasil seleksi dan informasi kelanjutan pendaftaran melalui portal. Selanjutnya, lakukan daftar ulang dan konfirmasi keikutsertaan sebelum pembukaan tahun ajaran.',
  },
]

function FaqPage({ onNavigate }) {
  return (
    <>
      <PageHeading
        breadcrumbs={['Beranda', 'PPDB', 'Pertanyaan Umum']}
        title="FAQ / Pertanyaan Umum"
        description="Temukan jawaban seputar PPDB 2024/2025, program keahlian, dan persyaratan pendaftaran."
      />
      <div className="info-banner faq-banner">
        <span>ⓘ &nbsp; Informasi PPDB 2024/2025</span>
        <span>{period}</span>
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
            <a
              href="?page=registration"
              onClick={(event) => onNavigate(event, 'registration')}
            >
              Buka formulir pendaftaran
            </a>
          </section>
        </aside>
      </div>
    </>
  )
}

export { FaqPage, PpdbPage, RegistrationPage }
