import { supabaseAdmin } from '../lib/supabase.js'

/**
 * Middleware: Verifies Supabase JWT and attaches user info to req.
 * Sets req.user = { id, email, role }
 */
export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token autentikasi tidak ditemukan.' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    if (error || !user) {
      return res.status(401).json({ error: 'Token tidak valid atau sudah kedaluwarsa.' })
    }

    // Fetch role from profiles
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role, full_name, phone')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return res.status(401).json({ error: 'Profil pengguna tidak ditemukan.' })
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: profile.role,
      fullName: profile.full_name,
      phone: profile.phone,
    }
    req.accessToken = token

    next()
  } catch (err) {
    console.error('Auth middleware error:', err.message)
    return res.status(500).json({ error: 'Kesalahan autentikasi server.' })
  }
}

/**
 * Middleware factory: Restricts access to specific roles.
 */
export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Tidak terautentikasi.' })
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Anda tidak memiliki akses ke sumber daya ini.' })
    }
    next()
  }
}
