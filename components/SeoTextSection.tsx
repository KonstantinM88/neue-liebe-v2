'use client'

type SeoTextItem = {
  title: string
  text: string
}

type SeoTextSectionProps = {
  eyebrow: string
  title: string
  lead: string
  items: SeoTextItem[]
  theme?: 'light' | 'dark'
}

export default function SeoTextSection({
  eyebrow,
  title,
  lead,
  items,
  theme = 'light',
}: SeoTextSectionProps) {
  return (
    <section className={`seo-copy-section seo-copy-section--${theme}`}>
      <div className="seo-copy-shell">
        <div className="seo-copy-intro">
          <p className="section-label seo-copy-label">{eyebrow}</p>
          <h2 className="section-title seo-copy-title">{title}</h2>
          <p className="seo-copy-lead">{lead}</p>
        </div>

        <div className="seo-copy-grid">
          {items.map((item) => (
            <article key={item.title} className="seo-copy-card">
              <h3 className="seo-copy-card-title">{item.title}</h3>
              <p className="seo-copy-card-text">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
