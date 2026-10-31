import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import { logoImage } from '../data/schoolData.js'

const adminNavLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '⊞' },
  { to: '/admin/ppdb', label: 'Data Pendaftar', icon: '📋' },
  { to: '/admin/news', label: 'Kelola Berita', icon: '📰' },
]

const pesertaNavLinks = [
  { to: '/peserta/dashboard', label: 'Dashboard', icon: '⊞' },
  { to: '/peserta/ppdb', label: 'Formulir PPDB', icon: '📝' },
  { to: '/peserta/status', label: 'Status Pendaftaran', icon: '📋' },
  { to: '/peserta/profil', label: 'Profil Akun', icon: '👤' },
]

export function DashboardLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navLinks = user?.role === 'admin' ? adminNavLinks : pesertaNavLinks

  async function handleLogout() {
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="dashboard-shell">
      {/* Sidebar */}
      <aside className={`dashboard-sidebar${sidebarOpen ? ' is-open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-brand">
            <img src={logoImage} alt="" />
            <span>SMK N 1 Nusantara</span>
          </Link>
          <button
            type="button"
            className="sidebar-close"
            aria-label="Tutup sidebar"
            onClick={() => setSidebarOpen(false)}
          >×</button>
        </div>

        <div className="sidebar-role-badge">
          {user?.role === 'admin' ? '🛡 Admin' : '🎓 Peserta'}
        </div>

        <nav className="sidebar-nav" aria-label="Navigasi dashboard">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              className={({ isActive }) =>
                `sidebar-link${isActive ? ' is-active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sidebar-icon" aria-hidden="true">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <span className="sidebar-user-name">{user?.fullName || user?.email}</span>
            <span className="sidebar-user-email">{user?.email}</span>
          </div>
          <button type="button" className="button button--secondary sidebar-logout" onClick={handleLogout}>
            Keluar
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          role="presentation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <button
            type="button"
            className="topbar-menu-toggle"
            aria-label="Buka sidebar"
            onClick={() => setSidebarOpen(true)}
          >
            <span /><span /><span />
          </button>
          <div className="topbar-right">
            <Link to="/" className="button button--secondary topbar-home-btn">
              Beranda 
            </Link>
          </div>
        </header>

        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  )
}
