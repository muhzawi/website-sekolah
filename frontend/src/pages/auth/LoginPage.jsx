import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { logoImage } from '../../data/schoolData.js'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || null

  const [email, setEmail] = useState(location.state?.email || '')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resetMode, setResetMode] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetSent, setResetSent] = useState(false)

  const { sendPasswordReset } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const profile = await login(email, password)
      if (from) {
        navigate(from, { replace: true })
      } else if (profile.role === 'admin') {
        navigate('/admin/dashboard', { replace: true })
      } else {
        navigate('/peserta/dashboard', { replace: true })
      }
    } catch (err) {
      setError(
        err.message?.toLowerCase().includes('invalid login credentials')
          ? 'Email atau password salah.'
          : err.message || 'Email atau password salah.'
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleReset(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await sendPasswordReset(resetEmail)
      setResetSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card surface content-card">
        <Link to="/" className="auth-brand">
          <img src={logoImage} alt="" />
          <span>SMK Negeri 1 Nusantara</span>
        </Link>

        {!resetMode ? (
          <>
            <h1 className="auth-title">Masuk ke Akun</h1>
            <p className="auth-sub">Masuk untuk mengakses dashboard PPDB.</p>

            {location.state?.registrationSuccess && (
              <p className="alert alert--success" role="status">
                Akun berhasil didaftarkan. Silakan masuk.
              </p>
            )}

            {error && <p className="alert alert--error" role="alert">{error}</p>}

            <form onSubmit={handleSubmit} className="auth-form">
              <label className="form-field">
                <span>Email</span>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Masukkan email Anda"
                />
              </label>

              <label className="form-field">
                <span>Password</span>
                <div className="input-with-toggle">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                    onClick={() => setShowPassword(v => !v)}
                  >
                    {showPassword ? '🙈' : '👁'}
                  </button>
                </div>
              </label>

              <button
                type="submit"
                className="button auth-submit"
                disabled={loading}
              >
                {loading ? 'Memproses…' : 'Masuk'}
              </button>
            </form>

            <div className="auth-footer">
              <button
                type="button"
                className="link-button"
                onClick={() => { setResetMode(true); setError('') }}
              >
                Lupa password?
              </button>
              <span>
                Belum punya akun?{' '}
                <Link to="/register">Daftar sekarang</Link>
              </span>
            </div>
          </>
        ) : (
          <>
            <h1 className="auth-title">Pemulihan Password</h1>
            <p className="auth-sub">Masukkan email Anda untuk menerima tautan pemulihan password.</p>

            {error && <p className="alert alert--error" role="alert">{error}</p>}
            {resetSent && (
              <p className="alert alert--success" role="status">
                Email pemulihan telah dikirim. Periksa kotak masuk Anda.
              </p>
            )}

            {!resetSent && (
              <form onSubmit={handleReset} className="auth-form">
                <label className="form-field">
                  <span>Email</span>
                  <input
                    id="reset-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                    placeholder="Masukkan email Anda"
                  />
                </label>
                <button type="submit" className="button auth-submit" disabled={loading}>
                  {loading ? 'Mengirim…' : 'Kirim Email Pemulihan'}
                </button>
              </form>
            )}

            <button
              type="button"
              className="link-button"
              style={{ marginTop: '16px' }}
              onClick={() => { setResetMode(false); setError(''); setResetSent(false) }}
            >
              ← Kembali ke login
            </button>
          </>
        )}
      </div>
    </div>
  )
}
