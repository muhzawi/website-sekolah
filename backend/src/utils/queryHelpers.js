/**
 * Pagination, search, sort, and filter utilities.
 */

const SORT_ALLOWLISTS = {
  ppdb: ['created_at', 'full_name', 'registration_number', 'status', 'nisn'],
  news: ['created_at', 'published_at', 'title'],
}

/**
 * Strip characters that can break PostgREST `or()` / `ilike` filters.
 */
export function sanitizeSearch(value) {
  if (typeof value !== 'string') return ''
  return value
    .replace(/[%_,.()\\*]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200)
}

/**
 * Parse and validate common query parameters.
 */
export function parseQueryParams(query, entity = 'ppdb') {
  const page = Math.max(1, parseInt(query.page, 10) || 1)
  const limit = Math.min(50, Math.max(1, parseInt(query.limit, 10) || 10))
  const offset = (page - 1) * limit

  const allowlist = SORT_ALLOWLISTS[entity] || SORT_ALLOWLISTS.ppdb
  const sortBy = allowlist.includes(query.sortBy) ? query.sortBy : 'created_at'
  const sortOrder = query.sortOrder === 'asc' ? true : false

  const search = sanitizeSearch(query.search)

  return { page, limit, offset, sortBy, sortOrder, search }
}

export function buildPaginationMeta(page, limit, total) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 0,
  }
}

export function parseDate(str) {
  if (!str || typeof str !== 'string') return null
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str) && Number.isNaN(Date.parse(str))) return null
  const d = new Date(str)
  return Number.isNaN(d.getTime()) ? null : d.toISOString()
}

export function isValidUuid(value) {
  return typeof value === 'string'
    && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}
