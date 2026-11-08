import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="not-found shell">
      <p className="eyebrow" data-reveal="up">404 · Intermission</p>
      <h1 data-reveal="up" data-reveal-delay="1">This page missed its cue.</h1>
      <p data-reveal="up" data-reveal-delay="2">
        The page you’re looking for may have moved, but the show goes on.
      </p>
      <Link className="text-link" to="/" data-reveal="up" data-reveal-delay="3">
        <ArrowLeft aria-hidden="true" /> Return home
      </Link>
    </section>
  )
}
