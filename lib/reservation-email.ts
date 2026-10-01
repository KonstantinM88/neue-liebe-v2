import 'server-only'

import nodemailer from 'nodemailer'
import type { Reservation } from '@/generated/prisma/client'
import { Occasion } from '@/generated/prisma/enums'
import { createReservationConfirmationToken, reservationConfirmationUrl } from '@/lib/reservation-confirmation-token'
import { createReservationCancellationToken, reservationCancellationUrl } from '@/lib/reservation-cancellation-token'
import { canCancelReservation } from '@/lib/reservation-cancellation-policy'

export type ReservationNotificationStatus = 'sent' | 'not_configured' | 'failed'

const occasionLabels: Record<Occasion, string> = {
  [Occasion.DINNER]: 'Abendessen',
  [Occasion.BIRTHDAY]: 'Geburtstag',
  [Occasion.WEDDING]: 'Hochzeit',
  [Occasion.CORPORATE]: 'Firmenfeier',
  [Occasion.OTHER]: 'Sonstiges',
}

function getMailConfig() {
  if (process.env.MAIL_PROVIDER?.trim().toLowerCase() !== 'smtp') return null

  const host = process.env.SMTP_HOST?.trim()
  const port = Number(process.env.SMTP_PORT)
  const user = process.env.SMTP_USER?.trim()
  const pass = process.env.SMTP_PASSWORD
  const from = process.env.LEAD_NOTIFY_FROM?.trim() || process.env.SMTP_FROM?.trim()
  const secure = process.env.SMTP_SECURE?.trim().toLowerCase() === 'true'

  if (!host || !Number.isInteger(port) || port < 1 || port > 65535 || !user || !pass || !from) {
    return null
  }

  return { host, port, user, pass, from, secure }
}

function createTransport(config: NonNullable<ReturnType<typeof getMailConfig>>) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    requireTLS: !config.secure,
    auth: { user: config.user, pass: config.pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
  })
}

function formatDate(date: Date, locale = 'de-DE'): string {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character] ?? character)
}

export async function sendReservationNotification(
  reservation: Reservation,
  guestsLabel: string,
  origin: string
): Promise<ReservationNotificationStatus> {
  const config = getMailConfig()
  const to = process.env.LEAD_NOTIFY_TO?.trim()
  const token = createReservationConfirmationToken(reservation.id)
  if (!config || !to || !token) {
    console.error('[reservation notification] SMTP, recipients, or signing secret is not configured')
    return 'not_configured'
  }

  const transporter = createTransport(config)
  const date = formatDate(reservation.date)
  const confirmationUrl = reservationConfirmationUrl(origin, token)
  const detailRows = [
    ['Anfrage-ID', reservation.id],
    ['Datum', date],
    ['Uhrzeit', reservation.time],
    ['Personen', guestsLabel],
    ['Anlass', occasionLabels[reservation.occasion]],
    ['Name', `${reservation.firstName} ${reservation.lastName}`],
    ['E-Mail', reservation.email],
    ['Telefon', reservation.phone || 'Nicht angegeben'],
    ['Sprache', reservation.lang.toUpperCase()],
    ['Sonderwünsche', reservation.specialRequest || 'Keine'],
  ]

  try {
    const result = await transporter.sendMail({
      from: config.from,
      to,
      replyTo: reservation.email,
      subject: `Neue Liebe: Reservierungsanfrage für ${date} um ${reservation.time}`,
      html: [
        '<div style="font-family:Arial,sans-serif;line-height:1.6;color:#1a1714">',
        '<h1 style="font-size:24px">Neue Reservierungsanfrage</h1>',
        ...detailRows.map(([label, value]) => `<p style="margin:4px 0"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value).replace(/\n/g, '<br>')}</p>`),
        `<p><a href="${confirmationUrl}" style="display:inline-block;padding:14px 22px;background:#4a3728;color:#fff;text-decoration:none;border-radius:4px">Reservierung prüfen und bestätigen</a></p>`,
        '<p>Die Bestätigung erfolgt erst nach einem weiteren Klick auf der geöffneten Seite. Danach erhält der Gast eine E-Mail.</p>',
        '</div>',
      ].join(''),
      text: [
        'Neue Reservierungsanfrage über neueliebe-nebra.de',
        '',
        `Anfrage-ID: ${reservation.id}`,
        `Datum: ${date}`,
        `Uhrzeit: ${reservation.time}`,
        `Personen: ${guestsLabel}`,
        `Anlass: ${occasionLabels[reservation.occasion]}`,
        `Name: ${reservation.firstName} ${reservation.lastName}`,
        `E-Mail: ${reservation.email}`,
        `Telefon: ${reservation.phone || 'Nicht angegeben'}`,
        `Sprache: ${reservation.lang.toUpperCase()}`,
        '',
        'Sonderwünsche:',
        reservation.specialRequest || 'Keine',
        '',
        `Reservierung prüfen und bestätigen: ${confirmationUrl}`,
        'Die Bestätigung erfolgt erst nach einem weiteren Klick auf der geöffneten Seite.',
        '',
        'Die Anfrage ist noch nicht bestätigt.',
      ].join('\n'),
    })

    if (result.accepted.length === 0 || result.rejected.length > 0) {
      console.error('[reservation notification] SMTP did not accept all recipients')
      return 'failed'
    }

    return 'sent'
  } catch (error) {
    const code = error instanceof Error && 'code' in error
      ? String(error.code)
      : 'UNKNOWN'
    console.error('[reservation notification] SMTP delivery failed', { code })
    return 'failed'
  } finally {
    transporter.close()
  }
}

