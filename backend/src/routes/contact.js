import { Router } from 'express'

const router = Router()

router.post('/message', async (req, res) => {
  const { name, email, subject, message } = req.body || {}

  if (![name, email, subject, message].every(value => typeof value === 'string' && value.trim())) {
    return res.status(400).json({ error: 'Nama, email, subjek, dan pesan wajib diisi.' })
  }
  if (name.length > 120 || email.length > 254 || subject.length > 200 || message.length > 5000) {
    return res.status(400).json({ error: 'Panjang salah satu isian melebihi batas.' })
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: 'Format email tidak valid.' })
  }

  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL || process.env.CONTACT_FROM_EMAIL
  const recipient = process.env.ADMIN_EMAIL || 'zakisecond12@gmail.com'
  if (!apiKey || !from) {
    return res.status(503).json({
      error: 'Layanan pengiriman email belum dikonfigurasi pada server.',
    })
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [recipient],
        reply_to: email.trim(),
        subject: `Form Kontak: ${subject.trim()}`,
        text: `Nama: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`,
      }),
    })

    if (!response.ok) {
      const providerError = await response.json().catch(() => null)
      const detail = providerError?.message || `HTTP ${response.status}`
      console.error('Resend contact email failed:', response.status, detail)

      const error = response.status === 401 || response.status === 403
        ? 'API key Resend tidak valid atau tidak memiliki izin mengirim email.'
        : response.status === 422 || response.status === 400
          ? `Resend menolak alamat pengirim atau penerima: ${detail}`
          : response.status === 429
            ? 'Batas pengiriman Resend tercapai. Coba lagi nanti.'
            : `Resend gagal mengirim email: ${detail}`

      return res.status(502).json({ error })
    }

    return res.json({ message: 'Email berhasil dikirim.' })
  } catch (error) {
    console.error('Resend contact email request failed:', error.message)
    return res.status(502).json({ error: 'Layanan email tidak dapat dihubungi. Silakan coba lagi nanti.' })
  }
})

export default router
