import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import { logoImage } from '../data/schoolData.js'

const links = [
  { label: 'Beranda', to: '/' },
  { label: 'Profil', to: '/profil' },
  { label: 'Program Keahlian', to: '/program' },
  { label: 'Berita', to: '/news' },
  { label: 'Kontak', to: '/kontak' },
  { label: 'PPDB', to: '/ppdb' },
]

export default function Navbar() {
  const { user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    function closeOnEscape(e) { if (e.key === 'Escape') setMenuOpen(false) }
    function closeOnDesktop() { if (window.matchMedia('(min-width: 901px)').matches) setMenuOpen(false) }
    window.addEventListener('keydown', closeOnEscape)
    window.addEventListener('resize', closeOnDesktop)
    return () => {
      window.removeEventListener('keydown', closeOnEscape)
      window.removeEventListener('resize', closeOnDesktop)
    }
  }, [])

  function renderLinks(className) {
    return (
      <div className={className}>
        {links.map(({ label, to }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => isActive ? 'nav-link is-active' : 'nav-link'}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </NavLink>
        ))}
      </div>
    )
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand" aria-label="SMK Negeri 1 Nusantara — Beranda">
          <img src={logoImage} alt="" />
          <span>SMK Negeri 1 Nusantara</span>
        </Link>

        {renderLinks('desktop-navigation')}

        <div className="navbar-auth">
          {user ? (
            <Link
              to={user.role === 'admin' ? '/admin/dashboard' : '/peserta/dashboard'}
              className="button"
              style={{ minHeight: '38px', fontSize: '13px', padding: '0 14px' }}
            >
              {user.role === 'admin' ? '🛡 Dashboard Admin' : '🎓 Dashboard'}
            </Link>
          ) : (
            <Link
              to="/login"
              className="button"
              style={{ minHeight: '38px', fontSize: '13px', padding: '0 14px' }}
            >
              Masuk / Daftar
            </Link>
          )}
        </div>

        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen(o => !o)}
        >
          <span /><span /><span />
        </button>
      </div>

      <nav
        className={menuOpen ? 'mobile-navigation is-open' : 'mobile-navigation'}
        id="mobile-nav"
        aria-label="Navigasi utama mobile"
        hidden={!menuOpen}
      >
        {renderLinks('mobile-navigation-links')}
        <div className="mobile-auth">
          {user ? (
            <Link
              to={user.role === 'admin' ? '/admin/dashboard' : '/peserta/dashboard'}
              className="button"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
          ) : (
            <Link to="/login" className="button" onClick={() => setMenuOpen(false)}>
              Masuk / Daftar
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
