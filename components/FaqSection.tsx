import type { ReactNode } from 'react'
import styles from './FaqSection.module.css'

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
  const themeClass = theme === 'dark' ? styles.dark : styles.light

  return (
    <section className={`${styles.section} ${themeClass}`}>
      <div className={styles.shell}>
        <div className={`${styles.intro} reveal`}>
          <p className={`section-label ${styles.label}`}>{eyebrow}</p>
          <h2 className={`section-title ${styles.title}`}>{title}</h2>
          <p className={styles.lead}>{lead}</p>
        </div>

        <div className={styles.list}>
          {items.map((item, index) => (
            <article
              key={item.question}
              className={`${styles.item} reveal`}
              style={{ transitionDelay: `${index * 0.08}s` }}
            >
              <h3 className={styles.question}>{item.question}</h3>
              <div className={styles.answer}>{item.answer}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
