import { Router } from 'express'
import { supabaseAdmin } from '../lib/supabase.js'

const router = Router()

/**
 * GET /api/admin/dashboard/stats
 * Returns actual counts for dashboard cards.
 */
router.get('/stats', async (req, res, next) => {
  try {
    const [total, menunggu, berhasil, diterima, ditolak, newsPublished] = await Promise.all([
      supabaseAdmin.from('ppdb_applications').select('id', { count: 'exact', head: true }).eq('is_draft', false),
      supabaseAdmin.from('ppdb_applications').select('id', { count: 'exact', head: true }).eq('is_draft', false).eq('status', 'menunggu'),
      supabaseAdmin.from('ppdb_applications').select('id', { count: 'exact', head: true }).eq('is_draft', false).eq('status', 'berhasil'),
      supabaseAdmin.from('ppdb_applications').select('id', { count: 'exact', head: true }).eq('is_draft', false).eq('status', 'diterima'),
      supabaseAdmin.from('ppdb_applications').select('id', { count: 'exact', head: true }).eq('is_draft', false).eq('status', 'ditolak'),
      supabaseAdmin.from('news').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    ])

    res.json({
      totalPendaftar: total.count || 0,
      menunggu: menunggu.count || 0,
      berhasil: berhasil.count || 0,
      diterima: diterima.count || 0,
      ditolak: ditolak.count || 0,
      beritaPublished: newsPublished.count || 0,
    })
  } catch (err) {
    next(err)
  }
})

export default router
