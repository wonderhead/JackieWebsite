interface PageHeadingProps {
  eyebrow: string
  title: string
  introduction?: string
}

export function PageHeading({ eyebrow, title, introduction }: PageHeadingProps) {
  return (
    <header className="page-heading shell">
      <p className="eyebrow" data-reveal="up">{eyebrow}</p>
      <h1 data-reveal="up" data-reveal-delay="1">{title}</h1>
      {introduction && (
        <p className="page-heading__introduction" data-reveal="up" data-reveal-delay="2">
          {introduction}
        </p>
      )}
    </header>
  )
}
