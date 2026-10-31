import { Router } from 'express'
import { authorize } from '../middleware/auth.js'
import { supabaseAdmin } from '../lib/supabase.js'
import { parseQueryParams, buildPaginationMeta, parseDate, isValidUuid } from '../utils/queryHelpers.js'

const router = Router()

const PPDB_STATUSES = ['menunggu', 'berhasil', 'diterima', 'ditolak']

async function generateRegistrationNumber() {
  const now = new Date()
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
  const prefix = `PPDB-${dateStr}`
  const { count } = await supabaseAdmin
    .from('ppdb_applications')
    .select('id', { count: 'exact', head: true })
    .like('registration_number', `${prefix}%`)

  const seq = String((count || 0) + 1).padStart(4, '0')
  return `${prefix}-${seq}`
}

function collectApplicationFields(body) {
  const {
    full_name, nisn, birth_place, birth_date, gender,
    address, previous_school, phone, parent_name,
    parent_phone, major_choice,
  } = body

  const errors = []
  if (!full_name?.trim()) errors.push('Nama lengkap wajib diisi.')
  if (!nisn?.trim()) errors.push('NISN wajib diisi.')
  else if (!/^\d{10}$/.test(nisn.trim())) errors.push('NISN harus 10 digit angka.')
  if (!birth_place?.trim()) errors.push('Tempat lahir wajib diisi.')
  if (!birth_date) errors.push('Tanggal lahir wajib diisi.')
  if (!['Laki-laki', 'Perempuan'].includes(gender)) errors.push('Jenis kelamin tidak valid.')
  if (!address?.trim()) errors.push('Alamat wajib diisi.')
  if (!previous_school?.trim()) errors.push('Asal sekolah wajib diisi.')
  if (!phone?.trim()) errors.push('Nomor telepon wajib diisi.')
  if (!parent_name?.trim()) errors.push('Nama orang tua/wali wajib diisi.')
  if (!parent_phone?.trim()) errors.push('Nomor telepon orang tua/wali wajib diisi.')

  return {
    errors,
    fields: {
      full_name: full_name?.trim(),
      nisn: nisn?.trim(),
      birth_place: birth_place?.trim(),
      birth_date,
      gender,
      address: address?.trim(),
      previous_school: previous_school?.trim(),
      phone: phone?.trim(),
      parent_name: parent_name?.trim(),
      parent_phone: parent_phone?.trim(),
      major_choice: major_choice?.trim() || null,
    },
  }
}

async function getActivePeriod() {
  const { data: period, error } = await supabaseAdmin
    .from('ppdb_settings')
    .select('*')
    .eq('is_active', true)
    .maybeSingle()

  if (error) throw error
  return period
}

function isPeriodOpen(period) {
  if (!period) return false
  const now = new Date()
  const open = new Date(period.open_date)
  const close = new Date(`${period.close_date}T23:59:59`)
  return now >= open && now <= close
}

/**
 * GET /api/ppdb — Admin: list applications with search, filter, sort, pagination.
 */
router.get('/', authorize('admin'), async (req, res, next) => {
  try {
    const { page, limit, offset, sortBy, sortOrder, search } = parseQueryParams(req.query, 'ppdb')
    const { status, date_from, date_to, previous_school, major_choice } = req.query

    let query = supabaseAdmin
      .from('ppdb_applications')
      .select('*', { count: 'exact' })
      .eq('is_draft', false)

    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,registration_number.ilike.%${search}%,nisn.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
      )
    }

    if (status && PPDB_STATUSES.includes(status)) {
      query = query.eq('status', status)
    }
    if (typeof previous_school === 'string' && previous_school.trim()) {
      query = query.ilike('previous_school', `%${previous_school.trim().slice(0, 100)}%`)
    }
    if (typeof major_choice === 'string' && major_choice.trim()) {
      query = query.eq('major_choice', major_choice.trim())
    }

    const dateFrom = parseDate(date_from)
    const dateTo = parseDate(date_to)
    if (dateFrom) query = query.gte('created_at', dateFrom)
    if (dateTo) query = query.lte('created_at', dateTo)

    query = query.order(sortBy, { ascending: sortOrder }).range(offset, offset + limit - 1)

    const { data, error, count } = await query
    if (error) throw error

    res.json({
      data: data || [],
      pagination: buildPaginationMeta(page, limit, count || 0),
    })
  } catch (err) {
    next(err)
  }
})