export async function sendReservationRequestReceivedEmail(
  reservation: Reservation,
  guestsLabel: string
): Promise<ReservationNotificationStatus> {
  const config = getMailConfig()
  if (!config) {
    console.error('[reservation request receipt] SMTP is not configured')
    return 'not_configured'
  }

  const english = reservation.lang === 'en'
  const date = formatDate(reservation.date, english ? 'en-GB' : 'de-DE')
  const guests = guestsLabel === '9 oder mehr'
    ? (english ? '9 or more' : guestsLabel)
    : guestsLabel
  const greeting = english
    ? `Dear ${reservation.firstName} ${reservation.lastName},`
    : `Guten Tag ${reservation.firstName} ${reservation.lastName},`
  const received = english
    ? 'Thank you for your table request. We have received it and will check availability.'
    : 'Vielen Dank für Ihre Tischanfrage. Wir haben sie erhalten und prüfen die Verfügbarkeit.'
  const pending = english
    ? 'Your table is not confirmed yet. We will send you another email when we confirm the reservation.'
    : 'Ihr Tisch ist noch nicht bestätigt. Sobald wir die Reservierung bestätigt haben, erhalten Sie eine weitere E-Mail.'
  const details = english
    ? [`Date: ${date}`, `Time: ${reservation.time}`, `Guests: ${guests}`]
    : [`Datum: ${date}`, `Uhrzeit: ${reservation.time}`, `Personen: ${guests}`]
  const closing = english
    ? 'If you have any questions, please call us at +49 34461 599804.'
    : 'Bei Fragen erreichen Sie uns unter 034461 599804.'
  const text = [
    greeting,
    '',
    received,
    pending,
    '',
    ...details,
    'Neue Liebe · Wetzendorfer Str. 10 · 06642 Nebra (Unstrut)',
    '',
    closing,
    '',
    'Neue Liebe',
  ].join('\n')
  const html = [
    '<div style="font-family:Arial,sans-serif;line-height:1.6;color:#1a1714">',
    `<h1 style="font-size:26px">${english ? 'Your table request has arrived' : 'Ihre Tischanfrage ist eingegangen'}</h1>`,
    `<p>${escapeHtml(greeting)}</p>`,
    `<p>${escapeHtml(received)}</p>`,
    `<p><strong>${escapeHtml(pending)}</strong></p>`,
    `<p>${details.map(escapeHtml).join('<br>')}<br>Neue Liebe · Wetzendorfer Str. 10 · 06642 Nebra (Unstrut)</p>`,
    `<p>${escapeHtml(closing)}</p>`,
    '<p>Neue Liebe</p>',
    '</div>',
  ].join('')

  const transporter = createTransport(config)
  try {
    const result = await transporter.sendMail({
      from: { name: 'Neue Liebe', address: config.user },
      to: reservation.email,
      subject: english
        ? 'Neue Liebe: We received your table request'
        : 'Neue Liebe: Ihre Tischanfrage ist eingegangen',
      text,
      html,
    })
    if (result.accepted.length !== 1 || result.rejected.length > 0) {
      console.error('[reservation request receipt] SMTP did not accept the guest')
      return 'failed'
    }
    return 'sent'
  } catch (error) {
    const code = error instanceof Error && 'code' in error
      ? String(error.code)
      : 'UNKNOWN'
    console.error('[reservation request receipt] SMTP delivery failed', { code })
    return 'failed'
  } finally {
    transporter.close()
  }
}

