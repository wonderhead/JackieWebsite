import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AppRoutes } from './App'

function renderRoute(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AppRoutes />
    </MemoryRouter>,
  )
}

describe('portfolio routes', () => {
  it.each([
    ['/', /howdy, i’m jacqueline/i],
    ['/about', /about jacqueline/i],
    ['/headshot-resume', /headshots & resume/i],
    ['/media', /^media$/i],
    ['/contact', /let’s make something lovely/i],
  ])('renders %s', (route, heading) => {
    renderRoute(route)
    expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument()
  })

  it('renders a friendly not-found route', () => {
    renderRoute('/missing-page')
    expect(screen.getByRole('heading', { name: /missed its cue/i })).toBeInTheDocument()
  })

  it('renders the biography and personal story on the About page', () => {
    renderRoute('/about')

    expect(screen.getByText('Jacqueline Trinh-Juarez', { selector: 'strong' })).toBeInTheDocument()
    expect(screen.getByText('Vietnamese-Mexican', { selector: 'strong' })).toBeInTheDocument()
    expect(screen.getByText(/singing in the children’s choir at church/i))
      .toBeInTheDocument()
    expect(screen.getByText(/mission trip in Honduras/i)).toBeInTheDocument()
  })
})
