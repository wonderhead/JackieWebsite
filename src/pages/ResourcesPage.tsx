import { ArrowDownToLine, ArrowUpRight, FileText } from 'lucide-react'
import primaryHeadshot from '../assets/site-images/headshot-resume/primary-headshot.jpg'
import alternateHeadshot from '../assets/site-images/headshot-resume/alternate-headshot.jpg'
import resumePreview from '../assets/site-images/headshot-resume/resume-preview.jpg'
import { PageHeading } from '../components/PageHeading'
import { siteContent } from '../content/siteContent'
import { publicAsset } from '../lib/paths'

interface ResourceCardProps {
  title: string
  type: string
  href: string
  preview?: string
  downloadName: string
  revealDelay: number
}

function ResourceCard({ title, type, href, preview, downloadName, revealDelay }: ResourceCardProps) {
  return (
    <article className="resource-card" data-reveal="up" data-reveal-delay={revealDelay}>
      <a
        className="resource-card__preview"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${title} in a new tab`}
      >
        {preview ? (
          <img src={preview} alt={`${title} preview`} loading="lazy" decoding="async" />
        ) : (
          <div className="resource-card__document">
            <FileText aria-hidden="true" />
            <span>PDF</span>
            <p>Resume placeholder</p>
          </div>
        )}
        <span className="resource-card__open" aria-hidden="true">
          <ArrowUpRight />
        </span>
      </a>
      <div className="resource-card__details">
        <div>
          <p>{type}</p>
          <h2>{title}</h2>
        </div>
        <a className="resource-card__download" href={href} download={downloadName}>
          <ArrowDownToLine aria-hidden="true" /> Download
        </a>
      </div>
    </article>
  )
}

export function ResourcesPage() {
  const { resources } = siteContent
  const resumeUrl = publicAsset(resources.resumePath)

  return (
    <div className="resources-page">
      <PageHeading
        eyebrow={resources.eyebrow}
        title={resources.heading}
        introduction={resources.introduction}
      />

      <section className="resource-grid shell" aria-label="Downloadable press materials">
        <ResourceCard
          title={resources.resumeLabel}
          type="PDF document"
          href={resumeUrl}
          preview={resumePreview}
          downloadName="jacqueline-trinh-juarez-resume.pdf"
          revealDelay={0}
        />
        <ResourceCard
          title={resources.primaryHeadshotLabel}
          type="High-resolution photograph"
          href={primaryHeadshot}
          preview={primaryHeadshot}
          downloadName="jacqueline-trinh-juarez-primary-headshot.jpg"
          revealDelay={1}
        />
        <ResourceCard
          title={resources.alternateHeadshotLabel}
          type="High-resolution photograph"
          href={alternateHeadshot}
          preview={alternateHeadshot}
          downloadName="jacqueline-trinh-juarez-alternate-headshot.jpg"
          revealDelay={2}
        />
      </section>
    </div>
  )
}
