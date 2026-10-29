const pad = (n: number) => String(n).padStart(2, '0')

/** 415 → "6:55" (minutes:seconds per km). */
export function formatPace(secPerKm: number): string {
  const total = Math.round(secPerKm)
  return `${Math.floor(total / 60)}:${pad(total % 60)}`
}

/** 10897 → "3h 01m"; 2111 → "35m 11s". */
export function formatDuration(sec: number): string {
  const total = Math.round(sec)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return h > 0 ? `${h}h ${pad(m)}m` : `${m}m ${pad(s)}s`
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** "2026-06-17" → "17 Jun" (or "17 Jun 2026" with year). Parsed without time zones. */
export function formatDate(iso: string, withYear = false): string {
  const [y, m, d] = iso.split('-').map(Number)
  const label = `${d} ${MONTHS[(m ?? 1) - 1]}`
  return withYear ? `${label} ${y}` : label
}

/** 26.27 → "26.3". */
export function formatKm(km: number, digits = 1): string {
  return km.toFixed(digits)
}