export async function sendReservationConfirmationEmail(
  reservation: Reservation,
  origin: string
): Promise<ReservationNotificationStatus> {
  const config = getMailConfig()
  const token = createReservationCancellationToken(reservation.id, reservation.cancellationTokenVersion)
  if (!config || !token) {
    console.error('[reservation confirmation] SMTP or cancellation signing secret is not configured')
    return 'not_configured'
  }

  const english = reservation.lang === 'en'
  const date = formatDate(reservation.date, english ? 'en-GB' : 'de-DE')
  const guestCount = reservation.guests === 9
    ? (english ? '9 or more' : '9 oder mehr')
    : String(reservation.guests)
  const greeting = english
    ? `Dear ${reservation.firstName} ${reservation.lastName},`
    : `Guten Tag ${reservation.firstName} ${reservation.lastName},`
  const confirmation = english
    ? 'Your table at Neue Liebe is confirmed.'
    : 'Ihr Tisch in der Neuen Liebe ist verbindlich reserviert.'
  const details = english
    ? [`Date: ${date}`, `Time: ${reservation.time}`, `Guests: ${guestCount}`]
    : [`Datum: ${date}`, `Uhrzeit: ${reservation.time}`, `Personen: ${guestCount}`]
  const onlineCancellationAvailable = canCancelReservation(reservation)
  const closing = onlineCancellationAvailable
    ? (english
      ? 'We look forward to welcoming you! You can cancel online up to 24 hours before your reservation. For later changes, please call us at +49 34461 599804.'
      : 'Wir freuen uns auf Ihren Besuch! Bis 24 Stunden vor Ihrem Termin können Sie online stornieren. Bei späteren Änderungen rufen Sie uns bitte unter 034461 599804 an.')
    : (english
      ? 'We look forward to welcoming you! For changes to this reservation, please call us at +49 34461 599804.'
      : 'Wir freuen uns auf Ihren Besuch! Für Änderungen an dieser Reservierung rufen Sie uns bitte unter 034461 599804 an.')
  const cancellationUrl = reservationCancellationUrl(origin, token, reservation.lang)
  const cancellationLabel = english ? 'Cancel reservation' : 'Reservierung stornieren'
  const text = [
    greeting,
    '',
    confirmation,
    '',
    ...details,
    'Neue Liebe · Wetzendorfer Str. 10 · 06642 Nebra (Unstrut)',
    '',
    closing,
    ...(onlineCancellationAvailable ? [`${cancellationLabel}: ${cancellationUrl}`] : []),
    '',
    'Neue Liebe',
  ].join('\n')
  const html = [
    '<div style="font-family:Arial,sans-serif;line-height:1.6;color:#1a1714">',
    `<h1 style="font-size:26px">${english ? 'Your reservation is confirmed' : 'Ihre Reservierung ist bestätigt'}</h1>`,
    `<p>${escapeHtml(greeting)}</p>`,
    `<p><strong>${escapeHtml(confirmation)}</strong></p>`,
    `<p>${details.map(escapeHtml).join('<br>')}<br>Neue Liebe · Wetzendorfer Str. 10 · 06642 Nebra (Unstrut)</p>`,
    `<p>${escapeHtml(closing)}</p>`,
    ...(onlineCancellationAvailable ? [
      `<p><a href="${escapeHtml(cancellationUrl)}" style="display:inline-block;padding:12px 20px;border:1px solid #4a3728;border-radius:4px;color:#4a3728;text-decoration:none">${cancellationLabel}</a></p>`,
      `<p>${english ? 'Cancellation takes effect only after you confirm it on the website.' : 'Die Stornierung wird erst wirksam, wenn Sie sie auf der Website bestätigen.'}</p>`,
    ] : []),
    '<p>Neue Liebe</p>',
    '</div>',
  ].join('')

  const transporter = createTransport(config)
  try {
    const result = await transporter.sendMail({
      from: { name: 'Neue Liebe', address: config.user },
      to: reservation.email,
      subject: english
        ? `Neue Liebe: Your table on ${date} is confirmed`
        : `Neue Liebe: Ihr Tisch am ${date} ist bestätigt`,
      text,
      html,
    })

    if (result.accepted.length !== 1 || result.rejected.length > 0) {
      console.error('[reservation confirmation] SMTP did not accept the guest')
      return 'failed'
    }
    return 'sent'
  } catch (error) {
    const code = error instanceof Error && 'code' in error
      ? String(error.code)
      : 'UNKNOWN'
    console.error('[reservation confirmation] SMTP delivery failed', { code })
    return 'failed'
  } finally {
    transporter.close()
  }
}

