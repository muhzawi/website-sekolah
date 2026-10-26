import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'
import api from '../../services/api.js'
import { programs } from '../../data/schoolData.js'
import { ErrorState, Spinner } from '../../components/Feedback.jsx'
import { useToast } from '../../contexts/useToast.js'

const identityFields = [
  { name: 'full_name', label: 'Nama Lengkap *', autoComplete: 'name' },
  { name: 'nisn', label: 'NISN *', inputMode: 'numeric' },
  { name: 'birth_place', label: 'Tempat Lahir *' },
  { name: 'birth_date', label: 'Tanggal Lahir *', type: 'date' },
  { name: 'gender', label: 'Jenis Kelamin *', type: 'select' },
  { name: 'address', label: 'Alamat Lengkap *', type: 'textarea' },
]

const contactFields = [
  { name: 'previous_school', label: 'Asal Sekolah *' },
  { name: 'phone', label: 'Nomor Telepon *', type: 'tel' },
  { name: 'parent_name', label: 'Nama Orang Tua / Wali *' },
  { name: 'parent_phone', label: 'No. Telepon Orang Tua / Wali *', type: 'tel' },
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
  if (field.type === 'textarea') {
    return (
      <label className="registration-field" style={{ gridColumn: '1 / -1' }}>
        <span>{field.label}</span>
        <textarea name={field.name} value={value} onChange={onChange} rows="3" required />
      </label>
    )
  }
  return (
    <label className="registration-field">
      <span>{field.label}</span>
      <input
        name={field.name}
        type={field.type || 'text'}
        inputMode={field.inputMode}
        autoComplete={field.autoComplete}
        value={value}
        onChange={onChange}
        required
      />
    </label>
  )
}

const emptyForm = {
  full_name: '', nisn: '', birth_place: '', birth_date: '',
  gender: '', address: '', previous_school: '', phone: '',
  parent_name: '', parent_phone: '', major_choice: '',
}

