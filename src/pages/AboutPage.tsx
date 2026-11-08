import aboutPortrait from '../assets/site-images/about/about-intro-portrait.jpg'
import teachingPhoto from '../assets/site-images/about/about-story-gallery/09-teaching-class.webp'
import { PortraitReel } from '../components/PortraitReel'
import { HowdyWave } from '../components/HowdyWave'
import { siteContent } from '../content/siteContent'
import { aboutGallery } from '../lib/images'

function renderEmphasis(text: string) {
  return text.split('**').map((part, index) =>
    index % 2 === 1 ? <strong key={`${part}-${index}`}>{part}</strong> : part,
  )
}

export function AboutPage() {
  const { about } = siteContent

  return (
    <div className="about-page">
      <h1 className="visually-hidden">{about.pageTitle}</h1>
      <section className="about-intro shell">
        <div className="about-intro__body">
          <HowdyWave text={about.waveText} />
          <figure className="about-intro__portrait" data-reveal="left">
            <div className="about-intro__portrait-frame">
              <img src={aboutPortrait} alt="Jacqueline smiling in a studio portrait" />
            </div>
          </figure>

          <div className="about-copy about-copy--intro" data-reveal="right" data-reveal-delay="1">
            {about.intro.paragraphs.map((paragraph) => (
              <p key={paragraph}>{renderEmphasis(paragraph)}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="about-gallery-section" aria-label={about.galleryLabel}>
        <PortraitReel images={aboutGallery} label={about.galleryLabel} autoplayIntervalMs={0} />
      </section>

      <div className="wave-divider" aria-hidden="true" data-reveal="wave">
        <svg viewBox="0 0 1440 140" preserveAspectRatio="none">
          <path
            pathLength="1"
            d="M-20 82 C 250 -20, 450 10, 710 84 S 1130 180, 1460 44"
          />
        </svg>
      </div>

      <section className="about-story shell">
        <figure className="about-story__photo" data-reveal="left">
          <img
            src={teachingPhoto}
            alt="Jacqueline leading children through movement in a classroom"
            loading="lazy"
            width="958"
            height="641"
          />
          <figcaption>In the classroom</figcaption>
        </figure>
        <div className="about-copy" data-reveal="right" data-reveal-delay="1">
          <h2>{about.story.heading}</h2>
          {about.story.paragraphs.map((paragraph) => (
            <p key={paragraph}>{renderEmphasis(paragraph)}</p>
          ))}
        </div>
      </section>
    </div>
  )
}