export async function sendReservationCancellationManagerEmail(
  reservation: Reservation
): Promise<ReservationNotificationStatus> {
  const config = getMailConfig()
  const to = process.env.LEAD_NOTIFY_TO?.trim()
  if (!config || !to) return 'not_configured'

  const date = formatDate(reservation.date)
  const reason = reservation.cancellationReason || 'Kein Grund angegeben'
  const lines = [
    'Die Reservierung wurde storniert.',
    '',
    `Anfrage-ID: ${reservation.id}`,
    `Datum: ${date}`,
    `Uhrzeit: ${reservation.time}`,
    `Personen: ${reservation.guests}`,
    `Name: ${reservation.firstName} ${reservation.lastName}`,
    `E-Mail: ${reservation.email}`,
    `Telefon: ${reservation.phone || 'Nicht angegeben'}`,
    `Grund: ${reason}`,
  ]
  const transporter = createTransport(config)
  try {
    const result = await transporter.sendMail({
      from: config.from,
      to,
      replyTo: reservation.email,
      subject: `Neue Liebe: Stornierung für ${date} um ${reservation.time}`,
      text: lines.join('\n'),
      html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#1a1714"><h1>Reservierung storniert</h1>${lines.slice(2).map((line) => `<p>${escapeHtml(line).replace(/\n/g, '<br>')}</p>`).join('')}</div>`,
    })
    if (result.accepted.length === 0 || result.rejected.length > 0) return 'failed'
    return 'sent'
  } catch (error) {
    console.error('[reservation cancellation manager] SMTP delivery failed', {
      code: error instanceof Error && 'code' in error ? String(error.code) : 'UNKNOWN',
    })
    return 'failed'
  } finally {
    transporter.close()
  }
}

export async function sendReservationCancellationGuestEmail(
  reservation: Reservation
): Promise<ReservationNotificationStatus> {
  const config = getMailConfig()
  if (!config) return 'not_configured'

  const english = reservation.lang === 'en'
  const date = formatDate(reservation.date, english ? 'en-GB' : 'de-DE')
  const lines = english
    ? [
      `Dear ${reservation.firstName} ${reservation.lastName},`,
      '',
      `Your reservation at Neue Liebe for ${date} at ${reservation.time} has been cancelled.`,
      'If you did not request this cancellation, please call us at +49 34461 599804.',
    ]
    : [
      `Guten Tag ${reservation.firstName} ${reservation.lastName},`,
      '',
      `Ihre Reservierung in der Neuen Liebe für den ${date} um ${reservation.time} wurde storniert.`,
      'Falls Sie die Stornierung nicht veranlasst haben, rufen Sie uns bitte unter 034461 599804 an.',
    ]
  const transporter = createTransport(config)
  try {
    const result = await transporter.sendMail({
      from: { name: 'Neue Liebe', address: config.user },
      to: reservation.email,
      subject: english ? 'Neue Liebe: Your reservation was cancelled' : 'Neue Liebe: Ihre Reservierung wurde storniert',
      text: lines.join('\n'),
      html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#1a1714"><h1>${english ? 'Reservation cancelled' : 'Reservierung storniert'}</h1>${lines.filter(Boolean).map((line) => `<p>${escapeHtml(line)}</p>`).join('')}</div>`,
    })
    if (result.accepted.length !== 1 || result.rejected.length > 0) return 'failed'
    return 'sent'
  } catch (error) {
    console.error('[reservation cancellation guest] SMTP delivery failed', {
      code: error instanceof Error && 'code' in error ? String(error.code) : 'UNKNOWN',
    })
    return 'failed'
  } finally {
    transporter.close()
  }
}