export default function PesertaPpdbPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const [existing, setExisting] = useState(null)
  const [period, setPeriod] = useState(null)
  const [loadingData, setLoadingData] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [retryKey, setRetryKey] = useState(0)
  const [step, setStep] = useState('form')
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [savingDraft, setSavingDraft] = useState(false)
  const [draftSaved, setDraftSaved] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    Promise.all([
      api.get('/ppdb/me').then(r => r.data[0] || null),
      api.get('/ppdb/settings').then(r => r.data),
    ]).then(([app, p]) => {
      setExisting(app)
      setPeriod(p)
      if (app?.is_draft) {
        setForm({
          full_name: app.full_name || '',
          nisn: app.nisn || '',
          birth_place: app.birth_place || '',
          birth_date: app.birth_date || '',
          gender: app.gender || '',
          address: app.address || '',
          previous_school: app.previous_school || '',
          phone: app.phone || '',
          parent_name: app.parent_name || '',
          parent_phone: app.parent_phone || '',
          major_choice: app.major_choice || '',
        })
      } else if (!app) {
        setForm(prev => ({
          ...prev,
          full_name: user?.fullName || '',
          phone: user?.phone || '',
        }))
      }
    }).catch(err => setLoadError(err.message))
      .finally(() => setLoadingData(false))
  }, [user, retryKey])

  function retryLoad() {
    setLoadingData(true)
    setLoadError('')
    setRetryKey(key => key + 1)
  }

  function updateField(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setError('')
    setDraftSaved(false)
  }

  function validateForm() {
    for (const field of [...identityFields, ...contactFields]) {
      if (field.type !== 'select' && !form[field.name]?.trim()) {
        setError(`${field.label.replace(' *', '')} wajib diisi.`)
        return false
      }
    }
    if (!form.gender) {
      setError('Jenis kelamin wajib dipilih.')
      return false
    }
    if (form.nisn && !/^\d{10}$/.test(form.nisn.trim())) {
      setError('NISN harus 10 digit angka.')
      return false
    }
    return true
  }

  function handleFormSubmit(e) {
    e.preventDefault()
    if (!validateForm()) return
    setStep('review')
  }

  async function savePayload(submit) {
    if (existing?.is_draft) {
      const { data } = await api.patch('/ppdb/me', { ...form, submit })
      return data
    }
    const { data } = await api.post('/ppdb', { ...form, submit })
    return data
  }

  async function handleSaveDraft() {
    setSavingDraft(true)
    setError('')
    try {
      const data = await savePayload(false)
      setExisting(data)
      setDraftSaved(true)
      toast('Draft pendaftaran berhasil disimpan.')
    } catch (err) {
      setError(err.message)
      toast(err.message, { type: 'error' })
    } finally {
      setSavingDraft(false)
    }
  }

  async function handleConfirm() {
    setSubmitting(true)
    setError('')
    try {
      const data = await savePayload(true)
      setResult(data)
      setExisting(data)
      setStep('done')
      toast('Pendaftaran berhasil dikirim.')
    } catch (err) {
      setError(err.message)
      toast(err.message, { type: 'error' })
      setStep('form')
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingData) return <div className="page-loading"><Spinner label="Memuat formulir PPDB" /></div>
  if (loadError) {
    return <ErrorState message={loadError} onRetry={retryLoad} />
  }

  if (existing && !existing.is_draft) {
    return (
      <div className="peserta-ppdb-page">
        <div className="page-heading"><h1>Formulir PPDB</h1></div>
        <div className="surface content-card already-submitted">
          <span style={{ fontSize: '48px' }}>✅</span>
          <h2>Anda sudah mendaftar</h2>
          <p>No. Pendaftaran: <strong>{existing.registration_number}</strong></p>
          <p>Anda hanya dapat mendaftar satu kali per periode.</p>
          <button type="button" className="button" onClick={() => navigate('/peserta/status')}>
            Lihat Status Pendaftaran
          </button>
        </div>
      </div>
    )
  }

  if (!period) {
    return (
      <div className="peserta-ppdb-page">
        <div className="page-heading"><h1>Formulir PPDB</h1></div>
        <div className="surface content-card">
          <p>Pendaftaran PPDB belum dibuka. Pantau website kami untuk informasi terbaru.</p>
        </div>
      </div>
    )
  }

  if (step === 'done' && result) {
    return (
      <div className="peserta-ppdb-page">
        <div className="page-heading"><h1>Pendaftaran Berhasil!</h1></div>
        <div className="surface content-card registration-success">
          <span style={{ fontSize: '56px' }}>🎉</span>
          <h2>Pendaftaran Diterima</h2>
          <div className="reg-number-box">
            <span>Nomor Pendaftaran Anda</span>
            <strong className="reg-number">{result.registration_number}</strong>
          </div>
          <p>Simpan nomor pendaftaran ini. Status pendaftaran dapat dipantau di halaman Status Pendaftaran.</p>
          <button type="button" className="button" onClick={() => navigate('/peserta/status')}>
            Lihat Status Pendaftaran
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="peserta-ppdb-page">
      <div className="page-heading">
        <h1>Formulir PPDB {period.academic_year}</h1>
        <p>
          Periode: {new Date(period.open_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} — {new Date(period.close_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {error && <p className="alert alert--error">{error}</p>}
      {draftSaved && <p className="alert alert--success">Draft berhasil disimpan.</p>}

      {step === 'form' && (
        <div className="registration-layout">
          <form className="registration-form surface content-card" onSubmit={handleFormSubmit}>
            <div className="registration-form-heading">
              <h2>Data Calon Siswa</h2>
              {existing?.is_draft && <span className="tag">Draft tersimpan</span>}
            </div>

            <section className="form-section">
              <h3><span>01</span> Identitas Diri</h3>
              <div className="registration-fields">
                {identityFields.map(field => (
                  <FormField key={field.name} field={field} value={form[field.name]} onChange={updateField} />
                ))}
              </div>
            </section>

            <section className="form-section">
              <h3><span>02</span> Asal Sekolah &amp; Kontak</h3>
              <div className="registration-fields">
                {contactFields.map(field => (
                  <FormField key={field.name} field={field} value={form[field.name]} onChange={updateField} />
                ))}
              </div>
            </section>

            <section className="form-section">
              <h3><span>03</span> Pilihan Program Keahlian</h3>
              <div className="program-choice-grid">
                {programs.map(program => program.icon && (
                  <label
                    key={program.title}
                    className={form.major_choice === program.title ? 'program-choice is-selected' : 'program-choice'}
                  >
                    <input
                      type="radio"
                      name="major_choice"
                      value={program.title}
                      checked={form.major_choice === program.title}
                      onChange={updateField}
                    />
                    <span className="choice-copy">
                      <strong>{program.shortTitle}</strong>
                      <small>{program.summary}</small>
                    </span>
                    <span className="choice-radio" aria-hidden="true" />
                  </label>
                ))}
              </div>
            </section>

            <p className="form-note">* Wajib diisi. Anda dapat menyimpan draft sebelum mengirim.</p>
            <div className="registration-actions">
              <button type="button" className="button button--secondary" onClick={handleSaveDraft} disabled={savingDraft}>
                {savingDraft ? 'Menyimpan draft…' : 'Simpan Draft'}
              </button>
              <button type="submit" className="button">Lanjut ke Tinjauan</button>
            </div>
          </form>

          <aside className="registration-aside">
            <section className="surface content-card aside-step">
              <span>TAHAP PENDAFTARAN</span>
              <h2>1. Isi Formulir</h2>
              <p>Lengkapi semua data diri, asal sekolah, dan pilihan program keahlian.</p>
            </section>
          </aside>
        </div>
      )}

      {step === 'review' && (
        <div className="surface content-card review-card">
          <h2>Tinjauan Data Pendaftaran</h2>
          <p className="form-note">Periksa kembali seluruh data sebelum mengirim pendaftaran.</p>
          <div className="review-grid">
            {[...identityFields, ...contactFields].map(f => (
              <div key={f.name} className="review-item">
                <span>{f.label.replace(' *', '')}</span>
                <strong>{form[f.name] || '—'}</strong>
              </div>
            ))}
            <div className="review-item">
              <span>Program Keahlian</span>
              <strong>{form.major_choice || '—'}</strong>
            </div>
          </div>
          <div className="registration-actions" style={{ marginTop: '24px' }}>
            <button type="button" className="button button--secondary" onClick={() => setStep('form')}>
              ← Kembali Edit
            </button>
            <button
              type="button"
              className="button"
              onClick={handleConfirm}
              disabled={submitting}
            >
              {submitting ? 'Mengirim…' : 'Konfirmasi & Kirim Pendaftaran'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
