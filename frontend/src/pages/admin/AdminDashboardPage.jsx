import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api.js'
import { DashboardSkeleton, EmptyState, ErrorState, TableSkeleton } from '../../components/Feedback.jsx'
import { useToast } from '../../contexts/useToast.js'

function StatCard({ label, value, color, icon }) {
  return (
    <article className="stat-card surface">
      <span style={{ fontSize: '24px' }}>{icon}</span>
      <strong style={{ color }}>{value ?? '—'}</strong>
      <span>{label}</span>
    </article>
  )
}

export default function AdminDashboardPage() {
  const toast = useToast()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryKey, setRetryKey] = useState(0)
  const [pendingApplications, setPendingApplications] = useState([])
  const [pendingLoading, setPendingLoading] = useState(true)
  const [pendingError, setPendingError] = useState('')
  const [processingId, setProcessingId] = useState('')
  const [rejectConfirm, setRejectConfirm] = useState(null)

  const fetchDashboardData = useCallback(() => {
    api.get('/admin/dashboard/stats')
      .then(res => setStats(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
    api.get('/ppdb', {
      params: {
        status: 'menunggu',
        page: 1,
        limit: 5,
        sortBy: 'created_at',
        sortOrder: 'desc',
      },
    })
      .then(({ data }) => setPendingApplications(data.data))
      .catch(err => setPendingError(err.message))
      .finally(() => setPendingLoading(false))
  }, [])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData, retryKey])

  function retryDashboard() {
    setLoading(true)
    setError('')
    setPendingLoading(true)
    setPendingError('')
    setRetryKey(key => key + 1)
  }

  async function updateApplicationStatus(application, nextStatus) {
    setProcessingId(application.id)
    try {
      await api.patch(`/ppdb/${application.id}/status`, { status: nextStatus })
      setPendingApplications(current => current.filter(item => item.id !== application.id))
      setStats(current => ({
        ...current,
        menunggu: Math.max(0, current.menunggu - 1),
        [nextStatus]: current[nextStatus] + 1,
      }))
      setRejectConfirm(null)
      toast(nextStatus === 'berhasil'
        ? `Pendaftaran ${application.full_name} berhasil diverifikasi.`
        : `Pendaftaran ${application.full_name} berhasil ditolak.`)
    } catch (err) {
      toast(err.message, { type: 'error' })
    } finally {
      setProcessingId('')
    }
  }

  if (loading) return <DashboardSkeleton />
  if (error) return <ErrorState message={error} onRetry={retryDashboard} />

  return (
    <div className="admin-dashboard">
      <div className="page-heading">
        <h1>Dashboard Admin</h1>
        <p>Ringkasan data PPDB dan berita.</p>
      </div>

      <div className="stats-grid">
        <StatCard label="Total Pendaftar" value={stats.totalPendaftar} icon="📋" color="var(--blue)" />
        <StatCard label="Menunggu" value={stats.menunggu} icon="⏳" color="#f59e0b" />
        <StatCard label="Berhasil" value={stats.berhasil} icon="✅" color="#6366f1" />
        <StatCard label="Diterima" value={stats.diterima} icon="✅" color="#22c55e" />
        <StatCard label="Ditolak" value={stats.ditolak} icon="❌" color="#ef4444" />
        <StatCard label="Berita Published" value={stats.beritaPublished} icon="📰" color="var(--blue)" />
      </div>

      <section className="admin-pending-section">
        <div className="section-heading">
          <div>
            <h2>Pendaftar Menunggu Verifikasi</h2>
            <p className="muted-copy">Tinjau pengajuan terbaru dan tentukan tindak lanjutnya.</p>
          </div>
          <Link to="/admin/ppdb" className="button button--secondary">Semua Pendaftar</Link>
        </div>

        <div className="table-wrapper surface">
          {pendingLoading ? (
            <TableSkeleton rows={3} columns={5} />
          ) : pendingError ? (
            <ErrorState message={pendingError} onRetry={retryDashboard} />
          ) : pendingApplications.length === 0 ? (
            <EmptyState
              title="Tidak ada pendaftar yang menunggu"
              description="Pengajuan baru akan muncul di bagian ini."
            />
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>No. Pendaftaran</th>
                  <th>Nama</th>
                  <th>Asal Sekolah</th>
                  <th>Tanggal</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pendingApplications.map(application => (
                  <tr key={application.id}>
                    <td><code>{application.registration_number}</code></td>
                    <td>
                      <strong>{application.full_name}</strong>
                      <span className="table-slug">NISN: {application.nisn}</span>
                    </td>
                    <td>{application.previous_school}</td>
                    <td>{new Date(application.submitted_at || application.created_at).toLocaleDateString('id-ID')}</td>
                    <td>
                      <div className="ppdb-row-actions">
                        <Link to={`/admin/ppdb/${application.id}`} className="button button--secondary btn-sm">
                          Detail
                        </Link>
                        <button
                          type="button"
                          className="button btn-sm"
                          disabled={processingId === application.id}
                          onClick={() => updateApplicationStatus(application, 'berhasil')}
                        >
                          {processingId === application.id ? 'Menyimpan…' : 'Verifikasi'}
                        </button>
                        <button
                          type="button"
                          className="button button--danger btn-sm"
                          disabled={processingId === application.id}
                          onClick={() => setRejectConfirm(application)}
                        >
                          Tolak
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {rejectConfirm && (
        <div
          className="dialog-backdrop"
          role="presentation"
          onMouseDown={event => {
            if (event.target === event.currentTarget && processingId !== rejectConfirm.id) {
              setRejectConfirm(null)
            }
          }}
        >
          <div className="confirm-dialog surface content-card" role="dialog" aria-modal="true" aria-labelledby="dashboard-reject-title">
            <h2 id="dashboard-reject-title">Tolak Pendaftaran</h2>
            <p>
              Yakin ingin menolak pendaftaran <strong>{rejectConfirm.full_name}</strong>
              {' '}({rejectConfirm.registration_number})? Status ini akan diperbarui untuk peserta.
            </p>
            <div className="dialog-actions">
              <button
                type="button"
                className="button button--secondary"
                disabled={processingId === rejectConfirm.id}
                onClick={() => setRejectConfirm(null)}
              >
                Batal
              </button>
              <button
                type="button"
                className="button button--danger"
                disabled={processingId === rejectConfirm.id}
                onClick={() => updateApplicationStatus(rejectConfirm, 'ditolak')}
              >
                {processingId === rejectConfirm.id ? 'Menyimpan…' : 'Ya, Tolak'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
