import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useRef, useState } from 'react'
import type { GalleryImage } from '../lib/images'
import { useGalleryAutoplay } from '../lib/useGalleryAutoplay'
import { GalleryPlaybackButton } from './GalleryPlaybackButton'

interface CarouselProps {
  images: GalleryImage[]
  label: string
  className?: string
  autoplayIntervalMs?: number
  controlsBelow?: boolean
}

type CarouselDirection = 'next' | 'previous'

interface CarouselState {
  activeIndex: number
  previousIndex: number | null
  direction: CarouselDirection
}

export function Carousel({
  images,
  label,
  className = '',
  autoplayIntervalMs = 0,
  controlsBelow = false,
}: CarouselProps) {
  const [carouselState, setCarouselState] = useState<CarouselState>({
    activeIndex: 0,
    previousIndex: null,
    direction: 'next',
  })
  const touchStart = useRef<number | null>(null)
  const { activeIndex, previousIndex, direction } = carouselState

  const goTo = (index: number, requestedDirection?: CarouselDirection) => {
    setCarouselState((current) => {
      const nextIndex = (index + images.length) % images.length
      if (nextIndex === current.activeIndex) return current

      return {
        activeIndex: nextIndex,
        previousIndex: current.activeIndex,
        direction:
          requestedDirection ?? (nextIndex > current.activeIndex ? 'next' : 'previous'),
      }
    })
  }

  const { rootRef, paused, togglePaused, restart, interactionProps } = useGalleryAutoplay({
    enabled: autoplayIntervalMs > 0 && images.length > 1,
    intervalMs: autoplayIntervalMs,
    activeIndex,
    onAdvance: () => goTo(activeIndex + 1, 'next'),
  })

  const navigate = (index: number, requestedDirection?: CarouselDirection) => {
    restart()
    goTo(index, requestedDirection)
  }

  if (images.length === 0) {
    return <div className="carousel carousel--empty">Add photos to this gallery folder.</div>
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      navigate(activeIndex - 1, 'previous')
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      navigate(activeIndex + 1, 'next')
    }
  }

  const onTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStart.current === null) return
    const delta = event.changedTouches[0].clientX - touchStart.current
    if (Math.abs(delta) > 48) {
      const nextDirection = delta < 0 ? 'next' : 'previous'
      navigate(activeIndex + (nextDirection === 'next' ? 1 : -1), nextDirection)
    }
    touchStart.current = null
  }

  const arrows = images.length > 1 && (
    <>
      <button
        type="button"
        className={controlsBelow ? 'gallery-control' : 'carousel__arrow carousel__arrow--previous'}
        onClick={() => navigate(activeIndex - 1, 'previous')}
        aria-label="Previous photo"
      >
        <ArrowLeft aria-hidden="true" />
      </button>
      <button
        type="button"
        className={controlsBelow ? 'gallery-control' : 'carousel__arrow carousel__arrow--next'}
        onClick={() => navigate(activeIndex + 1, 'next')}
        aria-label="Next photo"
      >
        <ArrowRight aria-hidden="true" />
      </button>
    </>
  )

  return (
    <div
      ref={rootRef}
      className={`carousel ${controlsBelow ? 'carousel--controls-below' : ''} ${className}`.trim()}
      role="region"
      aria-label={label}
      data-reveal="scale"
      tabIndex={0}
      onKeyDown={onKeyDown}
      {...interactionProps}
      onTouchStart={(event) => {
        touchStart.current = event.touches[0].clientX
      }}
      onTouchEnd={onTouchEnd}
    >
      <div className="carousel__viewport">
        {images.map((image, index) => {
          const isActive = index === activeIndex
          const isPrevious = index === previousIndex
          const transitionClass =
            isActive && previousIndex !== null
              ? ` carousel__slide--enter-${direction}`
              : isPrevious
                ? ` carousel__slide--exit-${direction}`
                : ''

          return (
            <figure
              className={`carousel__slide${isActive ? ' carousel__slide--active' : ''}${transitionClass}`}
              key={image.filename}
              aria-hidden={!isActive}
            >
              <img
                src={image.src}
                alt={isActive ? image.alt : ''}
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
            </figure>
          )
        })}
        {!controlsBelow && arrows}
      </div>

      <div className="carousel__meta">
        <div className="carousel__dots" aria-label="Choose a photo">
          {images.map((image, index) => (
            <button
              key={image.filename}
              type="button"
              className={index === activeIndex ? 'carousel__dot carousel__dot--active' : 'carousel__dot'}
              aria-label={`Show photo ${index + 1}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              onClick={() => navigate(index)}
            />
          ))}
        </div>
        <span className="carousel__status" aria-live={autoplayIntervalMs ? 'off' : 'polite'} aria-atomic="true">
          {String(activeIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
        </span>
        {(controlsBelow || autoplayIntervalMs > 0) && images.length > 1 && (
          <div className="gallery-controls">
            {controlsBelow && arrows}
            {autoplayIntervalMs > 0 && (
              <GalleryPlaybackButton paused={paused} onToggle={togglePaused} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
