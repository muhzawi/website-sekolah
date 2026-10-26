import { Router } from 'express'
import multer from 'multer'
import { supabaseAdmin } from '../lib/supabase.js'
import { parseQueryParams, buildPaginationMeta, parseDate, isValidUuid } from '../utils/queryHelpers.js'

const router = Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      const err = new Error('Format file tidak didukung. Gunakan JPEG, PNG, WebP, atau GIF.')
      err.status = 400
      cb(err)
    }
  },
})

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .slice(0, 200)
}

async function removeCoverIfUnused(path, exceptId = null) {
  if (!path) return
  let query = supabaseAdmin
    .from('news')
    .select('id', { count: 'exact', head: true })
    .eq('cover_image_path', path)
  if (exceptId) query = query.neq('id', exceptId)
  const { count } = await query
  if (!count) {
    await supabaseAdmin.storage.from('news-images').remove([path])
  }
}

router.get('/', async (req, res, next) => {
  try {
    const { page, limit, offset, sortBy, sortOrder, search } = parseQueryParams(req.query, 'news')
    const { status, date_from, date_to, author_id } = req.query

    let query = supabaseAdmin
      .from('news')
      .select('id, title, slug, excerpt, cover_image_path, status, author_id, published_at, created_at, updated_at, author:profiles!author_id(full_name)', { count: 'exact' })

    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`)
    }
    if (status && ['draft', 'published'].includes(status)) {
      query = query.eq('status', status)
    }
    if (isValidUuid(author_id)) {
      query = query.eq('author_id', author_id)
    }

    const dateFrom = parseDate(date_from)
    const dateTo = parseDate(date_to)
    if (dateFrom) query = query.gte('created_at', dateFrom)
    if (dateTo) query = query.lte('created_at', dateTo)

    const actualSort = ['created_at', 'published_at', 'title'].includes(sortBy) ? sortBy : 'created_at'
    query = query.order(actualSort, { ascending: sortOrder }).range(offset, offset + limit - 1)

    const [{ data, error, count }, authorsResult] = await Promise.all([
      query,
      supabaseAdmin.from('profiles').select('id, full_name').eq('role', 'admin').order('full_name'),
    ])
    if (error) throw error

    res.json({
      data: data || [],
      pagination: buildPaginationMeta(page, limit, count || 0),
      authors: authorsResult.data || [],
    })
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    if (!isValidUuid(req.params.id)) {
      return res.status(404).json({ error: 'Berita tidak ditemukan.' })
    }
    const { data, error } = await supabaseAdmin
      .from('news')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (error || !data) return res.status(404).json({ error: 'Berita tidak ditemukan.' })
    res.json(data)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { title, excerpt, content, cover_image_path, status: newsStatus } = req.body

    if (!title?.trim()) {
      return res.status(400).json({ error: 'Judul berita wajib diisi.' })
    }

    let slug = slugify(title) || `berita-${Date.now()}`
    const { data: existingSlug } = await supabaseAdmin
      .from('news')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()

    if (existingSlug) slug = `${slug}-${Date.now().toString(36)}`

    const finalStatus = newsStatus === 'published' ? 'published' : 'draft'

    const { data, error } = await supabaseAdmin
      .from('news')
      .insert({
        title: title.trim(),
        slug,
        excerpt: (excerpt || '').trim(),
        content: (content || '').trim(),
        cover_image_path: cover_image_path || '',
        status: finalStatus,
        author_id: req.user.id,
        published_at: finalStatus === 'published' ? new Date().toISOString() : null,
      })
      .select()
      .single()

    if (error) throw error
    res.status(201).json(data)
  } catch (err) {
    next(err)
  }
})

router.patch('/:id', async (req, res, next) => {
  try {
    if (!isValidUuid(req.params.id)) {
      return res.status(404).json({ error: 'Berita tidak ditemukan.' })
    }

    const { title, excerpt, content, cover_image_path, status: newsStatus } = req.body
    const updates = {}

    const { data: current, error: currentError } = await supabaseAdmin
      .from('news')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (currentError || !current) return res.status(404).json({ error: 'Berita tidak ditemukan.' })

    if (typeof title === 'string' && title.trim()) {
      updates.title = title.trim()
      let slug = slugify(title) || current.slug
      const { data: existing } = await supabaseAdmin
        .from('news')
        .select('id')
        .eq('slug', slug)
        .neq('id', req.params.id)
        .maybeSingle()
      if (existing) slug = `${slug}-${Date.now().toString(36)}`
      updates.slug = slug
    }

    if (typeof excerpt === 'string') updates.excerpt = excerpt.trim()
    if (typeof content === 'string') updates.content = content.trim()
    if (typeof cover_image_path === 'string') updates.cover_image_path = cover_image_path

    if (newsStatus && ['draft', 'published'].includes(newsStatus)) {
      updates.status = newsStatus
      if (newsStatus === 'published' && current.status !== 'published') {
        updates.published_at = new Date().toISOString()
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'Tidak ada data untuk diperbarui.' })
    }

    const { data, error } = await supabaseAdmin
      .from('news')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) throw error

    if (
      typeof cover_image_path === 'string'
      && current.cover_image_path
      && current.cover_image_path !== cover_image_path
    ) {
      await removeCoverIfUnused(current.cover_image_path, req.params.id)
    }

    res.json(data)
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    if (!isValidUuid(req.params.id)) {
      return res.status(404).json({ error: 'Berita tidak ditemukan.' })
    }

    const { data: news } = await supabaseAdmin
      .from('news').select('cover_image_path').eq('id', req.params.id).single()

    if (!news) return res.status(404).json({ error: 'Berita tidak ditemukan.' })

    const { error } = await supabaseAdmin.from('news').delete().eq('id', req.params.id)
    if (error) throw error

    await removeCoverIfUnused(news.cover_image_path)

    res.json({ message: 'Berita berhasil dihapus.' })
  } catch (err) {
    next(err)
  }
})

router.post('/upload', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'File gambar tidak ditemukan.' })

    const ext = req.file.originalname.split('.').pop().toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const filePath = `covers/${fileName}`

    const { error: uploadError } = await supabaseAdmin.storage
      .from('news-images')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      })

    if (uploadError) throw uploadError

    const { data: urlData } = supabaseAdmin.storage.from('news-images').getPublicUrl(filePath)

    res.json({ path: filePath, url: urlData.publicUrl })
  } catch (err) {
    next(err)
  }
})

export default router
