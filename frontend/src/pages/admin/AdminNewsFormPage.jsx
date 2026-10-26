import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api.js'
import { newsImageUrl } from '../../utils/media.js'
import { ErrorState, Spinner } from '../../components/Feedback.jsx'
import { useToast } from '../../contexts/useToast.js'

export default function AdminNewsFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const isEdit = Boolean(id)
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    cover_image_path: '',
    status: 'draft',
  })
  const [coverPreview, setCoverPreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEdit)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    if (!isEdit) return
    api.get(`/admin/news/${id}`)
      .then(res => {
        const d = res.data
        setForm({
          title: d.title || '',
          excerpt: d.excerpt || '',
          content: d.content || '',
          cover_image_path: d.cover_image_path || '',
          status: d.status || 'draft',
        })
        if (d.cover_image_path) {
          setCoverPreview(newsImageUrl(d.cover_image_path))
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id, isEdit, retryKey])

  function retryLoad() {
    setLoading(true)
    setError('')
    setRetryKey(key => key + 1)
  }

  function updateField(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('image', file)
      const { data } = await api.post('/admin/news/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setForm(prev => ({ ...prev, cover_image_path: data.path }))
      setCoverPreview(data.url)
    } catch (err) {
      setError(err.message)
      toast(err.message, { type: 'error' })
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) return setError('Judul berita wajib diisi.')
    setSaving(true)
    setError('')
    try {
      if (isEdit) {
        await api.patch(`/admin/news/${id}`, form)
      } else {
        await api.post('/admin/news', form)
      }
      setSuccess(isEdit ? 'Berita berhasil diperbarui.' : 'Berita berhasil disimpan.')
      toast(isEdit ? 'Berita berhasil diperbarui.' : 'Berita berhasil disimpan.')
      setTimeout(() => navigate('/admin/news'), 1200)
    } catch (err) {
      setError(err.message)
      toast(err.message, { type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="page-loading"><Spinner label="Memuat berita" /></div>
  if (isEdit && error) return <ErrorState message={error} onRetry={retryLoad} />

  return (
    <div className="news-form-page">
      <div className="page-heading">
        <h1>{isEdit ? 'Edit Berita' : 'Tulis Berita Baru'}</h1>
      </div>

      {error && <p className="alert alert--error">{error}</p>}
      {success && <p className="alert alert--success">{success}</p>}

      <form onSubmit={handleSubmit} className="news-form-layout">
        <div className="news-form-main surface content-card">
          <label className="form-field">
            <span>Judul Berita *</span>
            <input
              name="title"
              type="text"
              value={form.title}
              onChange={updateField}
              required
              placeholder="Masukkan judul berita"
            />
          </label>

          <label className="form-field">
            <span>Ringkasan (Excerpt)</span>
            <textarea
              name="excerpt"
              value={form.excerpt}
              onChange={updateField}
              rows="3"
              placeholder="Ringkasan singkat yang ditampilkan di daftar berita"
            />
          </label>

          <label className="form-field">
            <span>Isi Berita</span>
            <textarea
              name="content"
              value={form.content}
              onChange={updateField}
              rows="14"
              placeholder="Tulis isi berita di sini…"
              className="content-textarea"
            />
          </label>
        </div>

        <aside className="news-form-aside">
          <div className="surface content-card">
            <h3>Publikasi</h3>
            <label className="form-field">
              <span>Status</span>
              <select name="status" value={form.status} onChange={updateField}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>
            <div className="form-actions-vertical">
              <button type="submit" className="button" disabled={saving}>
                {saving ? 'Menyimpan…' : isEdit ? 'Perbarui Berita' : 'Simpan Berita'}
              </button>
              <button type="button" className="button button--secondary" onClick={() => navigate('/admin/news')}>
                Batal
              </button>
            </div>
          </div>

          <div className="surface content-card">
            <h3>Gambar Sampul</h3>
            {coverPreview && (
              <img src={coverPreview} alt="Preview gambar sampul" className="cover-preview" />
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
            <button
              type="button"
              className="button button--secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? 'Mengunggah…' : coverPreview ? 'Ganti Gambar' : 'Unggah Gambar'}
            </button>
            <p className="form-note">Format: JPEG, PNG, WebP, GIF. Maks 5 MB.</p>
          </div>
        </aside>
      </form>
    </div>
  )
}
