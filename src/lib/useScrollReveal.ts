import { useLayoutEffect } from 'react'

const reducedMotionQuery = '(prefers-reduced-motion: reduce)'

export function useScrollReveal(routeKey: string) {
  useLayoutEffect(() => {
    const root = document.documentElement
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    const motionPreference = window.matchMedia(reducedMotionQuery)

    root.classList.add('reveal-ready')

    const revealAll = () => {
      elements.forEach((element) => element.classList.add('is-revealed'))
    }

    if (motionPreference.matches || !('IntersectionObserver' in window)) {
      revealAll()
      return () => root.classList.remove('reveal-ready')
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return

          entry.target.classList.add('is-revealed')
          observer.unobserve(entry.target)
        })
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -8% 0px',
      },
    )

    elements.forEach((element) => {
      if (!element.classList.contains('is-revealed')) observer.observe(element)
    })

    const handleMotionPreference = (event: MediaQueryListEvent) => {
      if (!event.matches) return
      observer.disconnect()
      revealAll()
    }

    motionPreference.addEventListener('change', handleMotionPreference)

    return () => {
      observer.disconnect()
      motionPreference.removeEventListener('change', handleMotionPreference)
      root.classList.remove('reveal-ready')
    }
  }, [routeKey])
}
