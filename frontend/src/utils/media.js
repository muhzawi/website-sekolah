export function newsImageUrl(path) {
  if (!path) return null
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const base = import.meta.env.VITE_SUPABASE_URL
  if (!base) return null
  return `${base}/storage/v1/object/public/news-images/${path}`
}

export function isCanceledError(err) {
  return err?.code === 'ERR_CANCELED' || err?.name === 'CanceledError' || err?.message === 'canceled'
}
