import { useState } from 'react'
import './ImageSlider.css'

function ImageSlider({ slides, label = 'Galeri sekolah' }) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!slides.length) return null

  const activeSlide = slides[activeIndex]
  const canNavigate = slides.length > 1

  function moveSlide(direction) {
    setActiveIndex((index) => (index + direction + slides.length) % slides.length)
  }

  return (
    <div className="image-slider" role="region" aria-label={label}>
      <img
        className="image-slider-photo"
        src={activeSlide.image}
        alt={activeSlide.alt}
      />
      {canNavigate && (
        <>
          <button
            type="button"
            className="slider-arrow slider-arrow--previous"
            aria-label="Tampilkan gambar sebelumnya"
            onClick={() => moveSlide(-1)}
          >
            <span aria-hidden="true">‹</span>
          </button>
          <button
            type="button"
            className="slider-arrow slider-arrow--next"
            aria-label="Tampilkan gambar berikutnya"
            onClick={() => moveSlide(1)}
          >
            <span aria-hidden="true">›</span>
          </button>
          <div className="slider-dots" aria-label="Pilih gambar">
            {slides.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                className={index === activeIndex ? 'slider-dot is-active' : 'slider-dot'}
                aria-label={`Gambar ${index + 1}: ${slide.title}`}
                aria-current={index === activeIndex ? 'true' : undefined}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default ImageSlider
