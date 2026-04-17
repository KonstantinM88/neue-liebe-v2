import styles from './SeoTextSection.module.css'

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
  const themeClass = theme === 'dark' ? styles.dark : styles.light

  return (
    <section className={`${styles.section} ${themeClass}`}>
      <div className={styles.shell}>
        <div className={styles.intro}>
          <p className={`section-label ${styles.label}`}>{eyebrow}</p>
          <h2 className={`section-title ${styles.title}`}>{title}</h2>
          <p className={styles.lead}>{lead}</p>
        </div>

        <div className={styles.grid}>
          {items.map((item) => (
            <article key={item.title} className={styles.card}>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardText}>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
