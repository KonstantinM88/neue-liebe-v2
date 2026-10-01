'use client'

import { FormEvent, useEffect, useState } from 'react'
import card from '../confirm/confirm.module.css'
import styles from './cancel.module.css'

type Status =
  | 'loading_link'
  | 'ready'
  | 'loading'
  | 'invalid_link'
  | 'invalid_request'
  | 'cancelled'
  | 'already_cancelled'
  | 'processing'
  | 'notification_failed'
  | 'not_available'
  | 'not_confirmed'
  | 'too_late'
  | 'server_error'

type Language = 'de' | 'en'

const messages: Record<Exclude<Status, 'loading_link' | 'ready' | 'loading'>, [string, string]> = {
  invalid_link: ['Dieser Stornierungslink ist ungültig. Bitte öffnen Sie den Link aus Ihrer Bestätigungs-E-Mail.', 'This cancellation link is invalid. Please open the link in your confirmation email.'],
  invalid_request: ['Die Angaben konnten nicht verarbeitet werden. Bitte prüfen Sie den Grund und versuchen Sie es erneut.', 'Your details could not be processed. Please check the reason and try again.'],
  cancelled: ['Ihre Reservierung wurde storniert. Sie und unser Team erhalten eine E-Mail.', 'Your reservation has been cancelled. You and our team will receive an email.'],
  already_cancelled: ['Diese Reservierung wurde bereits storniert.', 'This reservation has already been cancelled.'],
  processing: ['Die Stornierung wird bereits verarbeitet. Bitte warten Sie kurz und versuchen Sie es erneut.', 'The cancellation is being processed. Please wait a moment and try again.'],
  notification_failed: ['Ihre Reservierung ist storniert. Mindestens eine E-Mail konnte nicht gesendet werden. Bitte versuchen Sie den Versand erneut oder rufen Sie uns an.', 'Your reservation is cancelled. At least one email could not be sent. Please retry or call us.'],
  not_available: ['Diese Reservierung kann nicht storniert werden. Bitte rufen Sie uns an.', 'This reservation cannot be cancelled. Please call us.'],
  not_confirmed: ['Diese Anfrage wurde noch nicht bestätigt. Bitte rufen Sie uns an, falls Sie sie zurückziehen möchten.', 'This request has not been confirmed yet. Please call us if you want to withdraw it.'],
  too_late: ['Die Online-Stornierung ist nur bis 24 Stunden vor dem Termin möglich. Bitte rufen Sie uns unter 034461 599804 an.', 'Online cancellation is available until 24 hours before your reservation. Please call us at +49 34461 599804.'],
  server_error: ['Die Anfrage konnte gerade nicht verarbeitet werden. Bitte versuchen Sie es erneut.', 'We could not process your request. Please try again.'],
}

export default function CancelReservationClient() {
  const [token, setToken] = useState<string | null>(null)
  const [lang, setLang] = useState<Language>('de')
  const [reason, setReason] = useState('')
  const [status, setStatus] = useState<Status>('loading_link')

  useEffect(() => {
    // Keep the fragment intact so React's development effect replay can read it again.
    const linkToken = new URLSearchParams(window.location.hash.slice(1)).get('token')
    setToken(linkToken)
    setLang(new URLSearchParams(window.location.search).get('lang') === 'en' ? 'en' : 'de')
    setStatus(linkToken ? 'ready' : 'invalid_link')
  }, [])

  async function cancel(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!token || status === 'loading') return
    setStatus('loading')
    try {
      const response = await fetch('/api/reservations/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, reason }),
        cache: 'no-store',
      })
      const body: unknown = await response.json()
      const nextStatus = body && typeof body === 'object' && 'status' in body
        ? (body as { status?: string }).status
        : null
      setStatus(nextStatus && nextStatus in messages ? nextStatus as Status : 'server_error')
    } catch {
      setStatus('server_error')
    }
  }

  const english = lang === 'en'
  const canSubmit = token && ['ready', 'processing', 'notification_failed', 'server_error', 'invalid_request'].includes(status)
  const showReason = status === 'ready' || status === 'invalid_request' || status === 'server_error'
  const isSuccess = status === 'cancelled' || status === 'already_cancelled'

  return (
    <main className={card.page}>
      <section className={card.card}>
        <p className={card.brand}>Neue Liebe</p>
        <p className={card.eyebrow}>{english ? 'Your reservation' : 'Ihre Reservierung'}</p>
        <h1>{english ? 'Cancel reservation' : 'Reservierung stornieren'}</h1>
        {status === 'loading_link' && <p>{english ? 'Loading cancellation link…' : 'Stornierungslink wird geladen …'}</p>}
        {status === 'ready' && <p>{english
          ? 'You can cancel online until 24 hours before your reservation. Cancellation takes effect only after you press the button below.'
          : 'Bis 24 Stunden vor Ihrem Termin können Sie online stornieren. Die Stornierung wird erst nach Klick auf die Schaltfläche wirksam.'}</p>}
        {status === 'loading' && <p>{english ? 'Processing cancellation…' : 'Stornierung wird verarbeitet …'}</p>}
        {status !== 'loading_link' && status !== 'ready' && status !== 'loading' && (
          <p role="status" className={isSuccess ? card.success : card.notice}>{messages[status][english ? 1 : 0]}</p>
        )}
        {canSubmit && (
          <form onSubmit={cancel}>
            {showReason && (
              <div className={styles.reasonField}>
                <label htmlFor="cancellation-reason">{english ? 'Reason (optional)' : 'Grund (optional)'}</label>
                <textarea
                  id="cancellation-reason"
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  maxLength={1000}
                  rows={4}
                  placeholder={english ? 'Tell us why your plans changed, if you wish.' : 'Wenn Sie möchten, teilen Sie uns den Grund mit.'}
                />
              </div>
            )}
            <button type="submit">{status === 'notification_failed'
              ? (english ? 'Retry email notification' : 'E-Mail erneut senden')
              : (english ? 'Confirm cancellation' : 'Stornierung bestätigen')}</button>
          </form>
        )}
      </section>
    </main>
  )
}