/**
 * GET /api/ppdb/me — Peserta: own application(s).
 */
router.get('/me', authorize('peserta'), async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('ppdb_applications')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json(data || [])
  } catch (err) {
    next(err)
  }
})

/**
 * GET /api/ppdb/settings — Public: active PPDB period/settings.
 */
router.get('/settings', async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('ppdb_settings')
      .select('*')
      .eq('is_active', true)
      .maybeSingle()

    if (error) throw error

    // Return null if no active period (not an error)
    res.json(data || null)
  } catch (err) {
    next(err)
  }
})

/**
 * GET /api/ppdb/:id — Detail (admin or owner).
 */
router.get('/:id', async (req, res, next) => {
  try {
    if (!isValidUuid(req.params.id)) {
      return res.status(404).json({ error: 'Pendaftaran tidak ditemukan.' })
    }

    const { data, error } = await supabaseAdmin
      .from('ppdb_applications')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (error || !data) {
      return res.status(404).json({ error: 'Pendaftaran tidak ditemukan.' })
    }

    if (req.user.role !== 'admin' && data.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Anda tidak memiliki akses.' })
    }

    res.json(data)
  } catch (err) {
    next(err)
  }
})

/**
 * POST /api/ppdb — Peserta: create application (draft or submit).
 */
router.post('/', authorize('peserta'), async (req, res, next) => {
  try {
    const period = await getActivePeriod()
    if (!period) {
      return res.status(400).json({ error: 'Pendaftaran PPDB belum dibuka.' })
    }

    const submitting = req.body.submit !== false
    if (submitting && !isPeriodOpen(period)) {
      return res.status(400).json({ error: 'Periode pendaftaran sudah ditutup.' })
    }

    const { data: existing } = await supabaseAdmin
      .from('ppdb_applications')
      .select('id, is_draft')
      .eq('user_id', req.user.id)
      .eq('period_id', period.id)
      .maybeSingle()

    if (existing) {
      return res.status(409).json({
        error: existing.is_draft
          ? 'Draft pendaftaran sudah ada. Gunakan pembaruan draft.'
          : 'Anda sudah mendaftar pada periode ini.',
      })
    }

    const { errors, fields } = collectApplicationFields(req.body)
    if (submitting && errors.length > 0) {
      return res.status(400).json({ error: errors.join(' ') })
    }
    if (!fields.full_name) {
      return res.status(400).json({ error: 'Nama lengkap wajib diisi untuk menyimpan draft.' })
    }
    const safeFields = {
      full_name: fields.full_name || req.body.full_name?.trim() || req.user.fullName || 'Draft',
      nisn: fields.nisn || req.body.nisn?.trim() || '0000000000',
      birth_place: fields.birth_place || req.body.birth_place?.trim() || '-',
      birth_date: fields.birth_date || req.body.birth_date || '2000-01-01',
      gender: ['Laki-laki', 'Perempuan'].includes(req.body.gender) ? req.body.gender : 'Laki-laki',
      address: fields.address || req.body.address?.trim() || '-',
      previous_school: fields.previous_school || req.body.previous_school?.trim() || '-',
      phone: fields.phone || req.body.phone?.trim() || req.user.phone || '-',
      parent_name: fields.parent_name || req.body.parent_name?.trim() || '-',
      parent_phone: fields.parent_phone || req.body.parent_phone?.trim() || '-',
      major_choice: fields.major_choice,
    }

    let lastError = null
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const registrationNumber = await generateRegistrationNumber()
      const { data, error } = await supabaseAdmin
        .from('ppdb_applications')
        .insert({
          registration_number: registrationNumber,
          user_id: req.user.id,
          period_id: period.id,
          email: req.user.email || '',
          ...(submitting ? fields : safeFields),
          status: 'menunggu',
          is_draft: !submitting,
          submitted_at: submitting ? new Date().toISOString() : null,
        })
        .select()
        .single()

      if (!error) {
        return res.status(201).json(data)
      }
      if (error.code === '23505') {
        lastError = error
        continue
      }
      throw error
    }

    if (lastError) {
      return res.status(409).json({ error: 'Anda sudah mendaftar pada periode ini.' })
    }
    return res.status(500).json({ error: 'Gagal membuat nomor pendaftaran. Coba lagi.' })
  } catch (err) {
    next(err)
  }
})

