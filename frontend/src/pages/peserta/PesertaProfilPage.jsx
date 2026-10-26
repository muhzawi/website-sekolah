import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { supabase } from '../../lib/supabase.js'
import api from '../../services/api.js'
import { useToast } from '../../contexts/useToast.js'

export default function PesertaProfilPage() {
  const toast = useToast()
  const { user, refetchProfile, logout } = useAuth()
  const [form, setForm] = useState({ full_name: user?.fullName || '', phone: user?.phone || '' })
  const [pwForm, setPwForm] = useState({ newPassword: '', confirmPassword: '' })
  const [showPw, setShowPw] = useState(false)

  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPw, setSavingPw] = useState(false)
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' })
  const [pwMsg, setPwMsg] = useState({ type: '', text: '' })

  async function handleProfileSave(e) {
    e.preventDefault()
    if (!form.full_name.trim()) return setProfileMsg({ type: 'error', text: 'Nama lengkap wajib diisi.' })
    setSavingProfile(true)
    setProfileMsg({ type: '', text: '' })
    try {
      await api.patch('/profile', { full_name: form.full_name, phone: form.phone })
      await refetchProfile()
      setProfileMsg({ type: 'success', text: 'Profil berhasil diperbarui.' })
      toast('Profil berhasil diperbarui.')
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.message })
      toast(err.message, { type: 'error' })
    } finally {
      setSavingProfile(false)
    }
  }

  async function handlePwSave(e) {
    e.preventDefault()
    if (pwForm.newPassword.length < 8) return setPwMsg({ type: 'error', text: 'Password minimal 8 karakter.' })
    if (pwForm.newPassword !== pwForm.confirmPassword) return setPwMsg({ type: 'error', text: 'Konfirmasi password tidak cocok.' })
    setSavingPw(true)
    setPwMsg({ type: '', text: '' })
    try {
      const { error } = await supabase.auth.updateUser({ password: pwForm.newPassword })
      if (error) throw new Error(error.message)
      setPwMsg({ type: 'success', text: 'Password berhasil diubah.' })
      setPwForm({ newPassword: '', confirmPassword: '' })
      toast('Password berhasil diubah.')
    } catch (err) {
      setPwMsg({ type: 'error', text: err.message })
      toast(err.message, { type: 'error' })
    } finally {
      setSavingPw(false)
    }
  }

  return (
    <div className="peserta-profil-page">
      <div className="page-heading">
        <h1>Profil Akun</h1>
      </div>

      {/* Profile info */}
      <div className="surface content-card profil-card">
        <h2>Informasi Akun</h2>
        <div className="form-field email-readonly">
          <span>Email</span>
          <p className="readonly-value">{user?.email}</p>
          <small>Email tidak dapat diubah.</small>
        </div>

        {profileMsg.text && (
          <p className={`alert alert--${profileMsg.type}`} role={profileMsg.type === 'error' ? 'alert' : 'status'}>
            {profileMsg.text}
          </p>
        )}

        <form onSubmit={handleProfileSave} className="auth-form">
          <label className="form-field">
            <span>Nama Lengkap</span>
            <input
              type="text"
              autoComplete="name"
              value={form.full_name}
              onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))}
              required
            />
          </label>
          <label className="form-field">
            <span>Nomor Telepon</span>
            <input
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
            />
          </label>
          <button type="submit" className="button" disabled={savingProfile}>
            {savingProfile ? 'Menyimpan…' : 'Simpan Profil'}
          </button>
        </form>
      </div>

      {/* Change password */}
      <div className="surface content-card profil-card">
        <h2>Ubah Password</h2>

        {pwMsg.text && (
          <p className={`alert alert--${pwMsg.type}`} role={pwMsg.type === 'error' ? 'alert' : 'status'}>
            {pwMsg.text}
          </p>
        )}

        <form onSubmit={handlePwSave} className="auth-form">
          <label className="form-field">
            <span>Password Baru</span>
            <div className="input-with-toggle">
              <input
                type={showPw ? 'text' : 'password'}
                autoComplete="new-password"
                value={pwForm.newPassword}
                onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))}
                placeholder="Minimal 8 karakter"
                required
              />
              <button type="button" className="toggle-password" onClick={() => setShowPw(v => !v)}
                aria-label={showPw ? 'Sembunyikan' : 'Tampilkan'}>
                {showPw ? '🙈' : '👁'}
              </button>
            </div>
          </label>
          <label className="form-field">
            <span>Konfirmasi Password Baru</span>
            <input
              type={showPw ? 'text' : 'password'}
              autoComplete="new-password"
              value={pwForm.confirmPassword}
              onChange={e => setPwForm(p => ({ ...p, confirmPassword: e.target.value }))}
              required
            />
          </label>
          <button type="submit" className="button" disabled={savingPw}>
            {savingPw ? 'Menyimpan…' : 'Ubah Password'}
          </button>
        </form>
      </div>

      {/* Logout */}
      <div className="surface content-card profil-card">
        <h2>Keluar dari Akun</h2>
        <p className="muted-copy">Anda akan keluar dari semua sesi aktif.</p>
        <button type="button" className="button button--secondary" onClick={logout}>
          Keluar
        </button>
      </div>
    </div>
  )
}
