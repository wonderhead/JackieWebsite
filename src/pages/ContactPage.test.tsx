import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ContactPage } from './ContactPage'
import * as mailto from '../lib/mailto'

afterEach(() => {
  vi.restoreAllMocks()
  window.history.replaceState(null, '', '/')
})

describe('ContactPage', () => {
  it('validates required fields before opening an email draft', async () => {
    const user = userEvent.setup()
    render(<ContactPage />)

    await user.click(screen.getByRole('button', { name: /open email draft/i }))

    expect(screen.getByText(/enter your first name/i)).toBeInTheDocument()
    expect(screen.getByText(/enter your last name/i)).toBeInTheDocument()
    expect(screen.getByText(/enter a valid email address/i)).toBeInTheDocument()
    expect(screen.getByText(/tell Jacqueline a little/i)).toBeInTheDocument()
  })

  it('opens a draft to Jacqueline with the completed visitor details', async () => {
    const user = userEvent.setup()
    // Use a local fragment to inspect the handoff without launching an email client.
    const buildDraft = vi.spyOn(mailto, 'buildMailtoUrl').mockReturnValue('#contact-draft')
    render(<ContactPage />)
    await user.type(screen.getByRole('textbox', { name: /first name/i }), 'Avery')
    await user.type(screen.getByRole('textbox', { name: /last name/i }), 'Stone')
    await user.type(screen.getByRole('textbox', { name: /email address/i }), 'avery@example.com')
    await user.type(screen.getByRole('textbox', { name: /message/i }), 'A dance & theatre project.')
    await user.click(screen.getByRole('button', { name: /open email draft/i }))

    expect(buildDraft).toHaveBeenCalledWith('Jackie.trinh.juarez@gmail.com', 'Portfolio inquiry', {
      firstName: 'Avery',
      lastName: 'Stone',
      email: 'avery@example.com',
      message: 'A dance & theatre project.',
    })
    expect(window.location.hash).toBe('#contact-draft')
  })
})
