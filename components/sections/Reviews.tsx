'use client'

import { useEffect, useMemo, useState } from 'react'
import { useLang } from '@/context/LangContext'

type ReviewItem = {
  id: string
  author: string
  rating: number
  dateDe: string
  dateEn: string
  textDe: string
  textEn: string
  photoUrl?: string
}

type ReviewsApiResponse = {
  source?: 'google' | 'disabled' | 'error' | 'not_found'
  placeName?: string
  mapsUrl?: string
  rating?: number
  totalRatings?: number
  reviews?: Array<{
    id: string
    author: string
    rating: number
    relativeTime: string
    text: string
    photoUrl?: string
  }>
}

const GOOGLE_REVIEWS_URL = 'https://www.google.com/maps/place/%22neue+Liebe%22/@51.2856544,11.5818821,17z/data=!4m17!1m8!3m7!1s0x47a42886f0110f3f:0x76e901eaadd6debc!2sWetzendorfer+Str.+10,+06642+Nebra+(Unstrut)!3b1!8m2!3d51.2857281!4d11.5818776!16s%2Fg%2F11c2y7c19l!3m7!1s0x47a42886f05ae6eb:0x5fd95f327b4db75d!8m2!3d51.2857533!4d11.5818297!9m1!1b1!16s%2Fg%2F1tp0cpfp?entry=ttu&g_ep=EgoyMDI2MDMxOC4xIKXMDSoASAFQAw%3D%3D'

const FALLBACK_REVIEWS: ReviewItem[] = [
  {
    id: 'christian-mueller',
    author: 'Christian Müller',
    rating: 5,
    dateDe: 'vor 5 Monaten',
    dateEn: '5 months ago',
    textDe:
      'Ein richtig tolles neues Gartenlokal. Man spürt sofort, wie viel Herzblut hier drin steckt. Nicht nur in das Lokal selbst, sondern in die ganze Region.',
    textEn:
      'A truly wonderful new garden restaurant. You immediately feel how much passion has gone into this place and the whole region.',
  },
  {
    id: 'silli-john',
    author: 'Silli John',
    rating: 5,
    dateDe: 'vor 2 Monaten',
    dateEn: '2 months ago',
    textDe:
      'Ein gemütliches Lokal, sehr schmackhaftes Essen und freundliche Bedienung. Es ist zu empfehlen, ich komme auf jeden Fall wieder.',
    textEn:
      'A cozy place, very tasty food and friendly service. Highly recommended, I will definitely come back.',
  },
  {
    id: 'patrick-mueller',
    author: 'Patrick Müller',
    rating: 5,
    dateDe: 'vor 4 Monaten',
    dateEn: '4 months ago',
    textDe:
      'Eine sehr schöne Location. Die Einrichtung ist urig und modern, die Bedienung sehr freundlich und das Essen hervorragend. Sehr zu empfehlen.',
    textEn:
      'A very beautiful location. The interior is both rustic and modern, service is very friendly and the food is excellent. Highly recommended.',
  },
  {
    id: 'diana-wende',
    author: 'Diana Wende',
    rating: 4,
    dateDe: 'vor 2 Monaten',
    dateEn: '2 months ago',
    textDe:
      'Ich war das erste Mal da, es war sehr schön. Keine ganz ruhige Kneipe mit Kamin, man kann gemütlich sitzen. Das Essen ist super lecker und das Personal sehr nett.',
    textEn:
      'I visited for the first time and it was very nice. Cozy seating, super tasty food and very kind staff.',
  },
  {
    id: 'carola-seidel',
    author: 'Carola Seidel',
    rating: 5,
    dateDe: 'vor 2 Wochen',
    dateEn: '2 weeks ago',
    textDe:
      'Sehr nette und freundliche Bedienung, sehr leckeres und reichhaltiges Essen. Wir sind aus Leipzig im Kurzurlaub und kommen sicher wieder.',
    textEn:
      'Very nice and friendly service, very tasty and generous meals. We are visiting from Leipzig and will definitely return.',
  },
  {
    id: 'martin',
    author: 'Martin',
    rating: 5,
    dateDe: 'vor 5 Monaten',
    dateEn: '5 months ago',
    textDe:
      'Genau das, was Nebra gebraucht hat. Gute Qualität beim Essen in wunderschöner Atmosphäre und zu fairem Preis. Definitiv einen Besuch wert.',
    textEn:
      'Exactly what Nebra needed. Great food quality in a beautiful atmosphere at a fair price. Definitely worth a visit.',
  },
]

