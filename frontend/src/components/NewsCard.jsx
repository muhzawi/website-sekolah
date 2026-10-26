import { Link } from 'react-router-dom'
import { newsImageUrl } from '../utils/media.js'

export default function NewsCard({ item }) {
  const imageSrc = item.image || newsImageUrl(item.cover_image_path)

  const dateStr = item.date || (item.published_at
    ? new Date(item.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : '')

  const href = item.slug ? `/news/${item.slug}` : '/news'

  return (
    <Link className="news-card" to={href} aria-label={`Baca berita: ${item.title}`}>
      {imageSrc && <img className="news-card-image" src={imageSrc} alt={item.alt || item.title} />}
      <div className="news-card-copy">
        <time>{dateStr}</time>
        <h3>{item.title}</h3>
        {(item.description || item.excerpt) && (
          <p>{item.description || item.excerpt}</p>
        )}
      </div>
    </Link>
  )
}
