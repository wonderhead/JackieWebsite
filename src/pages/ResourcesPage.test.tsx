import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ResourcesPage } from './ResourcesPage'

describe('ResourcesPage', () => {
  it('opens resource previews in new tabs and exposes downloads', () => {
    render(<ResourcesPage />)

    const openLinks = screen.getAllByRole('link', { name: /open .* in a new tab/i })
    expect(openLinks).toHaveLength(3)
    openLinks.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })

    const downloadLinks = screen.getAllByRole('link', { name: /download/i })
    expect(downloadLinks).toHaveLength(3)
    downloadLinks.forEach((link) => expect(link).toHaveAttribute('download'))
    expect(downloadLinks[0].getAttribute('href')).toContain(
      'downloads/jacqueline-trinh-juarez-resume.pdf',
    )
  })
})
