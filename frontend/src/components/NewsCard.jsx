function NewsCard({ item, onSelect }) {
  const content = (
    <>
      <img className="news-card-image" src={item.image} alt={item.alt} />
      <div className="news-card-copy">
        <time>{item.date}</time>
        <h3>{item.title}</h3>
        {item.description && <p>{item.description}</p>}
      </div>
    </>
  )

  if (onSelect) {
    return (
      <button
        type="button"
        className="news-card news-card--button"
        onClick={() => onSelect(item)}
        aria-label={`Baca berita: ${item.title}`}
      >
        {content}
      </button>
    )
  }

  return (
    <a className="news-card" href="?page=news" aria-label={`Lihat berita: ${item.title}`}>
      {content}
    </a>
  )
}

export default NewsCard
