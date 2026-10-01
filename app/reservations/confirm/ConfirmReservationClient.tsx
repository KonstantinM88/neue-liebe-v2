'use client'

import { FormEvent, useEffect, useState } from 'react'
import styles from './confirm.module.css'

type ConfirmationStatus =
  | 'loading_link'
  | 'ready'
  | 'invalid_link'
  | 'loading'
  | 'confirmed'
  | 'already_confirmed'
  | 'processing'
  | 'email_failed'
  | 'not_available'
  | 'past_reservation'
  | 'outside_opening_hours'
  | 'server_error'

const messages: Record<Exclude<ConfirmationStatus, 'loading_link' | 'ready' | 'loading'>, string> = {
  invalid_link: 'Dieser Bestätigungslink ist ungültig oder abgelaufen. Bitte prüfen Sie die Anfrage direkt in Ihrer E-Mail.',
  confirmed: 'Der Tisch ist bestätigt. Die Bestätigungs-E-Mail wurde an den Gast versendet.',
  already_confirmed: 'Diese Reservierung wurde bereits bestätigt und der Gast wurde benachrichtigt.',
  processing: 'Die Bestätigung wird bereits verarbeitet. Bitte warten Sie kurz und versuchen Sie es erneut.',
  email_failed: 'Der Tisch ist bestätigt, aber die E-Mail an den Gast konnte nicht gesendet werden. Bitte versuchen Sie den Versand erneut.',
  not_available: 'Diese Reservierungsanfrage ist nicht mehr verfügbar.',
  past_reservation: 'Der angefragte Termin liegt bereits in der Vergangenheit. Bitte kontaktieren Sie den Gast direkt.',
  outside_opening_hours: 'Der angefragte Termin liegt außerhalb unserer Öffnungszeiten. Bitte kontaktieren Sie den Gast direkt.',
  server_error: 'Die Anfrage konnte gerade nicht verarbeitet werden. Bitte versuchen Sie es erneut.',
}

export default function ConfirmReservationClient() {
  const [token, setToken] = useState<string | null>(null)
  const [status, setStatus] = useState<ConfirmationStatus>('loading_link')

  useEffect(() => {
    // Keep the fragment: React runs this effect twice in development.
    const linkToken = new URLSearchParams(window.location.hash.slice(1)).get('token')
    setToken(linkToken)
    setStatus(linkToken ? 'ready' : 'invalid_link')
  }, [])

  async function confirm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!token || status === 'loading') return
    setStatus('loading')
    try {
      const response = await fetch('/api/reservations/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
        cache: 'no-store',
      })
      const body: unknown = await response.json()
      const nextStatus = body && typeof body === 'object' && 'status' in body
        ? (body as { status?: string }).status
        : null
      setStatus(nextStatus && nextStatus in messages
        ? nextStatus as ConfirmationStatus
        : 'server_error')
    } catch {
      setStatus('server_error')
    }
  }

  const canSubmit = token && ['ready', 'processing', 'email_failed', 'server_error'].includes(status)

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.brand}>Neue Liebe</p>
        <p className={styles.eyebrow}>Reservierungsanfrage</p>
        <h1>Reservierung bestätigen</h1>
        {status === 'loading_link' && (
          <p>Bestätigungslink wird geladen. Falls diese Meldung bestehen bleibt, laden Sie die Seite bitte erneut.</p>
        )}
        {status === 'ready' && <p>Nach Ihrer Bestätigung erhält der Gast eine E-Mail mit den Reservierungsdaten.</p>}
        {status === 'loading' && <p>Bestätigung wird verarbeitet …</p>}
        {status !== 'loading_link' && status !== 'ready' && status !== 'loading' && (
          <p role="status" className={status === 'confirmed' || status === 'already_confirmed' ? styles.success : styles.notice}>
            {messages[status]}
          </p>
        )}
        {canSubmit && (
          <form onSubmit={confirm}>
            <button type="submit">{status === 'email_failed' ? 'E-Mail erneut senden' : 'Jetzt verbindlich bestätigen'}</button>
          </form>
        )}
      </section>
    </main>
  )
}
