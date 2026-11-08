import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { VideoCard } from './VideoCard'

describe('VideoCard', () => {
  it('shows a useful placeholder when no URL is configured', () => {
    render(<VideoCard number={1} video={{ title: 'Vocal reel', url: '' }} />)
    expect(screen.getByText(/video coming soon/i)).toBeInTheDocument()
    expect(screen.queryByTitle('Vocal reel')).not.toBeInTheDocument()
  })

  it('uses the YouTube privacy-enhanced host', () => {
    render(
      <VideoCard
        number={1}
        video={{ title: 'Dance reel', url: 'https://www.youtube.com/watch?v=abc123' }}
      />,
    )
    expect(screen.getByTitle('Dance reel')).toHaveAttribute(
      'src',
      'https://www.youtube-nocookie.com/embed/abc123',
    )
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    expect(screen.queryByText('Dance reel')).not.toBeInTheDocument()
  })
})
