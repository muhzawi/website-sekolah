import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api.js'
import { isCanceledError } from '../../utils/media.js'
import { useToast } from '../../contexts/useToast.js'
import { EmptyState, ErrorState, TableSkeleton } from '../../components/Feedback.jsx'

export default function AdminNewsPage() {
  const toast = useToast()
  const [items, setItems] = useState([])
  const [authors, setAuthors] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [retryKey, setRetryKey] = useState(0)

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [authorId, setAuthorId] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')
  const [page, setPage] = useState(1)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const debounceRef = useRef(null)

  const fetchData = useCallback(async (params, signal) => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/admin/news', { params, signal })
      setItems(data.data)
      setPagination(data.pagination)
      if (data.authors) setAuthors(data.authors)
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
        search, status, author_id: authorId, date_from: dateFrom, date_to: dateTo,
        sortBy, sortOrder, page, limit: 10,
      }, controller.signal)
    }, 350)
    return () => {
      clearTimeout(debounceRef.current)
      controller.abort()
    }
  }, [search, status, authorId, dateFrom, dateTo, sortBy, sortOrder, page, fetchData, retryKey])

  async function handleDelete(id) {
    try {
      await api.delete(`/admin/news/${id}`)
      setItems(prev => prev.filter(item => item.id !== id))
      setPagination(prev => ({ ...prev, total: prev.total - 1 }))
      setDeleteConfirm(null)
      toast('Berita berhasil dihapus.')
    } catch (err) {
      setError(err.message)
      toast(err.message, { type: 'error' })
    }
  }

  return (
    <div className="admin-news-page">
      <div className="page-heading-row">
        <div className="page-heading">
          <h1>Kelola Berita</h1>
          <p>Total {pagination.total} berita.</p>
        </div>
        <Link to="/admin/news/create" className="button">+ Tulis Berita</Link>
      </div>

      <div className="filter-bar surface content-card">
        <input
          className="filter-input"
          type="search"
          placeholder="Cari judul atau ringkasan…"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
        />
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1) }}>
          <option value="">Semua Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        {authors.length > 0 && (
          <select value={authorId} onChange={e => { setAuthorId(e.target.value); setPage(1) }}>
            <option value="">Semua Penulis</option>
            {authors.map(author => (
              <option key={author.id} value={author.id}>{author.full_name || 'Admin'}</option>
            ))}
          </select>
        )}
        <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1) }} title="Dari tanggal" />
        <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1) }} title="Sampai tanggal" />
        <select value={`${sortBy}:${sortOrder}`} onChange={e => {
          const [by, order] = e.target.value.split(':')
          setSortBy(by); setSortOrder(order); setPage(1)
        }}>
          <option value="created_at:desc">Terbaru</option>
          <option value="created_at:asc">Terlama</option>
          <option value="title:asc">Judul A–Z</option>
          <option value="title:desc">Judul Z–A</option>
        </select>
        <button type="button" className="button button--secondary" onClick={() => {
          setSearch(''); setStatus(''); setAuthorId(''); setDateFrom(''); setDateTo('')
          setSortBy('created_at'); setSortOrder('desc'); setPage(1)
        }}>Reset</button>
      </div>

      <div className="table-wrapper surface">
        {loading ? (
          <TableSkeleton rows={6} columns={5} />
        ) : error ? (
          <ErrorState message={error} onRetry={() => setRetryKey(key => key + 1)} />
        ) : items.length === 0 ? (
          <EmptyState
            title="Belum ada berita"
            description="Berita yang dibuat akan tampil di sini."
          />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Judul</th>
                <th>Penulis</th>
                <th>Status</th>
                <th>Tanggal</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.title}</strong>
                    <span className="table-slug">/{item.slug}</span>
                  </td>
                  <td>{item.author?.full_name || '—'}</td>
                  <td>
                    <span className={`status-badge status-badge--${item.status}`}>
                      {item.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>{new Date(item.created_at).toLocaleDateString('id-ID')}</td>
                  <td className="table-actions">
                    <Link to={`/admin/news/${item.id}/edit`} className="button button--secondary btn-sm">Edit</Link>
                    <button
                      type="button"
                      className="button button--danger btn-sm"
                      onClick={() => setDeleteConfirm(item)}
                    >Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <nav className="pagination">
          <button type="button" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} type="button" className={page === p ? 'is-active' : ''} onClick={() => setPage(p)}>{p}</button>
          ))}
          <button type="button" disabled={page === pagination.totalPages} onClick={() => setPage(p => p + 1)}>›</button>
        </nav>
      )}

      {deleteConfirm && (
        <div className="dialog-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setDeleteConfirm(null) }}>
          <div className="confirm-dialog surface content-card" role="dialog" aria-modal="true">
            <h2>Hapus Berita</h2>
            <p>Apakah Anda yakin ingin menghapus berita <strong>"{deleteConfirm.title}"</strong>? Tindakan ini tidak dapat dibatalkan.</p>
            <div className="dialog-actions">
              <button type="button" className="button button--secondary" onClick={() => setDeleteConfirm(null)}>Batal</button>
              <button type="button" className="button button--danger" onClick={() => handleDelete(deleteConfirm.id)}>Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
