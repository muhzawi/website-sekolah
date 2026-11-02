import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'
import api from '../../services/api.js'
import { ErrorState, Spinner } from '../../components/Feedback.jsx'
import tutWuriHandayaniLogo from '../../assets/tut-wuri-handayani.png'

const STATUS_LABELS = {
  menunggu: { label: 'Menunggu Verifikasi', color: '#f59e0b' },
  berhasil: { label: 'Berhasil', color: '#6366f1' },
  diterima: { label: 'Diterima', color: '#22c55e' },
  ditolak: { label: 'Ditolak', color: '#ef4444' },
}

export default function PesertaDashboardPage() {
  const { user } = useAuth()
  const [application, setApplication] = useState(null)
  const [period, setPeriod] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    Promise.all([
      api.get('/ppdb/me').then(r => r.data[0] || null),
      api.get('/ppdb/settings').then(r => r.data),
    ])
      .then(([app, p]) => {
        setApplication(app)
        setPeriod(p)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [retryKey])

  function retryDashboard() {
    setLoading(true)
    setError('')
    setRetryKey(key => key + 1)
  }

  if (loading) return <div className="page-loading"><Spinner label="Memuat dashboard peserta" /></div>
  if (error) return <ErrorState message={error} onRetry={retryDashboard} />

  const statusInfo = application ? STATUS_LABELS[application.status] : null

  return (
    <div className="peserta-dashboard">
      <header className="peserta-welcome surface">
        <div>
          <span className="peserta-eyebrow">PORTAL PESERTA · PPDB</span>
          <h1>Selamat Datang, {user?.fullName || 'Peserta'}!</h1>
          <p>Pantau pendaftaran dan temukan langkah berikutnya di sini.</p>
        </div>
        <span className="peserta-welcome-mark" role="img" aria-label="Logo Tut Wuri Handayani">
          <img src={tutWuriHandayaniLogo} alt="" />
        </span>
      </header>

      <div className={`peserta-bento-grid${period ? '' : ' is-no-period'}`}>
        <section className="surface peserta-status-card peserta-bento-status" aria-label="Ringkasan pendaftaran">
          <div className="bento-card-heading">
            <span className="bento-card-kicker">PENDAFTARAN</span>
            {application && !application.is_draft && (
              <span
                className="status-badge"
                style={{ background: (statusInfo?.color || '#2563eb') + '22', color: statusInfo?.color || '#2563eb' }}
              >
                {statusInfo?.label || 'Sedang Diproses'}
              </span>
            )}
          </div>

          {application && !application.is_draft ? (
            <>
              <div className="registration-number">
                <span className="muted-copy">Nomor pendaftaran</span>
                <strong className="reg-number">{application.registration_number}</strong>
              </div>
              {application.admin_notes && (
                <div className="admin-notes-box">
                  <strong>Catatan Admin</strong>
                  <p>{application.admin_notes}</p>
                </div>
              )}
              <Link to="/peserta/status" className="button button--secondary bento-action">
                Lihat detail status <span aria-hidden="true">→</span>
              </Link>
            </>
          ) : (
            <div className="no-application">
              <div>
                <h2>{application?.is_draft ? 'Draft belum dikirim' : 'Belum ada pendaftaran'}</h2>
                <p>
                  {application?.is_draft
                    ? 'Lengkapi draft formulir untuk mendapatkan nomor pendaftaran.'
                    : period
                      ? `Periode PPDB ${period.period_name} (${period.academic_year}) sedang dibuka. Daftar sekarang.`
                      : 'Pendaftaran PPDB belum dibuka. Pantau terus informasi terbaru.'}
                </p>
              </div>
              {period && (
                <Link to="/peserta/ppdb" className="button">
                  {application?.is_draft ? 'Lanjutkan formulir' : 'Mulai pendaftaran'}
                </Link>
              )}
            </div>
          )}
        </section>

        {period && (
          <section className="surface content-card period-info-card peserta-bento-period">
            <div className="bento-card-heading">
              <span className="bento-card-kicker">JADWAL PENERIMAAN</span>
              <span className="period-live-dot" aria-label="Informasi periode aktif" />
            </div>
            <h2>{period.period_name}</h2>
            <p className="period-academic-year">Tahun ajaran {period.academic_year}</p>
            <div className="period-details">
              <div>
                <span>Dibuka</span>
                <strong>{new Date(period.open_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
              </div>
              <div>
                <span>Ditutup</span>
                <strong>{new Date(period.close_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  )
}
