import { restartRace } from '@/telemetry/engine'

const SEEN_KEY = 'apex:start-lights-seen'

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

let decided: boolean | null = null

/**
 * Whether the intro plays on this page load: first visit per browser session, never with
 * reduced motion. Decided once per load, so React StrictMode's double render can't flip it.
 */
export function introOnLoad(): boolean {
  if (decided !== null) return decided
  decided = false
  if (prefersReducedMotion()) return decided
  try {
    if (sessionStorage.getItem(SEEN_KEY)) return decided
    sessionStorage.setItem(SEEN_KEY, '1')
  } catch {
    // Storage blocked (private mode, policies): play once for this page load only.
  }
  decided = true
  return decided
}

type Replay = () => void
const listeners = new Set<Replay>()

export function onReplay(fn: Replay): () => void {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

export function focusMain() {
  document.getElementById('main')?.focus({ preventScroll: true })
}

/**
 * "Chequered flag · restart": back to the top and replay the lights, ignoring the
 * once-per-session rule. With reduced motion it only returns to the top.
 */
export function restartWithLights() {
  restartRace()
  if (prefersReducedMotion() || listeners.size === 0) {
    focusMain()
    return
  }
  listeners.forEach((fn) => fn())
}
