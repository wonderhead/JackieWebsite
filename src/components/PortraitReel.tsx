import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { GalleryImage } from '../lib/images'
import { useGalleryAutoplay } from '../lib/useGalleryAutoplay'
import { GalleryPlaybackButton } from './GalleryPlaybackButton'

interface PortraitReelProps {
  images: GalleryImage[]
  label: string
  autoplayIntervalMs?: number
}

interface ReelMotion {
  position: number
  moving: boolean
  queue: number[]
}

export function PortraitReel({ images, label, autoplayIntervalMs = 5000 }: PortraitReelProps) {
  const [motion, setMotion] = useState<ReelMotion>({ position: images.length, moving: false, queue: [] })
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const touchStart = useRef<number | null>(null)
  const count = images.length
  const activeIndex = count ? ((motion.position % count) + count) % count : 0

  const advance = (direction: number) => {
    if (count < 2) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setMotion((current) => {
      if (reducedMotion) {
        const position = current.position + current.queue.reduce((total, move) => total + move, 0) + direction
        return { position: ((position % count) + count) % count + count, moving: false, queue: [] }
      }
      if (current.moving || current.queue.length) {
        return { ...current, queue: [...current.queue, direction] }
      }
      return { position: current.position + direction, moving: true, queue: [] }
    })
  }

  const { rootRef, paused, togglePaused, restart, interactionProps } = useGalleryAutoplay({
    enabled: count > 1 && autoplayIntervalMs > 0,
    intervalMs: autoplayIntervalMs,
    activeIndex,
    onAdvance: () => advance(1),
  })

  const navigate = (direction: number) => {
    restart()
    advance(direction)
  }

  const finishMove = useCallback(() => {
    if (!count) return
    setMotion((current) => current.moving ? {
      ...current,
      position: ((current.position % count) + count) % count + count,
      moving: false,
    } : current)
  }, [count])

  useEffect(() => {
    if (motion.moving || !motion.queue.length) return
    let nextFrame: number
    // Paint the normalized loop position without a transition before the next move.
    const frame = window.requestAnimationFrame(() => {
      nextFrame = window.requestAnimationFrame(() => {
        setMotion((current) => {
          if (current.moving || !current.queue.length) return current
          const [direction, ...queue] = current.queue
          return { position: current.position + direction, moving: true, queue }
        })
      })
    })
    return () => {
      window.cancelAnimationFrame(frame)
      window.cancelAnimationFrame(nextFrame)
    }
  }, [motion.moving, motion.queue])

  const positionTrack = useCallback(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    const item = track?.querySelectorAll<HTMLElement>('.portrait-reel__item')[
      count > 1 ? motion.position : 0
    ]
    if (!viewport || !track || !item || !item.offsetWidth) return
    const widestRatio = Math.max(1, ...Array.from(track.querySelectorAll('img'), (image) => (
      image.naturalHeight ? image.naturalWidth / image.naturalHeight : 0
    )))
    // Keep even landscape photos fully visible when centered on a narrow screen.
    viewport.style.setProperty('--reel-fit-height', `${viewport.clientWidth / widestRatio}px`)
    const itemBounds = item.getBoundingClientRect()
    const trackBounds = track.getBoundingClientRect()
    const offset = itemBounds.left - trackBounds.left + itemBounds.width / 2 - viewport.clientWidth / 2
    track.style.transform = `translate3d(${-offset}px, 0, 0)`
    track.style.visibility = 'visible'
  }, [count, motion.position])

  useLayoutEffect(() => {
    positionTrack()
    const observer = 'ResizeObserver' in window ? new ResizeObserver(positionTrack) : null
    if (viewportRef.current) observer?.observe(viewportRef.current)
    trackRef.current?.querySelectorAll('.portrait-reel__group').forEach((group) => observer?.observe(group))
    window.addEventListener('resize', positionTrack)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', positionTrack)
    }
  }, [positionTrack])

  useEffect(() => {
    if (!motion.moving) return
    // Also settle when reduced motion suppresses transitionend, or a resize interrupts it.
    const timeout = window.setTimeout(finishMove, 700)
    return () => window.clearTimeout(timeout)
  }, [motion.moving, finishMove])

  if (!count) return <div className="carousel carousel--empty">Add photos to this gallery folder.</div>

  return (
    <div
      ref={rootRef}
      className="portrait-reel"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      {...interactionProps}
      onKeyDown={(event) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
        event.preventDefault()
        navigate(event.key === 'ArrowLeft' ? -1 : 1)
      }}
      onTouchStart={(event) => { touchStart.current = event.touches[0].clientX }}
      onTouchEnd={(event) => {
        if (touchStart.current === null) return
        const delta = event.changedTouches[0].clientX - touchStart.current
        if (Math.abs(delta) > 48) navigate(delta < 0 ? 1 : -1)
        touchStart.current = null
      }}
      onTouchCancel={() => { touchStart.current = null }}
    >
      <div className="portrait-reel__viewport" ref={viewportRef}>
        <div
          className="portrait-reel__track"
          ref={trackRef}
          data-moving={motion.moving}
          onTransitionEnd={(event) => {
            if (event.target === event.currentTarget && event.propertyName === 'transform') finishMove()
          }}
        >
          {(count > 1 ? [0, 1, 2] : [1]).map((group) => (
            <div
              className="portrait-reel__group"
              key={group}
              aria-hidden={group !== 1 ? true : undefined}
              role={group === 1 ? 'list' : undefined}
            >
              {images.map((image) => (
                <figure className="portrait-reel__item" key={image.filename} role={group === 1 ? 'listitem' : undefined}>
                  <img
                    src={image.src}
                    alt={group === 1 ? image.alt : ''}
                    decoding="async"
                    onLoad={positionTrack}
                  />
                </figure>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="portrait-reel__footer shell">
        <span className="carousel__status" aria-live={autoplayIntervalMs > 0 ? 'off' : 'polite'}>
          {String(activeIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </span>
        {count > 1 && (
          <div className="gallery-controls">
            <button className="gallery-control" type="button" aria-label="Previous photo" onClick={() => navigate(-1)}>
              <ArrowLeft aria-hidden="true" />
            </button>
            <button className="gallery-control" type="button" aria-label="Next photo" onClick={() => navigate(1)}>
              <ArrowRight aria-hidden="true" />
            </button>
            {autoplayIntervalMs > 0 && <GalleryPlaybackButton paused={paused} onToggle={togglePaused} />}
          </div>
        )}
      </div>
    </div>
  )
}
