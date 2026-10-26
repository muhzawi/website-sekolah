import { Link } from 'react-router-dom'
import { logoImage } from '../data/schoolData.js'

const quickLinks = [
  { title: 'Profil sekolah', to: '/profil' },
  { title: 'Program keahlian', to: '/program' },
  { title: 'Berita & pengumuman', to: '/news' },
  { title: 'PPDB', to: '/ppdb' },
]

export default function Footer() {
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
          {quickLinks.map(({ title, to }) => (
            <Link key={to} to={to}>{title}</Link>
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
