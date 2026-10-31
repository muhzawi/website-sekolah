import { useEffect, useState } from 'react'
import api from '../../services/api.js'
import { EmptyState, ErrorState, Spinner } from '../../components/Feedback.jsx'

const STATUS_LABELS = {
  menunggu: { label: 'Menunggu Verifikasi', color: '#f59e0b', icon: '⏳', next: 'Tim kami akan memverifikasi data Anda.' },
  berhasil: { label: 'Berhasil', color: '#6366f1', icon: '✅', next: 'Pendaftaran Anda berhasil diverifikasi dan sedang dalam proses seleksi.' },
  diterima: { label: 'Diterima', color: '#22c55e', icon: '✅', next: 'Selamat! Silakan ikuti proses daftar ulang.' },
  ditolak: { label: 'Tidak Diterima', color: '#ef4444', icon: '❌', next: 'Mohon maaf, pendaftaran Anda tidak dapat diproses.' },
}

export default function PesertaStatusPage() {
  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    api.get('/ppdb/me')
      .then(res => setApplication(res.data[0] || null))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [retryKey])

  function retryStatus() {
    setLoading(true)
    setError('')
    setRetryKey(key => key + 1)
  }

  if (loading) return <div className="page-loading"><Spinner label="Memuat status pendaftaran" /></div>

  return (
    <div className="peserta-status-page">
      <div className="page-heading">
        <h1>Status Pendaftaran</h1>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={retryStatus} />
      ) : !application || application.is_draft ? (
        <EmptyState
          title={application?.is_draft ? 'Pendaftaran belum dikirim' : 'Belum ada pendaftaran'}
          description={application?.is_draft
            ? 'Formulir Anda masih berupa draft.'
            : 'Mulai isi formulir PPDB untuk melihat status pendaftaran.'}
        />
      ) : (() => {
        const info = STATUS_LABELS[application.status]
        return (
          <div className="surface content-card status-detail-card">
            <div className="status-hero" style={{ borderColor: info.color + '44', background: info.color + '11' }}>
              <span style={{ fontSize: '48px' }}>{info.icon}</span>
              <div>
                <span className="status-badge" style={{ background: info.color + '22', color: info.color, fontSize: '16px', padding: '6px 18px' }}>
                  {info.label}
                </span>
                <p style={{ color: 'var(--body-text)', marginTop: '10px' }}>{info.next}</p>
              </div>
            </div>

            <div className="status-info-grid">
              <div>
                <span>Nomor Pendaftaran</span>
                <strong className="reg-number">{application.registration_number}</strong>
              </div>
              <div>
                <span>Tanggal Pendaftaran</span>
                <strong>{new Date(application.submitted_at || application.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
              </div>
              <div>
                <span>Nama Lengkap</span>
                <strong>{application.full_name}</strong>
              </div>
              <div>
                <span>NISN</span>
                <strong>{application.nisn}</strong>
              </div>
              <div>
                <span>Program Keahlian</span>
                <strong>{application.major_choice || '—'}</strong>
              </div>
              <div>
                <span>Asal Sekolah</span>
                <strong>{application.previous_school}</strong>
              </div>
            </div>

            {application.admin_notes && (
              <div className="admin-notes-box">
                <strong>Catatan dari Admin:</strong>
                <p>{application.admin_notes}</p>
              </div>
            )}

            <p className="form-note" style={{ marginTop: '16px' }}>
              Terakhir diperbarui: {new Date(application.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        )
      })()}
    </div>
  )
}
