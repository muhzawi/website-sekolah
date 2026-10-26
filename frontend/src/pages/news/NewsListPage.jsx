import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeading from '../../components/PageHeading.jsx'
import api from '../../services/api.js'
import { isCanceledError, newsImageUrl } from '../../utils/media.js'
import { EmptyState, ErrorState, NewsGridSkeleton } from '../../components/Feedback.jsx'

const PAGE_SIZE = 6

export default function NewsListPage() {
  const [items, setItems] = useState([])
  const [featured, setFeatured] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [sortOrder, setSortOrder] = useState('desc')
  const [activePage, setActivePage] = useState(1)
  const [retryKey, setRetryKey] = useState(0)

  const debounceRef = useRef(null)

  const fetchNews = useCallback(async (q, pg, order, signal) => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/news', {
        params: { search: q, page: pg, limit: PAGE_SIZE, sortBy: 'published_at', sortOrder: order },
        signal,
      })
      if (pg === 1 && !q && data.data.length > 0) {
        setFeatured(data.data[0])
        setItems(data.data.slice(1))
      } else {
        setFeatured(null)
        setItems(data.data)
      }
      setPagination(data.pagination)
    } catch (err) {
      if (isCanceledError(err)) return
      setError(err.message)
      setItems([])
      setFeatured(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchNews(search, activePage, sortOrder, controller.signal), 350)
    return () => {
      clearTimeout(debounceRef.current)
      controller.abort()
    }
  }, [search, activePage, sortOrder, fetchNews, retryKey])

  return (
    <>
      <PageHeading breadcrumbs={['Beranda', 'Berita & Pengumuman']} title="Berita & Pengumuman" size="medium" />

      <div className="news-search-bar" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <input
          type="search"
          placeholder="Cari berita…"
          value={search}
          onChange={e => { setSearch(e.target.value); setActivePage(1) }}
          className="news-search-input"
        />
        <select value={sortOrder} onChange={e => { setSortOrder(e.target.value); setActivePage(1) }}>
          <option value="desc">Terbaru</option>
          <option value="asc">Terlama</option>
        </select>
      </div>

      {loading && <NewsGridSkeleton />}
      {!loading && error && <ErrorState message={error} onRetry={() => setRetryKey(key => key + 1)} />}

      {!loading && featured && !search && (
        <Link to={`/news/${featured.slug}`} className="featured-news surface">
          {newsImageUrl(featured.cover_image_path) && (
            <img src={newsImageUrl(featured.cover_image_path)} alt={featured.title} />
          )}
          <span className="featured-news-copy">
            <time>{featured.published_at ? new Date(featured.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</time>
            <strong>{featured.title}</strong>
            <span>{featured.excerpt}</span>
          </span>
        </Link>
      )}

      {!loading && !error && (
        <div className="news-grid">
          {items.length ? items.map(item => (
            <Link key={item.id} to={`/news/${item.slug}`} className="news-card">
              {newsImageUrl(item.cover_image_path) && (
                <img
                  className="news-card-image"
                  src={newsImageUrl(item.cover_image_path)}
                  alt={item.title}
                />
              )}
              <div className="news-card-copy">
                <time>{item.published_at ? new Date(item.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</time>
                <h3>{item.title}</h3>
                <p>{item.excerpt}</p>
              </div>
            </Link>
          )) : (
            <EmptyState
              title="Berita tidak ditemukan"
              description={search ? 'Coba kata kunci yang berbeda.' : 'Belum ada berita yang dipublikasikan.'}
            />
          )}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <nav className="pagination" aria-label="Halaman berita">
          <button type="button" disabled={activePage === 1} onClick={() => setActivePage(p => p - 1)}>‹</button>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} type="button" className={activePage === p ? 'is-active' : ''} onClick={() => setActivePage(p)}>{p}</button>
          ))}
          <button type="button" disabled={activePage === pagination.totalPages} onClick={() => setActivePage(p => p + 1)}>›</button>
        </nav>
      )}
    </>
  )
}
