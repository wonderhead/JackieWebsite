import { act, fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useGalleryAutoplay } from './useGalleryAutoplay'

let reportIntersection: (entries: Partial<IntersectionObserverEntry>[]) => void
const disconnect = vi.fn()

function Gallery({ enabled = true }: { enabled?: boolean }) {
  const [index, setIndex] = useState(0)
  const { rootRef, paused, togglePaused, restart, interactionProps } = useGalleryAutoplay({
    enabled,
    intervalMs: 5000,
    activeIndex: index,
    onAdvance: () => setIndex((current) => (current + 1) % 3),
  })
  return (
    <div ref={rootRef} role="region" aria-label="Gallery" {...interactionProps}>
      <output aria-label="Active photo">{index}</output>
      <button onClick={() => { restart(); setIndex((current) => (current + 1) % 3) }}>Next</button>
      <button onClick={togglePaused}>{paused ? 'Play' : 'Pause'}</button>
    </div>
  )
}

function elapse(milliseconds: number) {
  act(() => vi.advanceTimersByTime(milliseconds))
}

function visible(isIntersecting: boolean) {
  act(() => reportIntersection([{ isIntersecting }]))
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
  vi.spyOn(document, 'hidden', 'get').mockReturnValue(false)
  vi.stubGlobal('IntersectionObserver', class {
    constructor(callback: typeof reportIntersection) { reportIntersection = callback }
    observe() {}
    disconnect = disconnect
  })
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('gallery autoplay', () => {
  it('advances at five-second intervals and wraps to the first photo', () => {
    render(<Gallery />)
    visible(true)
    elapse(4999)
    expect(screen.getByLabelText('Active photo')).toHaveTextContent('0')
    elapse(1)
    expect(screen.getByLabelText('Active photo')).toHaveTextContent('1')
    elapse(5000)
    expect(screen.getByLabelText('Active photo')).toHaveTextContent('2')
    elapse(5000)
    expect(screen.getByLabelText('Active photo')).toHaveTextContent('0')
  })

  it('does not start when autoplay is disabled', () => {
    render(<Gallery enabled={false} />)
    elapse(15000)
    expect(screen.getByLabelText('Active photo')).toHaveTextContent('0')
    expect(vi.getTimerCount()).toBe(0)
  })

  it('pauses on hover and while focus stays inside the gallery', () => {
    render(<Gallery />)
    visible(true)
    const gallery = screen.getByRole('region')
    const next = screen.getByRole('button', { name: 'Next' })
    fireEvent.mouseEnter(gallery)
    elapse(10000)
    expect(screen.getByLabelText('Active photo')).toHaveTextContent('0')
    fireEvent.mouseLeave(gallery)
    fireEvent.focus(next)
    elapse(10000)
    fireEvent.blur(next, { relatedTarget: screen.getByRole('button', { name: 'Pause' }) })
    elapse(5000)
    expect(screen.getByLabelText('Active photo')).toHaveTextContent('0')
    fireEvent.blur(next, { relatedTarget: document.body })
    elapse(5000)
    expect(screen.getByLabelText('Active photo')).toHaveTextContent('1')
  })

  it('restarts the countdown after manual navigation and explicit pause/play', () => {
    render(<Gallery />)
    visible(true)
    elapse(3000)
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    elapse(4999)
    expect(screen.getByLabelText('Active photo')).toHaveTextContent('1')
    elapse(1)
    expect(screen.getByLabelText('Active photo')).toHaveTextContent('2')
    fireEvent.click(screen.getByRole('button', { name: 'Pause' }))
    elapse(10000)
    expect(screen.getByLabelText('Active photo')).toHaveTextContent('2')
    fireEvent.click(screen.getByRole('button', { name: 'Play' }))
    elapse(5000)
    expect(screen.getByLabelText('Active photo')).toHaveTextContent('0')
  })

  it('suspends offscreen and in a hidden browser tab, then waits a fresh five seconds', () => {
    render(<Gallery />)
    elapse(10000)
    expect(screen.getByLabelText('Active photo')).toHaveTextContent('0')
    visible(true)
    elapse(3000)
    visible(false)
    elapse(10000)
    visible(true)
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
    fireEvent(document, new Event('visibilitychange'))
    elapse(10000)
    expect(screen.getByLabelText('Active photo')).toHaveTextContent('0')
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(false)
    fireEvent(document, new Event('visibilitychange'))
    elapse(4999)
    expect(screen.getByLabelText('Active photo')).toHaveTextContent('0')
    elapse(1)
    expect(screen.getByLabelText('Active photo')).toHaveTextContent('1')
  })

  it('defaults to paused for reduced motion but allows the user to start playback', () => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    vi.spyOn(window, 'matchMedia').mockReturnValue({ ...preference, matches: true })
    render(<Gallery />)
    visible(true)
    elapse(10000)
    expect(screen.getByLabelText('Active photo')).toHaveTextContent('0')
    fireEvent.click(screen.getByRole('button', { name: 'Play' }))
    elapse(5000)
    expect(screen.getByLabelText('Active photo')).toHaveTextContent('1')
  })

  it('cleans up its timer and observer on unmount', () => {
    const { unmount } = render(<Gallery />)
    visible(true)
    expect(vi.getTimerCount()).toBe(1)
    unmount()
    expect(vi.getTimerCount()).toBe(0)
    expect(disconnect).toHaveBeenCalled()
  })
})
