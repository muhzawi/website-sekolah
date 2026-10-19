import { useEffect, useMemo, useState } from 'react'
import NewsCard from '../components/NewsCard.jsx'
import PageHeading from '../components/PageHeading.jsx'
import { newsItems } from '../data/schoolData.js'

const filters = ['Semua', 'Berita', 'Pengumuman', 'Kegiatan']
const pageSize = 6

function NewsPage() {
  const [activeFilter, setActiveFilter] = useState('Semua')
  const [activePage, setActivePage] = useState(1)
  const [selectedItem, setSelectedItem] = useState(null)

  const filteredItems = useMemo(() => {
    const items = newsItems.slice(1)
    return activeFilter === 'Semua'
      ? items
      : items.filter((item) => item.category === activeFilter)
  }, [activeFilter])

  const pages = Math.max(1, Math.ceil(filteredItems.length / pageSize))
  const visibleItems = filteredItems.slice(
    (activePage - 1) * pageSize,
    activePage * pageSize,
  )

  useEffect(() => {
    if (!selectedItem) return undefined

    function closeOnEscape(event) {
      if (event.key === 'Escape') setSelectedItem(null)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [selectedItem])

  function changeFilter(filter) {
    setActiveFilter(filter)
    setActivePage(1)
  }

  return (
    <>
      <PageHeading
        breadcrumbs={['Beranda', 'Berita & Pengumuman']}
        title="Berita & Pengumuman"
        size="medium"
      />
      <div className="filter-tabs" role="group" aria-label="Filter kategori berita">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            className={activeFilter === filter ? 'filter-chip is-active' : 'filter-chip'}
            aria-pressed={activeFilter === filter}
            onClick={() => changeFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {activeFilter === 'Semua' && (
        <button
          type="button"
          className="featured-news surface"
          onClick={() => setSelectedItem(newsItems[0])}
        >
          <img src={newsItems[0].image} alt={newsItems[0].alt} />
          <span className="featured-news-copy">
            <time>{newsItems[0].date}</time>
            <strong>{newsItems[0].title}</strong>
            <span>{newsItems[0].description}</span>
          </span>
        </button>
      )}

      <div className="news-grid">
        {visibleItems.length ? (
          visibleItems.map((item) => (
            <NewsCard key={item.id} item={item} onSelect={setSelectedItem} />
          ))
        ) : (
          <p className="empty-state">Belum ada berita pada kategori ini.</p>
        )}
      </div>

      {pages > 1 && (
        <nav className="pagination" aria-label="Halaman berita">
          <button
            type="button"
            aria-label="Halaman sebelumnya"
            disabled={activePage === 1}
            onClick={() => setActivePage((page) => page - 1)}
          >
            ‹
          </button>
          {Array.from({ length: pages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              type="button"
              className={activePage === page ? 'is-active' : ''}
              aria-current={activePage === page ? 'page' : undefined}
              onClick={() => setActivePage(page)}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            aria-label="Halaman berikutnya"
            disabled={activePage === pages}
            onClick={() => setActivePage((page) => page + 1)}
          >
            ›
          </button>
        </nav>
      )}

      {selectedItem && (
        <div
          className="dialog-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedItem(null)
          }}
        >
          <article className="news-dialog surface" role="dialog" aria-modal="true" aria-labelledby="news-dialog-title">
            <button
              className="dialog-close"
              type="button"
              aria-label="Tutup berita"
              onClick={() => setSelectedItem(null)}
            >
              ×
            </button>
            <img src={selectedItem.image} alt={selectedItem.alt} />
            <time>{selectedItem.date}</time>
            <h2 id="news-dialog-title">{selectedItem.title}</h2>
            <p>{selectedItem.description}</p>
          </article>
        </div>
      )}
    </>
  )
}

export default NewsPage
