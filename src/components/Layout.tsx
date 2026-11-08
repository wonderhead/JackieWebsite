import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Footer } from './Footer'
import { Header } from './Header'
import { siteContent } from '../content/siteContent'
import { useScrollReveal } from '../lib/useScrollReveal'

export function Layout() {
  const { pathname } = useLocation()

  useScrollReveal(pathname)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    document.title = siteContent.seo.title

    let description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!description) {
      description = document.createElement('meta')
      description.name = 'description'
      document.head.append(description)
    }
    description.content = siteContent.seo.description
  }, [pathname])

  return (
    <div className="site-frame">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
