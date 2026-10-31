import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../../services/api.js'
import { ErrorState, Spinner } from '../../components/Feedback.jsx'
import { useToast } from '../../contexts/useToast.js'

const STATUS_LABELS = {
  menunggu: { label: 'Menunggu', color: '#f59e0b' },
  berhasil: { label: 'Berhasil', color: '#6366f1' },
  diterima: { label: 'Diterima', color: '#22c55e' },
  ditolak: { label: 'Ditolak', color: '#ef4444' },
}

const STATUS_OPTIONS = ['menunggu', 'berhasil', 'diterima', 'ditolak']

export default function AdminPpdbDetailPage() {
  const { id } = useParams()
  const toast = useToast()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryKey, setRetryKey] = useState(0)
  const [statusUpdate, setStatusUpdate] = useState({ status: '', admin_notes: '', loading: false, error: '' })

  useEffect(() => {
    setLoading(true)
    setError('')
    api.get(`/ppdb/${id}`)
      .then(({ data }) => {
        setItem(data)
        setStatusUpdate({ status: data.status, admin_notes: data.admin_notes || '', loading: false, error: '' })
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id, retryKey])

  async function handleStatusUpdate(e) {
    e.preventDefault()
    setStatusUpdate(s => ({ ...s, loading: true, error: '' }))
    try {
      const { data } = await api.patch(`/ppdb/${id}/status`, {
        status: statusUpdate.status,
        admin_notes: statusUpdate.admin_notes,
      })
      setItem(data)
      toast('Status pendaftaran berhasil diperbarui.')
    } catch (err) {
      setStatusUpdate(s => ({ ...s, error: err.message }))
      toast(err.message, { type: 'error' })
    } finally {
      setStatusUpdate(s => ({ ...s, loading: false }))
    }
  }

  if (loading) return <div className="page-loading"><Spinner label="Memuat detail pendaftar" /></div>
  if (error) return <ErrorState message={error} onRetry={() => setRetryKey(key => key + 1)} />
  if (!item) return null

  return (
    <div className="admin-ppdb-detail">
      <div className="page-heading">
        <p><Link to="/admin/ppdb">← Kembali ke daftar pendaftar</Link></p>
        <h1>Detail Pendaftar</h1>
        <p>No. {item.registration_number}</p>
      </div>

      <div className="surface content-card">
        <div className="detail-grid">
          <div><span>No. Pendaftaran</span><strong>{item.registration_number}</strong></div>
          <div><span>Nama Lengkap</span><strong>{item.full_name}</strong></div>
          <div><span>NISN</span><strong>{item.nisn}</strong></div>
          <div><span>Email</span><strong>{item.email || '—'}</strong></div>
          <div><span>Telepon</span><strong>{item.phone}</strong></div>
          <div><span>Tempat Lahir</span><strong>{item.birth_place}</strong></div>
          <div><span>Tanggal Lahir</span><strong>{item.birth_date}</strong></div>
          <div><span>Jenis Kelamin</span><strong>{item.gender}</strong></div>
          <div><span>Asal Sekolah</span><strong>{item.previous_school}</strong></div>
          <div><span>Orang Tua/Wali</span><strong>{item.parent_name}</strong></div>
          <div><span>Telepon Ortu</span><strong>{item.parent_phone}</strong></div>
          <div><span>Program</span><strong>{item.major_choice || '—'}</strong></div>
          <div><span>Tanggal Daftar</span><strong>{new Date(item.submitted_at || item.created_at).toLocaleDateString('id-ID')}</strong></div>
          <div><span>Alamat</span><strong>{item.address}</strong></div>
        </div>
      </div>

      <form className="status-update-form surface content-card" onSubmit={handleStatusUpdate} style={{ marginTop: 16 }}>
        <h3>Ubah Status</h3>
        {statusUpdate.error && <p className="alert alert--error">{statusUpdate.error}</p>}
        <label className="form-field">
          <span>Status</span>
          <select
            value={statusUpdate.status}
            onChange={e => setStatusUpdate(s => ({ ...s, status: e.target.value }))}
            required
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{STATUS_LABELS[s].label}</option>
            ))}
          </select>
        </label>
        <label className="form-field">
          <span>Catatan Admin (opsional)</span>
          <textarea
            value={statusUpdate.admin_notes}
            onChange={e => setStatusUpdate(s => ({ ...s, admin_notes: e.target.value }))}
            rows="3"
            placeholder="Catatan untuk peserta…"
          />
        </label>
        <button type="submit" className="button" disabled={statusUpdate.loading}>
          {statusUpdate.loading ? 'Menyimpan…' : 'Simpan Status'}
        </button>
      </form>
    </div>
  )
}
