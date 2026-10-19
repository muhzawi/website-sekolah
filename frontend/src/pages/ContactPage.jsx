import { useState } from 'react'
import PageHeading from '../components/PageHeading.jsx'
import mapImage from '../assets/peta.png'

function ContactPage() {
  const [message, setMessage] = useState('')

  function submitMessage(event) {
    event.preventDefault()
    setMessage(
      'Pesan Anda sudah divalidasi. Pengiriman ke sekolah belum tersedia karena situs ini belum terhubung ke layanan backend.',
    )
  }

  return (
    <>
      <PageHeading
        breadcrumbs={['Beranda', 'Kontak']}
        title="Kontak & Lokasi"
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
              <input
                name="name"
                autoComplete="name"
                placeholder="Masukkan nama lengkap Anda"
                required
              />
            </label>
            <label className="form-field">
              <span>Email</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Masukkan alamat email Anda"
                required
              />
            </label>
            <label className="form-field">
              <span>Subjek</span>
              <input
                name="subject"
                placeholder="Pilih topik pertanyaan"
                required
              />
            </label>
            <label className="form-field">
              <span>Pesan</span>
              <textarea
                name="message"
                placeholder="Tuliskan pesan Anda"
                rows="5"
                required
              />
            </label>
            <button className="button" type="submit">
              Kirim Pesan
            </button>
          </form>
          <p className="status-message" role="status" aria-live="polite">
            {message}
          </p>
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
              <dd>
                <a href="tel:+62215550123">(021) 555-0123</a>
              </dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>
                <a href="mailto:info@smkn1nusantara.sch.id">
                  info@smkn1nusantara.sch.id
                </a>
              </dd>
            </div>
          </dl>
          <h2 className="map-heading">Peta Lokasi</h2>
          <img
            className="location-map"
            src={mapImage}
            alt="Peta ilustrasi lokasi SMK Negeri 1 Nusantara"
          />
        </aside>
      </div>
    </>
  )
}

export default ContactPage
