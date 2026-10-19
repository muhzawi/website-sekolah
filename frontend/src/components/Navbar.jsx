import { useEffect, useState } from 'react'
import { logoImage } from '../data/schoolData.js'

const links = [
  { label: 'Beranda', page: 'home' },
  { label: 'Profil', page: 'profile' },
  { label: 'Program Keahlian', page: 'programs' },
  { label: 'Berita', page: 'news' },
  { label: 'Kontak', page: 'contact' },
  { label: 'PPDB', page: 'ppdb' },
]

function Navbar({ activePage, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const activeSection =
    activePage === 'registration' || activePage === 'faq' ? 'ppdb' : activePage

  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    function closeOnDesktop() {
      if (window.matchMedia('(min-width: 901px)').matches) setMenuOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    window.addEventListener('resize', closeOnDesktop)
    return () => {
      window.removeEventListener('keydown', closeOnEscape)
      window.removeEventListener('resize', closeOnDesktop)
    }
  }, [])

  function handleNavigation(event, page) {
    onNavigate(event, page)
    if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey) {
      setMenuOpen(false)
    }
  }

  function renderLinks(className) {
    return (
      <div className={className}>
        {links.map(({ label, page }) => (
          <a
            key={page}
            href={`?page=${page}`}
            className={activeSection === page ? 'nav-link is-active' : 'nav-link'}
            aria-current={activeSection === page ? 'page' : undefined}
            onClick={(event) => handleNavigation(event, page)}
          >
            {label}
          </a>
        ))}
      </div>
    )
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <a
          href="?page=home"
          className="brand"
          aria-label="SMK Negeri 1 Nusantara — Beranda"
          onClick={(event) => handleNavigation(event, 'home')}
        >
          <img src={logoImage} alt="" />
          <span>SMK Negeri 1 Nusantara</span>
        </a>

        {renderLinks('desktop-navigation')}

        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      <nav
        className={menuOpen ? 'mobile-navigation is-open' : 'mobile-navigation'}
        id="mobile-navigation"
        aria-label="Navigasi utama mobile"
        hidden={!menuOpen}
      >
        {renderLinks('mobile-navigation-links')}
      </nav>
    </header>
  )
}

export default Navbar
