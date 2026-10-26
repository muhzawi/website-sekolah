import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageHeading from '../../components/PageHeading.jsx'
import api from '../../services/api.js'
import { newsImageUrl } from '../../utils/media.js'
import { ErrorState, Spinner } from '../../components/Feedback.jsx'

export default function NewsDetailPage() {
  const { slug } = useParams()
  const [news, setNews] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/news/${slug}`)
      .then(res => setNews(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="page-loading"><Spinner label="Memuat berita" /></div>
  if (error) return (
    <>
      <PageHeading breadcrumbs={['Beranda', 'Berita']} title="Berita Tidak Ditemukan" />
      <ErrorState message={error} />
      <Link to="/news" className="button button--secondary" style={{ marginTop: '16px' }}>← Kembali ke Berita</Link>
    </>
  )
  if (!news) return null

  const coverUrl = newsImageUrl(news.cover_image_path)

  return (
    <>
      <PageHeading
        breadcrumbs={['Beranda', 'Berita', news.title]}
        title={news.title}
        description={news.excerpt}
        size="large"
      />

      {coverUrl && (
        <img className="news-detail-cover" src={coverUrl} alt={news.title} />
      )}

      <article className="surface content-card news-detail-body">
        <div className="news-meta">
          {news.published_at && (
            <time>
              {new Date(news.published_at).toLocaleDateString('id-ID', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
              })}
            </time>
          )}
        </div>
        <div className="news-content">
          {news.content.split('\n').map((para, i) => (
            para.trim() ? <p key={i}>{para}</p> : null
          ))}
        </div>
        <Link to="/news" className="button button--secondary" style={{ marginTop: '24px' }}>
          ← Kembali ke Daftar Berita
        </Link>
      </article>
    </>
  )
}
