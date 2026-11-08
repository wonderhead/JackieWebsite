import { ArrowUpRight, Camera } from 'lucide-react'
import { siteContent } from '../content/siteContent'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__spotlight" data-reveal="spotlight" aria-hidden="true" />
      <div className="site-footer__content shell">
        <div data-reveal="up">
          <p className="eyebrow">Get in touch</p>
          <h2>{siteContent.footer.heading}</h2>
          <p>{siteContent.footer.note}</p>
        </div>
        <div className="site-footer__links" data-reveal="up" data-reveal-delay="1">
          <a href={`mailto:${siteContent.contact.recipientEmail}`}>
            <span>{siteContent.contact.displayedEmail}</span>
            <ArrowUpRight className="site-footer__link-arrow" aria-hidden="true" size={18} />
          </a>
          <a
            href={siteContent.social.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Camera aria-hidden="true" size={20} />
            <span>{siteContent.social.instagramLabel}</span>
            <ArrowUpRight className="site-footer__link-arrow" aria-hidden="true" size={18} />
          </a>
        </div>
      </div>
      <div className="site-footer__bottom shell" data-reveal="up">
        <span>© {new Date().getFullYear()} {siteContent.brand.name}</span>
        <span>Designed for the stage and every screen.</span>
      </div>
    </footer>
  )
}
