import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { ToastProvider } from './contexts/ToastProvider.jsx'
import { ProtectedRoute, PublicOnlyRoute } from './routes/ProtectedRoute.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import { DashboardLayout } from './layouts/DashboardLayout.jsx'

// Public pages
import HomePage from './pages/HomePage.jsx'
import { ProfilePage, ProgramsPage } from './pages/SchoolInfoPages.jsx'
import { PpdbPage, FaqPage } from './pages/AdmissionsPages.jsx'
import ContactPage from './pages/ContactPage.jsx'
import NewsListPage from './pages/news/NewsListPage.jsx'
import NewsDetailPage from './pages/news/NewsDetailPage.jsx'

// Auth pages
import LoginPage from './pages/auth/LoginPage.jsx'
import RegisterPage from './pages/auth/RegisterPage.jsx'
import ResetPasswordPage from './pages/auth/ResetPasswordPage.jsx'

// Admin pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx'
import AdminPpdbPage from './pages/admin/AdminPpdbPage.jsx'
import AdminPpdbDetailPage from './pages/admin/AdminPpdbDetailPage.jsx'
import AdminNewsPage from './pages/admin/AdminNewsPage.jsx'
import AdminNewsFormPage from './pages/admin/AdminNewsFormPage.jsx'

// Peserta pages
import PesertaDashboardPage from './pages/peserta/PesertaDashboardPage.jsx'
import PesertaPpdbPage from './pages/peserta/PesertaPpdbPage.jsx'
import PesertaStatusPage from './pages/peserta/PesertaStatusPage.jsx'
import PesertaProfilPage from './pages/peserta/PesertaProfilPage.jsx'

import './App.css'
import './pages/SchoolPages.css'
import './pages/dashboard.css'
import './components/feedback.css'

/** Layout wrapper for public-facing pages (Navbar + Footer) */
function PublicLayout({ children }) {
  return (
    <div className="site-shell">
      <Navbar />
      <main className="page-container">{children}</main>
      <Footer />
    </div>
  )
}

/** 404 page */
function NotFound() {
  return (
    <PublicLayout>
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <h1 style={{ fontSize: '80px', margin: '0', color: 'var(--blue)' }}>404</h1>
        <p style={{ color: 'var(--body-text)', fontSize: '18px' }}>Halaman tidak ditemukan.</p>
        <a href="/" className="button" style={{ marginTop: '24px' }}>Kembali ke Beranda</a>
      </div>
    </PublicLayout>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* ── PUBLIC ROUTES ────────────────────────────────── */}
            <Route path="/" element={
              <PublicLayout><HomePage /></PublicLayout>
            } />
            <Route path="/profil" element={
              <PublicLayout><ProfilePage /></PublicLayout>
            } />
            <Route path="/program" element={
              <PublicLayout><ProgramsPage /></PublicLayout>
            } />
            <Route path="/kontak" element={
              <PublicLayout><ContactPage /></PublicLayout>
            } />
            <Route path="/ppdb" element={
              <PublicLayout><PpdbPage /></PublicLayout>
            } />
            <Route path="/ppdb/faq" element={
              <PublicLayout><FaqPage /></PublicLayout>
            } />
            <Route path="/news" element={
              <PublicLayout><NewsListPage /></PublicLayout>
            } />
            <Route path="/news/:slug" element={
              <PublicLayout><NewsDetailPage /></PublicLayout>
            } />

            {/* ── AUTH ROUTES (public-only) ────────────────────── */}
            <Route path="/login" element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            } />
            <Route path="/register" element={
              <PublicOnlyRoute>
                <RegisterPage />
              </PublicOnlyRoute>
            } />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* ── ADMIN ROUTES ─────────────────────────────────── */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute role="admin">
                <DashboardLayout><AdminDashboardPage /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/ppdb" element={
              <ProtectedRoute role="admin">
                <DashboardLayout><AdminPpdbPage /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/ppdb/:id" element={
              <ProtectedRoute role="admin">
                <DashboardLayout><AdminPpdbDetailPage /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/news" element={
              <ProtectedRoute role="admin">
                <DashboardLayout><AdminNewsPage /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/news/create" element={
              <ProtectedRoute role="admin">
                <DashboardLayout><AdminNewsFormPage /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/news/:id/edit" element={
              <ProtectedRoute role="admin">
                <DashboardLayout><AdminNewsFormPage /></DashboardLayout>
              </ProtectedRoute>
            } />

            {/* ── PESERTA ROUTES ───────────────────────────────── */}
            <Route path="/peserta/dashboard" element={
              <ProtectedRoute role="peserta">
                <DashboardLayout><PesertaDashboardPage /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/peserta/ppdb" element={
              <ProtectedRoute role="peserta">
                <DashboardLayout><PesertaPpdbPage /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/peserta/status" element={
              <ProtectedRoute role="peserta">
                <DashboardLayout><PesertaStatusPage /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/peserta/profil" element={
              <ProtectedRoute role="peserta">
                <DashboardLayout><PesertaProfilPage /></DashboardLayout>
              </ProtectedRoute>
            } />

            {/* ── 404 ─────────────────────────────────────────── */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}