/**
 * PATCH /api/ppdb/me — Peserta: update own draft / waiting application.
 */
router.patch('/me', authorize('peserta'), async (req, res, next) => {
  try {
    const { data: existing } = await supabaseAdmin
      .from('ppdb_applications')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!existing) {
      return res.status(404).json({ error: 'Pendaftaran tidak ditemukan.' })
    }
    if (!existing.is_draft && existing.status !== 'menunggu') {
      return res.status(400).json({ error: 'Pendaftaran tidak dapat diubah setelah diverifikasi.' })
    }

    const submitting = req.body.submit === true
    if (submitting) {
      const period = await getActivePeriod()
      if (!period || !isPeriodOpen(period)) {
        return res.status(400).json({ error: 'Periode pendaftaran sudah ditutup.' })
      }
    }

    const payload = submitting ? collectApplicationFields({ ...existing, ...req.body }) : null
    if (payload?.errors?.length) {
      return res.status(400).json({ error: payload.errors.join(' ') })
    }

    const allowed = [
      'full_name', 'nisn', 'birth_place', 'birth_date', 'gender',
      'address', 'previous_school', 'phone', 'parent_name',
      'parent_phone', 'major_choice',
    ]

    const updates = {}
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates[key] = typeof req.body[key] === 'string' ? req.body[key].trim() : req.body[key]
      }
    }

    if (submitting) {
      updates.is_draft = false
      updates.submitted_at = new Date().toISOString()
      updates.status = 'menunggu'
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'Tidak ada data untuk diperbarui.' })
    }

    const { data, error } = await supabaseAdmin
      .from('ppdb_applications')
      .update(updates)
      .eq('id', existing.id)
      .select()
      .single()

    if (error) throw error
    res.json(data)
  } catch (err) {
    next(err)
  }
})

/**
 * PATCH /api/ppdb/:id/status — Admin: update status.
 */
router.patch('/:id/status', authorize('admin'), async (req, res, next) => {
  try {
    if (!isValidUuid(req.params.id)) {
      return res.status(404).json({ error: 'Pendaftaran tidak ditemukan.' })
    }

    const { status, admin_notes } = req.body
    if (!PPDB_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Status tidak valid.' })
    }

    const { data: current } = await supabaseAdmin
      .from('ppdb_applications')
      .select('id, is_draft')
      .eq('id', req.params.id)
      .maybeSingle()

    if (!current) return res.status(404).json({ error: 'Pendaftaran tidak ditemukan.' })
    if (current.is_draft) {
      return res.status(400).json({ error: 'Pendaftaran masih berupa draft dan belum dikirim peserta.' })
    }

    const updates = { status }
    if (typeof admin_notes === 'string') {
      updates.admin_notes = admin_notes.trim().slice(0, 1000)
    }

    const { data, error } = await supabaseAdmin
      .from('ppdb_applications')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) throw error
    res.json(data)
  } catch (err) {
    next(err)
  }
})

export default router
