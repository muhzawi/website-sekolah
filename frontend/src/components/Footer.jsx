import { logoImage } from '../data/schoolData.js'

const quickLinks = [
  { title: 'Profil sekolah', page: 'profile' },
  { title: 'Program keahlian', page: 'programs' },
  { title: 'Berita & pengumuman', page: 'news' },
  { title: 'PPDB', page: 'ppdb' },
]

function Footer({ onNavigate }) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-about">
          <div className="footer-brand">
            <img src={logoImage} alt="" />
            <strong>SMK Negeri 1 Nusantara</strong>
          </div>
          <p>
            Sekolah vokasi yang menyiapkan generasi terampil, berkarakter, dan
            siap menghadapi dunia kerja.
          </p>
        </div>
        <div className="footer-links">
          <h2>Tautan</h2>
          {quickLinks.map(({ title, page }) => (
            <a
              key={page}
              href={`?page=${page}`}
              onClick={(event) => onNavigate(event, page)}
            >
              {title}
            </a>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} SMK Negeri 1 Nusantara</span>
        <span>Informasi sekolah dan layanan peserta didik</span>
      </div>
    </footer>
  )
}

export default Footer
