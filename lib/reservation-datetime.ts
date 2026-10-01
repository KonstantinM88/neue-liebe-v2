const berlinZone = 'Europe/Berlin'

export function openingHoursForDate(date: string): { opens: string; closes: string } | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null
  const parsed = new Date(`${date}T00:00:00.000Z`)
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) return null
  const weekday = parsed.getUTCDay()
  if (weekday === 0) return { opens: '10:00', closes: '16:00' }
  if (weekday >= 3 && weekday <= 6) return { opens: '15:00', closes: '23:00' }
  return null
}

export function isWithinOpeningHours(date: string, time: string): boolean {
  const hours = openingHoursForDate(date)
  return Boolean(hours && time >= hours.opens && time < hours.closes)
}

export function lastBookingTime(closes: string): string {
  const minutes = Number(closes.slice(0, 2)) * 60 + Number(closes.slice(3)) - 1
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`
}

export function berlinDateTimeParts(value = new Date()): { date: string; time: string } {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: berlinZone,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(value)
  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? ''
  return {
    date: `${part('year')}-${part('month')}-${part('day')}`,
    time: `${part('hour')}:${part('minute')}`,
  }
}

export function reservationStart(date: string, time: string): Date {
  const [year, month, day] = date.split('-').map(Number)
  const [hour, minute] = time.split(':').map(Number)
  // Bookings are during restaurant hours; noon has the same Berlin UTC offset.
  const noon = new Date(Date.UTC(year, month - 1, day, 12))
  const zonePart = new Intl.DateTimeFormat('en-US', {
    timeZone: berlinZone,
    timeZoneName: 'shortOffset',
  }).formatToParts(noon).find((part) => part.type === 'timeZoneName')?.value
  const match = /^GMT([+-])(\d{1,2})(?::(\d{2}))?$/.exec(zonePart ?? '')
  if (!match) throw new Error('Cannot determine Berlin time offset')
  const offsetMinutes = (Number(match[2]) * 60 + Number(match[3] ?? 0)) * (match[1] === '+' ? 1 : -1)
  return new Date(Date.UTC(year, month - 1, day, hour, minute) - offsetMinutes * 60 * 1000)
}

export function isFutureReservation(date: string, time: string, now = new Date()): boolean {
  return reservationStart(date, time).getTime() > now.getTime()
}
