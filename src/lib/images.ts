export interface GalleryImage {
  src: string
  alt: string
  filename: string
}

function filenameFromPath(path: string) {
  return path.split('/').pop() ?? path
}

export function altFromFilename(path: string) {
  const filename = filenameFromPath(path)
  const withoutExtension = filename.replace(/\.[^.]+$/, '')
  const withoutOrder = withoutExtension.replace(/^\d+[-_ ]*/, '')
  const readable = withoutOrder.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim()

  if (!readable) return 'Portfolio photograph'
  return readable.charAt(0).toUpperCase() + readable.slice(1)
}

export function galleryFromModules(modules: Record<string, string>): GalleryImage[] {
  return Object.entries(modules)
    .sort(([first], [second]) => first.localeCompare(second, undefined, { numeric: true }))
    .map(([path, src]) => ({
      src,
      alt: altFromFilename(path),
      filename: filenameFromPath(path),
    }))
}

const aboutModules = import.meta.glob<string>(
  '/src/assets/site-images/about/about-story-gallery/*.{jpg,jpeg,png,webp,avif}',
  { eager: true, query: '?url', import: 'default' },
)

const performanceModules = import.meta.glob<string>(
  '/src/assets/site-images/media/performance-gallery/*.{jpg,jpeg,png,webp,avif}',
  { eager: true, query: '?url', import: 'default' },
)

const portraitModules = import.meta.glob<string>(
  '/src/assets/site-images/media/portrait-dance-gallery/*.{jpg,jpeg,png,webp,avif}',
  { eager: true, query: '?url', import: 'default' },
)

export const aboutGallery = galleryFromModules(aboutModules)
export const performanceGallery = galleryFromModules(performanceModules)
export const portraitGallery = galleryFromModules(portraitModules)
