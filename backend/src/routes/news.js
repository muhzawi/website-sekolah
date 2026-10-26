import { Router } from 'express'
import { supabaseAdmin } from '../lib/supabase.js'
import { parseQueryParams, buildPaginationMeta } from '../utils/queryHelpers.js'

const router = Router()

/**
 * GET /api/news — Public: list published news with search & pagination.
 */
router.get('/', async (req, res, next) => {
  try {
    const { page, limit, offset, sortBy, sortOrder, search } = parseQueryParams(req.query, 'news')

    let query = supabaseAdmin
      .from('news')
      .select('id, title, slug, excerpt, cover_image_path, published_at, created_at', { count: 'exact' })
      .eq('status', 'published')

    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`)
    }

    const actualSort = ['published_at', 'created_at', 'title'].includes(sortBy) ? sortBy : 'published_at'
    query = query.order(actualSort, { ascending: sortOrder }).range(offset, offset + limit - 1)

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
 * GET /api/news/:slug — Public: single published news by slug.
 */
router.get('/:slug', async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('news')
      .select('*')
      .eq('slug', req.params.slug)
      .eq('status', 'published')
      .single()

    if (error || !data) {
      return res.status(404).json({ error: 'Berita tidak ditemukan.' })
    }

    res.json(data)
  } catch (err) {
    next(err)
  }
})

export default router
