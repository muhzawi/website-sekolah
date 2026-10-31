import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'

import { authenticate, authorize } from './middleware/auth.js'
import { errorHandler } from './middleware/errorHandler.js'
import { supabaseAdmin } from './lib/supabase.js'
import profileRouter from './routes/profile.js'
import ppdbRouter from './routes/ppdb.js'
import newsRouter from './routes/news.js'
import adminNewsRouter from './routes/adminNews.js'
import dashboardRouter from './routes/dashboard.js'
import contactRouter from './routes/contact.js'

const app = express()
app.set('trust proxy', 1)

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)

app.use(cors({
  origin: (origin, cb) => {
    const isVercelOrigin = origin && /^https:\/\/(?:[a-z0-9-]+\.)+vercel\.app$/i.test(origin)

    if (!origin || allowedOrigins.includes(origin) || isVercelOrigin) {
      cb(null, true)
    } else {
      cb(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}))

app.use(express.json({ limit: '1mb' }))
app.use(morgan('dev'))

app.get('/', (_req, res) => {
  res.json({
    service: 'Website Sekolah Backend',
    status: 'running',
    message: 'Backend berjalan dengan baik.',
    api: '/api',
    timestamp: new Date().toISOString(),
  })
})

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Terlalu banyak permintaan. Coba lagi nanti.' },
})

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Terlalu banyak percobaan. Coba lagi dalam 15 menit.' },
})

app.use('/api', generalLimiter)
app.use('/api/ppdb', (req, res, next) => {
  if (req.method === 'POST' || req.method === 'PATCH') {
    return strictLimiter(req, res, next)
  }
  next()
})

app.get('/api/health', (_req, res) =>
  res.json({ ok: true, ts: new Date().toISOString() })
)

app.use('/api/news', newsRouter)
app.use('/api/contact', strictLimiter, contactRouter)

app.get('/api/ppdb/settings', async (_req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('ppdb_settings')
      .select('*')
      .eq('is_active', true)
      .maybeSingle()
    if (error) throw error
    res.json(data)
  } catch (err) {
    next(err)
  }
})

app.get('/api/auth/me', authenticate, (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
    role: req.user.role,
    fullName: req.user.fullName,
    phone: req.user.phone,
  })
})

app.use('/api/profile', authenticate, profileRouter)
app.use('/api/ppdb', authenticate, ppdbRouter)
app.use('/api/admin/news', authenticate, authorize('admin'), adminNewsRouter)
app.use('/api/admin/dashboard', authenticate, authorize('admin'), dashboardRouter)

app.use(errorHandler)

export default app
