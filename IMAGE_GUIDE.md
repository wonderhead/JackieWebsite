# Image and Download Guide

This site is designed so routine photo updates do not require code changes.

## Fixed images

Replace the existing file and keep its exact filename. JPG, PNG, WebP, and AVIF work for galleries, but fixed images should remain JPG unless a developer also updates the matching import.

| Exact file | Where it appears | Image guidance | What to do |
| --- | --- | --- | --- |
| `src/assets/site-images/home/home-hero.jpg` | Home page hero | Large full-body photo with a pink background; edges fade into the intro header beside the text, or below it on mobile | Replace the file |
| `src/assets/site-images/about/about-intro-portrait.jpg` | About page introduction | Original portrait proportions; pale background blends into the page with a pink box offset above and to the right | Replace the file |
| `src/assets/site-images/about/about-story-gallery/09-teaching-class.webp` | About page “Beyond the stage” photo and story gallery | Full classroom photo; no forced crop | Replace the file, or update the `teachingPhoto` import in `src/pages/AboutPage.tsx` to choose another image |
| `src/assets/site-images/headshot-resume/primary-headshot.jpg` | Primary headshot card | Complete portrait contained within the preview | Replace the file |
| `src/assets/site-images/headshot-resume/alternate-headshot.jpg` | Alternate headshot card | Complete portrait contained within the preview | Replace the file |
| `src/assets/site-images/headshot-resume/resume-preview.jpg` | Resume card | Complete resume image, matching the PDF download | Replace alongside the PDF |
| `src/assets/site-images/contact/contact-banner.jpg` | Contact introduction, beside the contact details | Original portrait proportions; no wide banner crop | Replace the file |

The source portfolio is **https://www.jacquelinetrinhjuarez.com/** (not jackietrinhjuarez.com). Its Home, About, Headshot/Resume, Media, and Contact pages were checked on November 7, 2026. The local images were initially refreshed from their direct Squarespace CDN URLs, at up to 2500 pixels wide without cropping or stretching. Smaller source images retain their original resolution. Fixed JPG imports are converted to JPEG where necessary; gallery files keep the format returned by the CDN.

The two Headshot/Resume photos now use the supplied originals: `Jacqueline Trinh-Juarez H.PNG` for the primary headshot and `Jacqueline Trinh-Juarez H (1).PNG` for the alternate. Despite their `.PNG` filenames, both originals contain JPEG data, so they are copied directly to the fixed `.jpg` paths without conversion or quality loss. Resource previews contain the complete image at its natural proportions inside matching 3:4 frames, with no trim, cropping, or stretching. Card labels and divider lines align across each row.

`src/assets/site-images/sources.json` records each local file's source page, original image URL, download URL, source and local dimensions, and SHA-256 checksum. It also records the three original YouTube links. Existing gallery order is preserved, with repeated source photos included only once per gallery. The former Home slideshow photos remain in `home/home-slideshow/` for reuse, but are no longer displayed or automatically loaded.

The complete image remains visible in each single-photo gallery using `object-fit: contain`. The connected portrait reel uses a shared image height and each photo's natural width; only neighboring photos at the screen edges are partially visible. Do not change images to `cover`, pre-crop the files, or stretch them to fill a frame: that cuts off dance poses, faces, or ensemble members. If photographer originals become available, replace the corresponding files without cropping them.

## Automatically populated galleries

Add or remove image files inside these folders. The site discovers them automatically during the next GitHub Pages build.

| Folder | Where it appears | Image guidance | Example filename |
| --- | --- | --- | --- |
| `src/assets/site-images/about/about-story-gallery/` | About continuous photo reel | Mixed editorial images | `02-teaching-workshop.jpg` |
| `src/assets/site-images/media/performance-gallery/` | Media “On stage” gallery | Full landscape stage photographs | `03-production-title.jpg` |
| `src/assets/site-images/media/portrait-dance-gallery/` | Media portraits gallery | Portrait or movement images | `04-studio-portrait.jpg` |

Files are displayed alphabetically. Start names with `01-`, `02-`, and so on to choose the order. The filename becomes fallback alt text, so use a short description instead of names like `IMG_1234.jpg`.

### Media gallery playback

The “On stage” slideshow shows one full photo at a time in a frame up to 960px wide and at most 640px or 75% of the screen height, with arrows and photo selectors below. The selectors stay on one row and shrink to fit narrow screens. The “Portraits & movement” reel shows connected photos at their original proportions, at most 420px or 55% of the screen height. Its height is further limited on narrow screens so the widest photo fits fully when centered.

The “On stage” gallery advances every three seconds; “Portraits & movement” advances every five seconds. Both loop and pause while hovered, keyboard-focused, offscreen, or in a hidden browser tab. Use the pause/play button to control playback. Manual navigation restarts each gallery’s countdown once interaction ends. Rapid portrait-reel clicks are queued and played in order, including across the loop boundary. Reduced-motion users start with autoplay paused and navigate immediately without animation.

The About gallery uses the same continuous reel as the Media studio photos, at up to 360px or half the screen height. Photos sit edge to edge at their natural proportions, with neighboring photos visible on either side. Click the arrows, use the keyboard arrow keys, or swipe to move through the loop. It stays manual, with no autoplay or pause/play button, and supports rapid clicks. Its height also adjusts on small screens so a wide photo fits fully when centered.

## Resume

1. Export the final resume as a PDF.
2. Name it `jacqueline-trinh-juarez-resume.pdf`.
3. Replace `public/downloads/jacqueline-trinh-juarez-resume.pdf`.
4. Do not change the filename; both View and Download will update automatically.
5. Update `src/assets/site-images/headshot-resume/resume-preview.jpg` to match.

The current PDF is the supplied `Jacqueline Trinh-Juarez Resume.pdf`, copied without modification. Its preview is rendered from the complete first page at three times the PDF's point dimensions. Replace both files together when a newer resume is available.

## Text, links, and video URLs

Edit `src/content/siteContent.ts` and search for `REPLACE_ME`. That single file contains the biography, public contact details, Instagram URL, YouTube URLs, and SEO copy.

The Media page now uses the original site's three YouTube embeds:

- “It won’t be long now” — In the Heights: https://www.youtube.com/watch?v=KSnRPCISxHU
- Dance Reel: https://www.youtube.com/watch?v=36nitiZI8Xs
- “Teddy Bear Hound Dog!” — Jacqueline Trinh-Juarez & Evan Williams: https://www.youtube.com/watch?v=GzMb1uuKseI

These play through YouTube's privacy-enhanced embed host, in one row above 640px and stacked on smaller screens. Site-added video titles, numbering, and external-link arrows are removed. YouTube may still display its own title overlays and playback controls. The source site publishes YouTube embeds rather than downloadable video files.