export async function sendReservationUpdateEmail(
  reservation: Reservation,
  origin: string
): Promise<ReservationNotificationStatus> {
  const config = getMailConfig()
  const confirmed = reservation.status === 'CONFIRMED'
  const token = confirmed ? createReservationCancellationToken(reservation.id, reservation.cancellationTokenVersion) : null
  if (!config || (confirmed && !token)) return 'not_configured'

  const english = reservation.lang === 'en'
  const date = formatDate(reservation.date, english ? 'en-GB' : 'de-DE')
  const details = english
    ? [
      `Date: ${date}`, `Time: ${reservation.time}`, `Guests: ${reservation.guests}`,
      ...(reservation.phone ? [`Phone: ${reservation.phone}`] : []),
      ...(reservation.specialRequest ? [`Special request: ${reservation.specialRequest}`] : []),
    ]
    : [
      `Datum: ${date}`, `Uhrzeit: ${reservation.time}`, `Personen: ${reservation.guests}`,
      ...(reservation.phone ? [`Telefon: ${reservation.phone}`] : []),
      ...(reservation.specialRequest ? [`Sonderwunsch: ${reservation.specialRequest}`] : []),
    ]
  const intro = english
    ? (confirmed ? 'The details of your confirmed reservation have changed.' : 'The details of your table request have changed. Your table is not confirmed yet.')
    : (confirmed ? 'Die Daten Ihrer bestätigten Reservierung wurden geändert.' : 'Die Daten Ihrer Tischanfrage wurden geändert. Ihr Tisch ist noch nicht bestätigt.')
  const cancellationUrl = confirmed && token && canCancelReservation(reservation)
    ? reservationCancellationUrl(origin, token, reservation.lang)
    : null
  const cancellationLabel = english ? 'Cancel reservation' : 'Reservierung stornieren'
  const contact = english
    ? 'If these details are incorrect, please call us at +49 34461 599804.'
    : 'Falls diese Angaben nicht stimmen, rufen Sie uns bitte unter 034461 599804 an.'
  const transporter = createTransport(config)
  try {
    const result = await transporter.sendMail({
      from: { name: 'Neue Liebe', address: config.user },
      to: reservation.email,
      subject: english ? 'Neue Liebe: Your reservation details changed' : 'Neue Liebe: Ihre Reservierungsdaten wurden geändert',
      text: [
        `${english ? 'Dear' : 'Guten Tag'} ${reservation.firstName} ${reservation.lastName},`,
        '', intro, '', ...details, '', contact,
        ...(cancellationUrl ? ['', `${cancellationLabel}: ${cancellationUrl}`] : []),
        '', 'Neue Liebe',
      ].join('\n'),
      html: [
        '<div style="font-family:Arial,sans-serif;line-height:1.6;color:#1a1714">',
        `<h1>${english ? 'Reservation updated' : 'Reservierung aktualisiert'}</h1>`,
        `<p>${escapeHtml(intro)}</p>`,
        `<p>${details.map(escapeHtml).join('<br>')}</p>`,
        `<p>${escapeHtml(contact)}</p>`,
        ...(cancellationUrl ? [`<p><a href="${escapeHtml(cancellationUrl)}" style="display:inline-block;padding:12px 20px;border:1px solid #4a3728;border-radius:4px;color:#4a3728;text-decoration:none">${cancellationLabel}</a></p>`] : []),
        '<p>Neue Liebe</p></div>',
      ].join(''),
    })
    if (result.accepted.length !== 1 || result.rejected.length > 0) return 'failed'
    return 'sent'
  } catch (error) {
    console.error('[reservation update guest] SMTP delivery failed', {
      code: error instanceof Error && 'code' in error ? String(error.code) : 'UNKNOWN',
    })
    return 'failed'
  } finally {
    transporter.close()
  }
}
