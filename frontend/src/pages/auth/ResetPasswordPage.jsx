import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase.js'
import { logoImage } from '../../data/schoolData.js'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password.length < 8) return setError('Password minimal 8 karakter.')
    if (password !== confirmPassword) return setError('Konfirmasi password tidak cocok.')

    setLoading(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) throw new Error(updateError.message)
      setSuccess(true)
      setTimeout(() => navigate('/login', { replace: true }), 1800)
    } catch (err) {
      setError(err.message || 'Gagal memperbarui password. Buka ulang tautan dari email.')
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

        <h1 className="auth-title">Atur Password Baru</h1>
        <p className="auth-sub">Masukkan password baru untuk akun Anda.</p>

        {error && <p className="alert alert--error" role="alert">{error}</p>}
        {success && (
          <p className="alert alert--success" role="status">
            Password berhasil diperbarui. Mengarahkan ke halaman masuk…
          </p>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="auth-form">
            <label className="form-field">
              <span>Password Baru</span>
              <div className="input-with-toggle">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
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
            </label>
            <label className="form-field">
              <span>Konfirmasi Password</span>
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </label>
            <button type="submit" className="button auth-submit" disabled={loading}>
              {loading ? 'Menyimpan…' : 'Simpan Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
