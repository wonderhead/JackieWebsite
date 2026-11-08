import { Carousel } from '../components/Carousel'
import { PageHeading } from '../components/PageHeading'
import { PortraitReel } from '../components/PortraitReel'
import { VideoCard } from '../components/VideoCard'
import { siteContent } from '../content/siteContent'
import { performanceGallery, portraitGallery } from '../lib/images'

export function MediaPage() {
  const { media } = siteContent

  return (
    <div className="media-page">
      <PageHeading
        eyebrow={media.eyebrow}
        title={media.heading}
      />

      <section className="videos-section shell">
        <div className="section-heading section-heading--compact">
          <p className="eyebrow" data-reveal="up">Press play</p>
          <h2 data-reveal="up" data-reveal-delay="1">{media.videosHeading}</h2>
        </div>
        <div className="video-grid">
          {media.videos.map((video, index) => (
            <VideoCard key={video.title} video={video} number={index + 1} />
          ))}
        </div>
      </section>

      <section className="media-gallery-section">
        <div className="section-heading shell">
          <p className="eyebrow" data-reveal="up">Production stills</p>
          <h2 data-reveal="up" data-reveal-delay="1">{media.performanceGalleryHeading}</h2>
        </div>
        <Carousel
          images={performanceGallery}
          label="Performance photograph gallery"
          className="carousel--wide carousel--performance"
          autoplayIntervalMs={3000}
          controlsBelow
        />
      </section>

      <section className="media-gallery-section media-gallery-section--blush">
        <div className="section-heading shell">
          <p className="eyebrow" data-reveal="up">Studio moments</p>
          <h2 data-reveal="up" data-reveal-delay="1">{media.portraitGalleryHeading}</h2>
        </div>
        <PortraitReel
          images={portraitGallery}
          label="Portrait and dance photograph gallery"
        />
      </section>
    </div>
  )
}
