import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ImageSlider from '../components/ImageSlider.jsx'
import NewsCard from '../components/NewsCard.jsx'
import ProgramIcon from '../components/ProgramIcon.jsx'
import { heroSlides, programs } from '../data/schoolData.js'
import api from '../services/api.js'
import { EmptyState, ErrorState, NewsGridSkeleton } from '../components/Feedback.jsx'
import { usePpdbPeriod } from '../hooks/usePpdbPeriod.js'

export default function HomePage() {
  const [news, setNews] = useState([])
  const [newsLoading, setNewsLoading] = useState(true)
  const [newsError, setNewsError] = useState('')
  const [retryKey, setRetryKey] = useState(0)
  const { period, error: periodError, refetch: refetchPeriod } = usePpdbPeriod()

  useEffect(() => {
    api.get('/news', { params: { page: 1, limit: 3, sortBy: 'published_at', sortOrder: 'desc' } })
      .then(res => setNews(res.data.data || []))
      .catch(err => setNewsError(err.message))
      .finally(() => setNewsLoading(false))
  }, [retryKey])

  function retryNews() {
    setNewsLoading(true)
    setNewsError('')
    setRetryKey(key => key + 1)
  }

  return (
    <>
      <section className="home-hero surface">
        <div className="home-hero-copy">
          <span className="tag">Website Resmi</span>
          <h1>SMK Negeri 1 Nusantara</h1>
          <p>
            Menjadi sekolah vokasi unggulan yang menghasilkan lulusan siap
            kerja dan berdaya saing tinggi di era digital.
          </p>
          <div className="hero-actions">
            <Link className="button" to="/profil">Lihat Profil Sekolah</Link>
            <Link className="button button--secondary" to="/program">Lihat Program Keahlian</Link>
          </div>
        </div>
        <div className="home-hero-visual">
          <ImageSlider slides={heroSlides} label="Galeri kegiatan sekolah" />
        </div>
      </section>

      <section className="home-stats" aria-label="Informasi sekolah">
        <article className="stat-card surface">
          <span>Program Keahlian</span>
          <strong>4</strong>
          <p>Jurusan unggulan yang siap kerja</p>
        </article>
        <article className="stat-card surface">
          <span>Pendaftaran Aktif</span>
          <strong>{period ? `PPDB ${period.academic_year}` : 'PPDB'}</strong>
          <p>{periodError ? 'Jadwal pendaftaran belum dapat dimuat.' : period ? 'Daftar melalui akun peserta.' : 'Pantau informasi pendaftaran terbaru.'}</p>
        </article>
      </section>
      {periodError && <ErrorState message={periodError} onRetry={refetchPeriod} />}

      <section className="section-block home-programs">
        <div className="section-heading">
          <h2>Program Unggulan</h2>
          <Link className="text-link" to="/program">Lihat semua program</Link>
        </div>
        <div className="highlight-grid">
          {programs.map((program) => (
            <Link className="highlight-card surface" to="/program" key={program.title}>
              <span className="highlight-icon">
                <ProgramIcon name={program.icon} />
              </span>
              <h3>{program.shortTitle}</h3>
              <p>{program.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-block home-news">
        <div className="section-heading">
          <h2>Berita Terbaru</h2>
          <Link className="text-link" to="/news">Lihat semua berita</Link>
        </div>
        {newsLoading ? <NewsGridSkeleton count={3} /> : newsError ? (
          <ErrorState message={newsError} onRetry={retryNews} />
        ) : news.length > 0 ? (
          <div className="home-news-grid">
            {news.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState title="Belum ada berita" description="Berita terbaru akan tampil di sini." />
        )}
      </section>
    </>
  )
}
