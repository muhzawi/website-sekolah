/**
 * Central error handler middleware.
 * Catches unhandled errors and sends a consistent JSON response.
 */
export function errorHandler(err, req, res, _next) {
  console.error('Unhandled error:', err.message)

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'Ukuran file terlalu besar. Maksimal 5 MB.' })
  }

  // Multer unexpected field
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ error: 'Field file tidak sesuai.' })
  }

  const status = err.status || err.statusCode || 500
  const message = status === 500
    ? 'Terjadi kesalahan pada server.'
    : err.message || 'Terjadi kesalahan.'

  res.status(status).json({ error: message })
}
