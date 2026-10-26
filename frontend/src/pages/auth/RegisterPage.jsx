import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { logoImage } from '../../data/schoolData.js'

function PasswordStrength({ password }) {
  const strength = (() => {
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return score
  })()

  const labels = ['', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat']
  const colors = ['', '#ef4444', '#f59e0b', '#3b82f6', '#22c55e']

  if (!password) return null
  return (
    <div className="password-strength">
      <div className="strength-bars">
        {[1, 2, 3, 4].map(i => (
          <span
            key={i}
            className="strength-bar"
            style={{ background: i <= strength ? colors[strength] : '#e2e8f0' }}
          />
        ))}
      </div>
      <span style={{ color: colors[strength], fontSize: '11px' }}>{labels[strength]}</span>
    </div>
  )
}

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  function updateField(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.fullName.trim()) return setError('Nama lengkap wajib diisi.')
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Format email tidak valid.')
    if (!form.phone.trim()) return setError('Nomor telepon wajib diisi.')
    if (!/^\+?[0-9\s\-()]{8,20}$/.test(form.phone)) {
      return setError('Format nomor telepon tidak valid.')
    }
    if (form.password.length < 8) return setError('Password minimal 8 karakter.')
    if (form.password !== form.confirmPassword) return setError('Konfirmasi password tidak cocok.')

    setLoading(true)
    try {
      const data = await register(form.fullName, form.email, form.phone, form.password)
      setSuccess(true)
      if (data.session) {
        setTimeout(() => navigate('/peserta/dashboard', { replace: true }), 1500)
      }
    } catch (err) {
      if (err.message?.includes('already registered')) {
        setError('Email ini sudah terdaftar. Silakan masuk.')
      } else {
        setError(err.message || 'Registrasi gagal. Coba lagi.')
      }
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

        <h1 className="auth-title">Daftar Akun Peserta</h1>
        <p className="auth-sub">Buat akun untuk mengakses formulir PPDB online.</p>

        {error && <p className="alert alert--error" role="alert">{error}</p>}
        {success && (
          <p className="alert alert--success" role="status">
            Akun berhasil dibuat! {form.email ? 'Jika verifikasi email aktif, periksa kotak masuk Anda. ' : ''}Anda dapat masuk setelah akun siap.
          </p>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="auth-form">
            <label className="form-field">
              <span>Nama Lengkap</span>
              <input
                id="reg-fullname"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                value={form.fullName}
                onChange={updateField}
                placeholder="Masukkan nama lengkap"
              />
            </label>

            <label className="form-field">
              <span>Email</span>
              <input
                id="reg-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={updateField}
                placeholder="Masukkan email"
              />
            </label>

            <label className="form-field">
              <span>Nomor Telepon</span>
              <input
                id="reg-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={updateField}
                required
                placeholder="Contoh: 0812 3456 7890"
              />
            </label>

            <label className="form-field">
              <span>Password</span>
              <div className="input-with-toggle">
                <input
                  id="reg-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={form.password}
                  onChange={updateField}
                  placeholder="Minimal 8 karakter"
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
              <PasswordStrength password={form.password} />
            </label>

            <label className="form-field">
              <span>Konfirmasi Password</span>
              <input
                id="reg-confirm"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={form.confirmPassword}
                onChange={updateField}
                placeholder="Ulangi password"
              />
            </label>

            <p className="form-note">
              Dengan mendaftar, Anda menyetujui penggunaan data untuk keperluan proses PPDB.
            </p>

            <button type="submit" className="button auth-submit" disabled={loading}>
              {loading ? 'Mendaftar…' : 'Buat Akun'}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <span>
            Sudah punya akun?{' '}
            <Link to="/login">Masuk sekarang</Link>
          </span>
        </div>
      </div>
    </div>
  )
}
