import { useEffect, useEffectEvent, useRef, useState } from 'react'
import type { FocusEvent } from 'react'

interface GalleryAutoplayOptions {
  enabled: boolean
  intervalMs: number
  activeIndex: number
  onAdvance: () => void
}

export function useGalleryAutoplay({
  enabled,
  intervalMs,
  activeIndex,
  onAdvance,
}: GalleryAutoplayOptions) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [inView, setInView] = useState(() => !('IntersectionObserver' in window))
  const [pageVisible, setPageVisible] = useState(() => !document.hidden)
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [userPaused, setUserPaused] = useState<boolean | null>(null)
  const [restartKey, setRestartKey] = useState(0)
  const paused = userPaused ?? reducedMotion
  const advance = useEffectEvent(onAdvance)

  useEffect(() => {
    if (!enabled) return
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onPreferenceChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches)
    const onVisibilityChange = () => setPageVisible(!document.hidden)
    preference.addEventListener('change', onPreferenceChange)
    document.addEventListener('visibilitychange', onVisibilityChange)

    const observer = 'IntersectionObserver' in window
      ? new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0 })
      : null
    if (rootRef.current) observer?.observe(rootRef.current)

    return () => {
      observer?.disconnect()
      preference.removeEventListener('change', onPreferenceChange)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled || intervalMs <= 0 || paused || hovered || focused || !inView || !pageVisible) return
    const timeout = window.setTimeout(() => advance(), intervalMs)
    return () => window.clearTimeout(timeout)
  }, [enabled, intervalMs, paused, hovered, focused, inView, pageVisible, activeIndex, restartKey])

  return {
    rootRef,
    paused,
    togglePaused: () => setUserPaused(!paused),
    restart: () => setRestartKey((key) => key + 1),
    interactionProps: {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      onFocusCapture: () => setFocused(true),
      onBlurCapture: (event: FocusEvent<HTMLDivElement>) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
      },
    },
  }
}
