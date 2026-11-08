import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import homeHero from '../assets/site-images/home/home-hero.jpg'
import { siteContent } from '../content/siteContent'

export function HomePage() {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero__visual">
          <img
            className="home-hero__image"
            src={homeHero}
            alt="Jacqueline dancing against a soft pink studio backdrop"
            fetchPriority="high"
          />
        </div>
        <div className="home-hero__content shell">
          <h1>{siteContent.home.title}</h1>
          <p className="home-hero__tagline">{siteContent.brand.tagline}</p>
          <div className="home-hero__actions">
            <Link className="text-link" to="/media">
              Explore the work <ArrowRight aria-hidden="true" />
            </Link>
            <Link className="text-link text-link--quiet" to="/contact">
              Start a conversation
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
