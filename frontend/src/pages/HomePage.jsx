import ImageSlider from '../components/ImageSlider.jsx'
import NewsCard from '../components/NewsCard.jsx'
import ProgramIcon from '../components/ProgramIcon.jsx'
import { heroSlides, newsItems, programs } from '../data/schoolData.js'

function HomePage({ onNavigate }) {
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
            <a
              className="button"
              href="?page=profile"
              onClick={(event) => onNavigate(event, 'profile')}
            >
              Lihat Profil Sekolah
            </a>
            <a
              className="button button--secondary"
              href="?page=programs"
              onClick={(event) => onNavigate(event, 'programs')}
            >
              Lihat Program Keahlian
            </a>
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
          <strong>PPDB 2024/2025</strong>
          <p>12 Jan - 28 Feb 2024</p>
        </article>
      </section>

      <section className="section-block home-programs">
        <div className="section-heading">
          <h2>Program Unggulan</h2>
          <a
            className="text-link"
            href="?page=programs"
            onClick={(event) => onNavigate(event, 'programs')}
          >
            Lihat semua program
          </a>
        </div>
        <div className="highlight-grid">
          {programs.map((program) => (
            <a
              className="highlight-card surface"
              href="?page=programs"
              key={program.title}
              onClick={(event) => onNavigate(event, 'programs')}
            >
              <span className="highlight-icon">
                <ProgramIcon name={program.icon} />
              </span>
              <h3>{program.shortTitle}</h3>
              <p>{program.summary}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="section-block home-news">
        <div className="section-heading">
          <h2>Berita Terbaru</h2>
          <a
            className="text-link"
            href="?page=news"
            onClick={(event) => onNavigate(event, 'news')}
          >
            Lihat semua berita
          </a>
        </div>
        <div className="home-news-grid">
          {newsItems.slice(0, 3).map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </>
  )
}

export default HomePage
