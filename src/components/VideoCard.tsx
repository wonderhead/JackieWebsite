import { CirclePlay } from 'lucide-react'
import type { VideoItem } from '../content/siteContent'
import { getPrivacyEnhancedEmbedUrl } from '../lib/youtube'

interface VideoCardProps {
  video: VideoItem
  number: number
}

export function VideoCard({ video, number }: VideoCardProps) {
  const embedUrl = getPrivacyEnhancedEmbedUrl(video.url)

  return (
    <article className="video-card" data-reveal="up" data-reveal-delay={number - 1}>
      <div className="video-card__frame">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={video.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <div className="video-placeholder">
            <CirclePlay aria-hidden="true" />
            <p>Video coming soon</p>
            <span>Add a YouTube URL in siteContent.ts</span>
          </div>
        )}
      </div>
    </article>
  )
}
