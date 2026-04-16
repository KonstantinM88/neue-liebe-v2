import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

type GoogleTextSearchResponse = {
  status?: string
  results?: Array<{ place_id?: string }>
  error_message?: string
}

type GoogleDetailsReview = {
  author_name?: string
  profile_photo_url?: string
  rating?: number
  relative_time_description?: string
  text?: string
  time?: number
}

type GooglePlaceDetailsResponse = {
  status?: string
  result?: {
    name?: string
    url?: string
    rating?: number
    user_ratings_total?: number
    reviews?: GoogleDetailsReview[]
  }
  error_message?: string
}

function normalizeLang(input: string | null): 'de' | 'en' {
  return input === 'en' ? 'en' : 'de'
}

function truncateText(value: string, maxLength: number): string {
  const normalized = String(value ?? '').trim().replace(/\s+/g, ' ')
  if (normalized.length <= maxLength) return normalized
  return `${normalized.slice(0, maxLength - 1)}…`
}

async function fetchPlaceId(apiKey: string, query: string, language: 'de' | 'en'): Promise<string | null> {
  const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json')
  url.searchParams.set('query', query)
  url.searchParams.set('language', language)
  url.searchParams.set('key', apiKey)

  const response = await fetch(url.toString(), { next: { revalidate: 1800 } })
  if (!response.ok) return null

  const payload = (await response.json().catch(() => ({}))) as GoogleTextSearchResponse
  if (payload.status !== 'OK' || !Array.isArray(payload.results) || payload.results.length === 0) {
    return null
  }

  return payload.results[0].place_id ?? null
}

export async function GET(req: NextRequest) {
  const language = normalizeLang(req.nextUrl.searchParams.get('lang'))
  const apiKey = process.env.GOOGLE_MAPS_API_KEY?.trim()

  if (!apiKey) {
    return NextResponse.json({ source: 'disabled', reviews: [] })
  }

  try {
    let placeId = process.env.GOOGLE_PLACE_ID?.trim() || ''
    const placeQuery = process.env.GOOGLE_PLACE_QUERY?.trim() || 'Neue Liebe Nebra'

    if (!placeId) {
      const discovered = await fetchPlaceId(apiKey, placeQuery, language)
      if (!discovered) {
        return NextResponse.json({ source: 'not_found', reviews: [] })
      }
      placeId = discovered
    }

    const detailsUrl = new URL('https://maps.googleapis.com/maps/api/place/details/json')
    detailsUrl.searchParams.set('place_id', placeId)
    detailsUrl.searchParams.set('language', language)
    detailsUrl.searchParams.set('reviews_sort', 'newest')
    detailsUrl.searchParams.set('fields', 'name,url,rating,user_ratings_total,reviews')
    detailsUrl.searchParams.set('key', apiKey)

    const response = await fetch(detailsUrl.toString(), { next: { revalidate: 900 } })
    if (!response.ok) {
      return NextResponse.json({ source: 'error', reviews: [] })
    }

    const payload = (await response.json().catch(() => ({}))) as GooglePlaceDetailsResponse
    if (payload.status !== 'OK' || !payload.result) {
      return NextResponse.json({ source: 'error', reviews: [] })
    }

    const mappedReviews = (payload.result.reviews ?? [])
      .filter((item) => typeof item.text === 'string' && typeof item.author_name === 'string')
      .slice(0, 7)
      .map((item, index) => ({
        id: `${item.author_name}-${item.time ?? index}`,
        author: item.author_name ?? 'Google User',
        rating: Number.isFinite(item.rating) ? Number(item.rating) : 5,
        relativeTime: item.relative_time_description ?? '',
        text: truncateText(item.text ?? '', 420),
        photoUrl: item.profile_photo_url,
      }))

    return NextResponse.json(
      {
        source: 'google',
        placeName: payload.result.name ?? 'Neue Liebe',
        mapsUrl: payload.result.url,
        rating: payload.result.rating ?? null,
        totalRatings: payload.result.user_ratings_total ?? null,
        reviews: mappedReviews,
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=300, s-maxage=900, stale-while-revalidate=3600',
        },
      }
    )
  } catch (error) {
    console.error('[GET /api/reviews]', error)
    return NextResponse.json({ source: 'error', reviews: [] })
  }
}
