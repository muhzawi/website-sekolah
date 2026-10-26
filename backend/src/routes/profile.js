import { Router } from 'express'
import { supabaseAdmin } from '../lib/supabase.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single()

    if (error) throw error
    res.json(data)
  } catch (err) {
    next(err)
  }
})

/**
 * PATCH /api/profile
 * Update own profile (name, phone). Cannot change role.
 */
router.patch('/', async (req, res, next) => {
  try {
    const { full_name, phone } = req.body
    const updates = {}

    if (typeof full_name === 'string' && full_name.trim()) {
      updates.full_name = full_name.trim().slice(0, 200)
    }
    if (typeof phone === 'string') {
      updates.phone = phone.trim().slice(0, 20)
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'Tidak ada data untuk diperbarui.' })
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', req.user.id)
      .select()
      .single()

    if (error) throw error
    res.json(data)
  } catch (err) {
    next(err)
  }
})

export default router
