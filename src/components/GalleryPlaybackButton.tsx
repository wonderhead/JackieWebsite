import { Pause, Play } from 'lucide-react'

interface GalleryPlaybackButtonProps {
  paused: boolean
  onToggle: () => void
}

export function GalleryPlaybackButton({ paused, onToggle }: GalleryPlaybackButtonProps) {
  return (
    <button
      type="button"
      className="gallery-control"
      aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}
      onClick={onToggle}
    >
      {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
    </button>
  )
}
