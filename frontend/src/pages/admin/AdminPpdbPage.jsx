import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api.js'
import { isCanceledError } from '../../utils/media.js'
import { EmptyState, ErrorState, TableSkeleton } from '../../components/Feedback.jsx'
import { useToast } from '../../contexts/useToast.js'

const STATUS_LABELS = {
  menunggu: { label: 'Menunggu', color: '#f59e0b' },
  berhasil: { label: 'Berhasil', color: '#6366f1' },
  diterima: { label: 'Diterima', color: '#22c55e' },
  ditolak: { label: 'Ditolak', color: '#ef4444' },
}

export default function AdminPpdbPage() {
  const toast = useToast()
  const [items, setItems] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [retryKey, setRetryKey] = useState(0)

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [school, setSchool] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')
  const [page, setPage] = useState(1)
  const [processingId, setProcessingId] = useState('')
  const [rejectConfirm, setRejectConfirm] = useState(null)

  const debounceRef = useRef(null)

  const fetchData = useCallback(async (params, signal) => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/ppdb', { params, signal })
      setItems(data.data)
      setPagination(data.pagination)
    } catch (err) {
      if (!isCanceledError(err)) setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      fetchData({
        search,
        status,
        previous_school: school,
        date_from: dateFrom,
        date_to: dateTo,
        sortBy,
        sortOrder,
        page,
        limit: 10,
      }, controller.signal)
    }, 350)
    return () => {
      clearTimeout(debounceRef.current)
      controller.abort()
    }
  }, [search, status, school, dateFrom, dateTo, sortBy, sortOrder, page, fetchData, retryKey])

  function resetFilters() {
    setSearch(''); setStatus(''); setSchool(''); setDateFrom(''); setDateTo('')
    setSortBy('created_at'); setSortOrder('desc'); setPage(1)
  }

  async function updateApplicationStatus(item, nextStatus) {
    setProcessingId(item.id)
    try {
      const { data } = await api.patch(`/ppdb/${item.id}/status`, { status: nextStatus })
      setItems(current => current.map(application => (
        application.id === item.id ? { ...application, ...data } : application
      )))
      setRetryKey(key => key + 1)
      setRejectConfirm(null)
      toast(nextStatus === 'berhasil'
        ? `Pendaftaran ${item.full_name} berhasil diverifikasi.`
        : `Pendaftaran ${item.full_name} berhasil ditolak.`)
    } catch (err) {
      toast(err.message, { type: 'error' })
    } finally {
      setProcessingId('')
    }
  }

  return (
    <div className="admin-ppdb-page">
      <div className="page-heading">
        <h1>Data Pendaftar PPDB</h1>
        <p>{pagination.total} pendaftar ditemukan.</p>
      </div>

      <div className="filter-bar surface content-card">
        <input
          className="filter-input"
          type="search"
          placeholder="Cari nama, no. pendaftaran, NISN, email…"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
        />
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1) }}>
          <option value="">Semua Status</option>
          {Object.keys(STATUS_LABELS).map(s => (
            <option key={s} value={s}>{STATUS_LABELS[s].label}</option>
          ))}
        </select>
        <input
          className="filter-input"
          type="search"
          placeholder="Asal sekolah"
          value={school}
          onChange={e => { setSchool(e.target.value); setPage(1) }}
        />
        <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1) }} title="Dari tanggal" />
        <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1) }} title="Sampai tanggal" />
        <select value={`${sortBy}:${sortOrder}`} onChange={e => {
          const [by, order] = e.target.value.split(':')
          setSortBy(by); setSortOrder(order); setPage(1)
        }}>
          <option value="created_at:desc">Terbaru</option>
          <option value="created_at:asc">Terlama</option>
          <option value="full_name:asc">Nama A–Z</option>
          <option value="full_name:desc">Nama Z–A</option>
        </select>
        <button type="button" className="button button--secondary" onClick={resetFilters}>Reset</button>
      </div>

      <div
        className="table-wrapper surface"
        tabIndex={0}
        role="region"
        aria-label="Daftar pendaftar, geser horizontal untuk melihat semua kolom"
      >
        {loading ? (
          <TableSkeleton rows={6} columns={9} />
        ) : error ? (
          <ErrorState message={error} onRetry={() => setRetryKey(key => key + 1)} />
        ) : items.length === 0 ? (
          <EmptyState
            title="Pendaftar tidak ditemukan"
            description="Ubah kata kunci atau filter untuk melihat hasil lainnya."
          />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>No. Pendaftaran</th>
                <th>Nama</th>
                <th>NISN</th>
                <th>Email</th>
                <th>Telepon</th>
                <th>Asal Sekolah</th>
                <th>Tanggal</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td><code>{item.registration_number}</code></td>
                  <td>{item.full_name}</td>
                  <td>{item.nisn}</td>
                  <td>{item.email || '—'}</td>
                  <td>{item.phone}</td>
                  <td>{item.previous_school}</td>
                  <td>{new Date(item.created_at).toLocaleDateString('id-ID')}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{ background: STATUS_LABELS[item.status]?.color + '22', color: STATUS_LABELS[item.status]?.color }}
                    >
                      {STATUS_LABELS[item.status]?.label}
                    </span>
                  </td>
                  <td>
                    <div className="ppdb-row-actions">
                      <Link to={`/admin/ppdb/${item.id}`} className="button button--secondary btn-sm">
                        Detail
                      </Link>
                      {(item.status === 'menunggu' || item.status === 'berhasil') && (
                        <>
                          {item.status === 'menunggu' && (
                            <button
                              type="button"
                              className="button btn-sm"
                              disabled={processingId === item.id}
                              onClick={() => updateApplicationStatus(item, 'berhasil')}
                            >
                              {processingId === item.id ? 'Menyimpan…' : 'Verifikasi'}
                            </button>
                          )}
                          <button
                            type="button"
                            className="button button--danger btn-sm"
                            disabled={processingId === item.id}
                            onClick={() => setRejectConfirm(item)}
                          >
                            Tolak
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <nav className="pagination" aria-label="Halaman pendaftar">
          <button type="button" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} type="button" className={page === p ? 'is-active' : ''} onClick={() => setPage(p)}>{p}</button>
          ))}
          <button type="button" disabled={page === pagination.totalPages} onClick={() => setPage(p => p + 1)}>›</button>
        </nav>
      )}

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
          <div className="confirm-dialog surface content-card" role="dialog" aria-modal="true" aria-labelledby="reject-application-title">
            <h2 id="reject-application-title">Tolak Pendaftaran</h2>
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
