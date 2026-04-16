import type { ReactNode } from 'react'

export type FaqItem = {
  question: string
  answer: string | ReactNode
}

type FaqSectionProps = {
  eyebrow: string
  title: string
  lead: string
  items: FaqItem[]
  theme?: 'light' | 'dark'
}

export default function FaqSection({
  eyebrow,
  title,
  lead,
  items,
  theme = 'light',
}: FaqSectionProps) {
  return (
    <section className={`faq-section faq-section--${theme}`}>
      <div className="faq-shell">
        <div className="faq-intro reveal">
          <p className="section-label faq-label">{eyebrow}</p>
          <h2 className="section-title faq-title">{title}</h2>
          <p className="faq-lead">{lead}</p>
        </div>

        <div className="faq-list">
          {items.map((item, index) => (
            <article
              key={item.question}
              className="faq-item reveal"
              style={{ transitionDelay: `${index * 0.08}s` }}
            >
              <h3 className="faq-question">{item.question}</h3>
              <div className="faq-answer">{item.answer}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
