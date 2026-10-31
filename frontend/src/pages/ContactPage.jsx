import { useState } from 'react'
import PageHeading from '../components/PageHeading.jsx'
import mapImage from '../assets/peta.png'
import api from '../services/api.js'

export default function ContactPage() {
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  async function submitMessage(event) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    setMessage('')
    setIsSending(true)
    try {
      await api.post('/contact/message', {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
      })
      setMessage('Email berhasil dikirim. Terima kasih telah menghubungi kami.')
      form.reset()
    } catch (error) {
      setMessage(error.message || 'Email gagal dikirim. Silakan coba lagi nanti.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <>
      <PageHeading
        breadcrumbs={['Beranda', 'Kontak']}
        title="Kontak &amp; Lokasi"
        description="Hubungi kami untuk informasi pendaftaran, program keahlian, atau pertanyaan lainnya terkait SMK Negeri 1 Nusantara."
        size="large"
      />
      <div className="contact-layout">
        <section className="surface content-card contact-form-card">
          <h2>Formulir Kontak</h2>
          <p className="form-intro">
            Isi formulir di bawah ini untuk mengirimkan pertanyaan atau
            permintaan informasi ke sekolah.
          </p>
          <form onSubmit={submitMessage}>
            <label className="form-field">
              <span>Nama Lengkap</span>
              <input name="name" autoComplete="name" placeholder="Masukkan nama lengkap Anda" required />
            </label>
            <label className="form-field">
              <span>Email</span>
              <input type="email" name="email" autoComplete="email" placeholder="Masukkan alamat email Anda" required />
            </label>
            <label className="form-field">
              <span>Subjek</span>
              <input name="subject" placeholder="Pilih topik pertanyaan" required />
            </label>
            <label className="form-field">
              <span>Pesan</span>
              <textarea name="message" placeholder="Tuliskan pesan Anda" rows="5" required />
            </label>
            <button className="button" type="submit" disabled={isSending}>
              {isSending ? 'Mengirim…' : 'Kirim Pesan'}
            </button>
          </form>
          <p className="status-message" role="status" aria-live="polite">{message}</p>
        </section>

        <aside className="surface content-card contact-details">
          <h2>Informasi Kontak</h2>
          <dl>
            <div>
              <dt>Alamat</dt>
              <dd>Jl. Pendidikan No. 1, Nusantara Baru, Indonesia</dd>
            </div>
            <div>
              <dt>Telepon</dt>
              <dd><a href="tel:+62215550123">(021) 555-0123</a></dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd><a href="mailto:zakisecond12@gmail.com">zakisecond12@gmail.com</a></dd>
            </div>
          </dl>
          <h2 className="map-heading">Peta Lokasi</h2>
          <img className="location-map" src={mapImage} alt="Peta ilustrasi lokasi SMK Negeri 1 Nusantara" />
        </aside>
      </div>
    </>
  )
}
