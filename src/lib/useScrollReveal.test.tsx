import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useScrollReveal } from './useScrollReveal'

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = []

  readonly observed = new Set<Element>()
  disconnected = false

  constructor(private readonly callback: IntersectionObserverCallback) {
    MockIntersectionObserver.instances.push(this)
  }

  observe(element: Element) {
    this.observed.add(element)
  }

  unobserve(element: Element) {
    this.observed.delete(element)
  }

  disconnect() {
    this.disconnected = true
    this.observed.clear()
  }

  reveal(element: Element) {
    this.callback(
      [{ isIntersecting: true, target: element } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    )
  }
}

function RevealHarness() {
  useScrollReveal('test-route')
  return <div data-testid="reveal-target" data-reveal="up">Reveal me</div>
}

function setReducedMotion(matches: boolean) {
  vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

afterEach(() => {
  Reflect.deleteProperty(window, 'IntersectionObserver')
  MockIntersectionObserver.instances = []
  setReducedMotion(false)
})

describe('useScrollReveal', () => {
  it('reveals observed elements once they intersect and cleans up the observer', () => {
    Object.defineProperty(window, 'IntersectionObserver', {
      configurable: true,
      value: MockIntersectionObserver,
    })

    const { unmount } = render(<RevealHarness />)
    const target = screen.getByTestId('reveal-target')
    const observer = MockIntersectionObserver.instances[0]

    expect(observer.observed.has(target)).toBe(true)
    expect(target).not.toHaveClass('is-revealed')

    observer.reveal(target)

    expect(target).toHaveClass('is-revealed')
    expect(observer.observed.has(target)).toBe(false)

    unmount()
    expect(observer.disconnected).toBe(true)
  })

  it('shows content immediately when IntersectionObserver is unavailable', () => {
    render(<RevealHarness />)

    expect(screen.getByTestId('reveal-target')).toHaveClass('is-revealed')
  })

  it('shows content immediately when reduced motion is preferred', () => {
    setReducedMotion(true)
    Object.defineProperty(window, 'IntersectionObserver', {
      configurable: true,
      value: MockIntersectionObserver,
    })

    render(<RevealHarness />)

    expect(screen.getByTestId('reveal-target')).toHaveClass('is-revealed')
    expect(MockIntersectionObserver.instances).toHaveLength(0)
  })
})