function stars(rating: number): string {
  const full = Math.max(0, Math.min(5, Math.round(rating)))
  return `${'★'.repeat(full)}${'☆'.repeat(5 - full)}`
}

export default function Reviews() {
  const { lang, t } = useLang()
  const [reviews, setReviews] = useState<ReviewItem[]>(FALLBACK_REVIEWS)
  const [averageRating, setAverageRating] = useState<number>(4.9)
  const [totalRatings, setTotalRatings] = useState<number>(reviews.length)

  useEffect(() => {
    let isCancelled = false

    async function loadReviews() {
      try {
        const response = await fetch(`/api/reviews?lang=${lang}`, { cache: 'no-store' })
        if (!response.ok) return

        const payload = (await response.json().catch(() => ({}))) as ReviewsApiResponse
        if (isCancelled) return

        if (typeof payload.rating === 'number' && Number.isFinite(payload.rating)) {
          setAverageRating(payload.rating)
        }
        if (typeof payload.totalRatings === 'number' && payload.totalRatings > 0) {
          setTotalRatings(payload.totalRatings)
        }

        if (Array.isArray(payload.reviews) && payload.reviews.length > 0) {
          setReviews(
            payload.reviews.slice(0, 7).map((item, index) => ({
              id: item.id || `${item.author}-${index + 1}`,
              author: item.author,
              rating: item.rating,
              dateDe: item.relativeTime,
              dateEn: item.relativeTime,
              textDe: item.text,
              textEn: item.text,
              photoUrl: item.photoUrl,
            }))
          )
        }
      } catch (error) {
        console.error('[Reviews] Failed to load Google reviews', error)
      }
    }

    void loadReviews()

    return () => {
      isCancelled = true
    }
  }, [lang])

  const topReviews = useMemo(() => reviews.slice(0, 7), [reviews])

  return (
    <section id="reviews" className="reviews-section">
      <div className="reviews-container">
        <div className="section-header-center reveal" style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 2.4rem' }}>
          <p className="section-label" style={{ color: 'var(--gold)' }}>
            {t('Stimmen unserer Gäste', 'Guest Reviews')}
          </p>
          <h2 className="section-title" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.9rem)', color: 'var(--charcoal)' }}>
            {t('Google Bewertungen', 'Google Reviews')}
          </h2>
        </div>

        <div className="reviews-meta reveal">
          <div className="reviews-rating-pill">
            <span className="reviews-rating-score">{averageRating.toFixed(1)}</span>
            <span className="reviews-rating-stars">{stars(averageRating)}</span>
            <span className="reviews-rating-count">
              {t(`${totalRatings} Bewertungen`, `${totalRatings} reviews`)}
            </span>
          </div>

          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noreferrer"
            className="reviews-google-link"
          >
            {t('Alle Bewertungen auf Google', 'See all reviews on Google')}
          </a>
        </div>

        <div className="reviews-grid">
          {topReviews.map((review) => (
            <article key={review.id} className="review-card reveal">
              <header className="review-head">
                <span className="review-avatar" aria-hidden="true">
                  {review.photoUrl ? (
                    <img src={review.photoUrl} alt="" loading="lazy" />
                  ) : (
                    review.author.charAt(0).toUpperCase()
                  )}
                </span>

                <div>
                  <h3 className="review-author">{review.author}</h3>
                  <p className="review-date">{t(review.dateDe, review.dateEn)}</p>
                </div>
              </header>

              <div className="review-stars" aria-label={`${review.rating} / 5`}>
                {stars(review.rating)}
              </div>

              <p className="review-text">{t(review.textDe, review.textEn)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
