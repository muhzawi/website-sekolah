import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'
import api from '../../services/api.js'
import { ErrorState, Spinner } from '../../components/Feedback.jsx'

const STATUS_LABELS = {
  menunggu: { label: 'Menunggu Verifikasi', color: '#f59e0b', icon: '⏳' },
  berhasil: { label: 'Berhasil', color: '#6366f1', icon: '✅' },
  diterima: { label: 'Diterima', color: '#22c55e', icon: '✅' },
  ditolak: { label: 'Ditolak', color: '#ef4444', icon: '❌' },
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
      <div className="page-heading">
        <h1>Selamat Datang, {user?.fullName || 'Peserta'}!</h1>
        <p>Dashboard PPDB Anda.</p>
      </div>

      {/* Status Card */}
      <div className="surface content-card peserta-status-card">
        {application && !application.is_draft ? (
          <>
            <div className="peserta-status-info">
              <span style={{ fontSize: '32px' }}>{statusInfo?.icon}</span>
              <div>
                <p className="muted-copy">No. Pendaftaran</p>
                <strong className="reg-number">{application.registration_number}</strong>
                <p className="muted-copy" style={{ marginTop: '8px' }}>Status Pendaftaran</p>
                <span
                  className="status-badge"
                  style={{ background: statusInfo?.color + '22', color: statusInfo?.color }}
                >
                  {statusInfo?.label}
                </span>
              </div>
            </div>
            {application.admin_notes && (
              <div className="admin-notes-box">
                <strong>Catatan Admin:</strong>
                <p>{application.admin_notes}</p>
              </div>
            )}
            <Link to="/peserta/status" className="button button--secondary">Lihat Detail Status</Link>
          </>
        ) : (
          <div className="no-application">
            <span style={{ fontSize: '48px' }}>📝</span>
            <h2>{application?.is_draft ? 'Draft belum dikirim' : 'Belum ada pendaftaran'}</h2>
            <p>
              {application?.is_draft
                ? 'Anda memiliki draft formulir. Lengkapi dan kirim untuk mendapatkan nomor pendaftaran.'
                : period
                  ? `Periode PPDB ${period.period_name} (${period.academic_year}) sedang dibuka. Daftar sekarang!`
                  : 'Pendaftaran PPDB belum dibuka. Pantau terus untuk informasi terbaru.'}
            </p>
            {period && (
              <Link to="/peserta/ppdb" className="button">
                {application?.is_draft ? 'Lanjutkan Formulir' : 'Mulai Pendaftaran'}
              </Link>
            )}
          </div>
        )}
      </div>

      {/* PPDB Period Info */}
      {period && (
        <div className="surface content-card period-info-card">
          <h2>Informasi PPDB</h2>
          <div className="period-details">
            <div>
              <span>Periode</span>
              <strong>{period.period_name} — {period.academic_year}</strong>
            </div>
            <div>
              <span>Dibuka</span>
              <strong>{new Date(period.open_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
            </div>
            <div>
              <span>Ditutup</span>
              <strong>{new Date(period.close_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Quick nav */}
      <div className="peserta-quick-nav">
        {(!application || application.is_draft) && period && (
          <Link to="/peserta/ppdb" className="quick-nav-card surface">
            <span>📝</span>
            <strong>Formulir PPDB</strong>
            <p>Isi dan kirim formulir pendaftaran</p>
          </Link>
        )}
        <Link to="/peserta/status" className="quick-nav-card surface">
          <span>📋</span>
          <strong>Status Pendaftaran</strong>
          <p>Lihat status dan catatan admin</p>
        </Link>
        <Link to="/peserta/profil" className="quick-nav-card surface">
          <span>👤</span>
          <strong>Profil Akun</strong>
          <p>Perbarui informasi akun Anda</p>
        </Link>
      </div>
    </div>
  )
}
