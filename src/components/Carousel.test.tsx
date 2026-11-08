import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Carousel } from './Carousel'

const images = [
  { src: '/one.jpg', alt: 'First performance', filename: '01-first.jpg' },
  { src: '/two.jpg', alt: 'Second performance', filename: '02-second.jpg' },
  { src: '/three.jpg', alt: 'Third performance', filename: '03-third.jpg' },
]

afterEach(() => vi.useRealTimers())

describe('Carousel', () => {
  it('only advances automatically when an interval is explicitly supplied', () => {
    vi.useFakeTimers()
    const { rerender } = render(<Carousel images={images} label="Test gallery" />)
    act(() => vi.advanceTimersByTime(10000))
    expect(screen.getByText('01 / 03')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /pause slideshow/i })).not.toBeInTheDocument()
    rerender(<Carousel images={images} label="Test gallery" autoplayIntervalMs={3000} controlsBelow />)
    act(() => vi.advanceTimersByTime(2999))
    expect(screen.getByText('01 / 03')).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(1))
    expect(screen.getByText('02 / 03')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /pause slideshow/i })).toBeInTheDocument()
  })

  it('supports button and keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<Carousel images={images} label="Test gallery" />)

    expect(screen.getByText('01 / 03')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /next photo/i }))
    expect(screen.getByText('02 / 03')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /second performance/i }).closest('figure')).toHaveClass(
      'carousel__slide--enter-next',
    )

    screen.getByRole('region', { name: /test gallery/i }).focus()
    await user.keyboard('{ArrowLeft}')
    expect(screen.getByText('01 / 03')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /first performance/i }).closest('figure')).toHaveClass(
      'carousel__slide--enter-previous',
    )
  })

  it('uses directional motion for dots, swipes, and wraparound navigation', async () => {
    const user = userEvent.setup()
    render(<Carousel images={images} label="Test gallery" />)

    await user.click(screen.getByRole('button', { name: /show photo 3/i }))
    expect(screen.getByRole('img', { name: /third performance/i }).closest('figure')).toHaveClass(
      'carousel__slide--enter-next',
    )

    await user.click(screen.getByRole('button', { name: /next photo/i }))
    expect(screen.getByRole('img', { name: /first performance/i }).closest('figure')).toHaveClass(
      'carousel__slide--enter-next',
    )

    await user.click(screen.getByRole('button', { name: /previous photo/i }))
    expect(screen.getByRole('img', { name: /third performance/i }).closest('figure')).toHaveClass(
      'carousel__slide--enter-previous',
    )

    const carousel = screen.getByRole('region', { name: /test gallery/i })
    fireEvent.touchStart(carousel, { touches: [{ clientX: 240 }] })
    fireEvent.touchEnd(carousel, { changedTouches: [{ clientX: 140 }] })

    expect(screen.getByRole('img', { name: /first performance/i }).closest('figure')).toHaveClass(
      'carousel__slide--enter-next',
    )
  })
})
