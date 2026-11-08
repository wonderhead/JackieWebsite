import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PortraitReel } from './PortraitReel'

const images = [
  { src: '/one.jpg', alt: 'First portrait', filename: '01-first.jpg' },
  { src: '/two.jpg', alt: 'Second portrait', filename: '02-second.jpg' },
  { src: '/three.jpg', alt: 'Third portrait', filename: '03-third.jpg' },
]

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('PortraitReel', () => {
  it('exposes each original photo once and hides the looping duplicates', () => {
    render(<PortraitReel images={images} label="Portrait gallery" />)
    expect(screen.getAllByRole('img')).toHaveLength(3)
    expect(document.querySelectorAll('.portrait-reel__group[aria-hidden="true"] img')).toHaveLength(6)
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('supports arrows, keyboard navigation, swipes, and seamless wraparound', () => {
    vi.useFakeTimers()
    render(<PortraitReel images={images} label="Portrait gallery" />)
    const settle = () => act(() => vi.advanceTimersByTime(700))
    fireEvent.click(screen.getByRole('button', { name: 'Previous photo' }))
    expect(screen.getByText('03 / 03')).toBeInTheDocument()
    settle()
    fireEvent.click(screen.getByRole('button', { name: 'Next photo' }))
    expect(screen.getByText('01 / 03')).toBeInTheDocument()
    settle()
    const gallery = screen.getByRole('region')
    fireEvent.keyDown(gallery, { key: 'ArrowRight' })
    expect(screen.getByText('02 / 03')).toBeInTheDocument()
    settle()
    fireEvent.touchStart(gallery, { touches: [{ clientX: 240 }] })
    fireEvent.touchEnd(gallery, { changedTouches: [{ clientX: 120 }] })
    expect(screen.getByText('03 / 03')).toBeInTheDocument()
  })

  it('counts every rapid click through multiple loops', () => {
    vi.useFakeTimers()
    render(<PortraitReel images={images} label="Portrait gallery" />)
    const next = screen.getByRole('button', { name: 'Next photo' })
    for (let index = 0; index < 10; index++) fireEvent.click(next)
    expect(screen.getByText('02 / 03')).toBeInTheDocument()
    for (let index = 1; index < 10; index++) {
      act(() => vi.advanceTimersByTime(700))
      act(() => vi.advanceTimersByTime(32))
      expect(screen.getByText(`${String((index + 1) % 3 + 1).padStart(2, '0')} / 03`)).toBeInTheDocument()
    }
    act(() => vi.advanceTimersByTime(700))
    expect(screen.getByText('02 / 03')).toBeInTheDocument()
    expect(document.querySelector('.portrait-reel__track')).toHaveAttribute('data-moving', 'false')
  })

  it('preserves the order of rapid forward and backward clicks', () => {
    vi.useFakeTimers()
    render(<PortraitReel images={images} label="Portrait gallery" />)
    for (const direction of ['Next', 'Next', 'Previous', 'Previous']) {
      fireEvent.click(screen.getByRole('button', { name: `${direction} photo` }))
    }
    for (const expected of ['03 / 03', '02 / 03', '01 / 03']) {
      act(() => vi.advanceTimersByTime(700))
      act(() => vi.advanceTimersByTime(32))
      expect(screen.getByText(expected)).toBeInTheDocument()
    }
  })

  it('applies rapid clicks immediately when reduced motion is preferred', () => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    vi.spyOn(window, 'matchMedia').mockReturnValue({ ...preference, matches: true })
    render(<PortraitReel images={images} label="Portrait gallery" />)
    for (let index = 0; index < 10; index++) {
      fireEvent.click(screen.getByRole('button', { name: 'Next photo' }))
    }
    expect(screen.getByText('02 / 03')).toBeInTheDocument()
    expect(document.querySelector('.portrait-reel__track')).toHaveAttribute('data-moving', 'false')
  })

  it('handles empty and single-photo galleries without playback controls', () => {
    const { rerender } = render(<PortraitReel images={[]} label="Portrait gallery" />)
    expect(screen.getByText(/add photos/i)).toBeInTheDocument()
    rerender(<PortraitReel images={[images[0]]} label="Portrait gallery" />)
    expect(screen.getAllByRole('img')).toHaveLength(1)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('supports a manual reel without autoplay or playback controls', () => {
    vi.useFakeTimers()
    render(<PortraitReel images={images} label="About gallery" autoplayIntervalMs={0} />)
    expect(screen.queryByRole('button', { name: /slideshow/i })).not.toBeInTheDocument()
    act(() => vi.advanceTimersByTime(15000))
    expect(screen.getByText('01 / 03')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Next photo' }))
    expect(screen.getByText('02 / 03')).toBeInTheDocument()
  })
})
