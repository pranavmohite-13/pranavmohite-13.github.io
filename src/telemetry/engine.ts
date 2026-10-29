import { raceSections, type RaceSector } from '@/data/race'
import { fast, resetRaceState, updateRaceState, type FastTelemetry } from './store'

export const MAX_SPEED = 340

type Sink = (t: Readonly<FastTelemetry>) => void
/** Lets a sink keep the loop alive for its own animation (e.g. the throttle trace fading out). */
type Busy = () => boolean
type Mark = { id: string; top: number; sector: RaceSector }

const sinks = new Set<Sink>()
const busyChecks = new Set<Busy>()
let marks: Mark[] = []
let maxScroll = 0
let raf = 0
let lastFrame = 0
let lastY = 0
let lastT = 0
let lastInput = 0
let reduce = false

/**
 * Register a DOM writer that runs on every telemetry frame. An optional `busy` check keeps the
 * loop running while it returns true. Returns an unregister function.
 */
export function registerSink(sink: Sink, busy?: Busy): () => void {
  sinks.add(sink)
  if (busy) busyChecks.add(busy)
  sink(fast)
  return () => {
    sinks.delete(sink)
    if (busy) busyChecks.delete(busy)
  }
}

/** Ask for frames without adding input (e.g. new trace points). */
export function requestFrame() {
  kick()
}

/** Back to the start line: top of the page, telemetry and sector history cleared. */
export function restartRace() {
  window.scrollTo({ top: 0, behavior: 'instant' })
  lastY = 0
  lastT = performance.now()
  fast.speed = fast.thr = fast.brk = 0
  resetRaceState()
  measure()
  updatePosition(0)
  kick()
}

/** Feed extra input (hero throttle trace, "push" radio command). */
export function bump(input: { speed?: number; thr?: number }) {
  if (input.speed !== undefined) fast.speed = Math.max(fast.speed, Math.min(MAX_SPEED, input.speed))
  if (input.thr !== undefined) fast.thr = Math.max(fast.thr, Math.min(100, input.thr))
  lastInput = performance.now()
  kick()
}

// Section tops are cached so scroll handling never reads layout.
function measure() {
  const y = window.scrollY
  marks = raceSections.flatMap((s) => {
    if (s.id === 'top') return [{ id: s.id, top: 0, sector: s.sector }]
    const el = document.getElementById(s.id)
    return el ? [{ id: s.id, top: el.getBoundingClientRect().top + y, sector: s.sector }] : []
  })
  maxScroll = document.documentElement.scrollHeight - window.innerHeight
}

function updatePosition(y: number) {
  fast.progress = maxScroll > 0 ? Math.min(1, Math.max(0, y / maxScroll)) : 0
  const probe = y + window.innerHeight * 0.4
  let mark = marks[0]
  for (const m of marks) if (m.top <= probe) mark = m
  // At the very bottom, the last section wins even if it's short.
  if (maxScroll > 0 && y >= maxScroll - 2) mark = marks[marks.length - 1] ?? mark
  if (mark) updateRaceState({ activeId: mark.id, sector: mark.sector, scrolled: y > 8 })
}

function onScroll() {
  const y = window.scrollY
  const now = performance.now()
  const dy = y - lastY
  const dt = Math.max(16, now - lastT)
  lastY = y
  lastT = now
  fast.speed = Math.max(fast.speed, Math.min(MAX_SPEED, (Math.abs(dy) / dt) * 160))
  if (dy > 0) fast.thr = 100
  else if (dy < 0) fast.brk = 100
  lastInput = now
  updatePosition(y)
  kick()
}

function settle(v: number, factor: number, k: number) {
  const next = v * factor ** k
  return next < 1 ? 0 : next
}

function frame(now: number) {
  raf = 0
  const dt = lastFrame ? now - lastFrame : 16
  lastFrame = now
  if (reduce) {
    // No decay animation: values hold while input continues, then drop straight to zero.
    if (now - lastInput > 150) fast.speed = fast.thr = fast.brk = 0
  } else {
    // Prototype decay rates were per 60ms tick; scale them to the real frame time.
    const k = dt / 60
    fast.speed = settle(fast.speed, 0.86, k)
    fast.thr = settle(fast.thr, 0.82, k)
    fast.brk = settle(fast.brk, 0.82, k)
  }
  sinks.forEach((sink) => sink(fast))
  // Keep looping only while something is still moving.
  const busy = fast.speed || fast.thr || fast.brk || [...busyChecks].some((check) => check())
  if (busy && !document.hidden) raf = requestAnimationFrame(frame)
  else lastFrame = 0
}

function kick() {
  if (!raf && !document.hidden) raf = requestAnimationFrame(frame)
}

function onVisibility() {
  if (document.hidden) {
    cancelAnimationFrame(raf)
    raf = 0
    lastFrame = 0
  } else {
    kick()
  }
}

function onResize() {
  measure()
  updatePosition(window.scrollY)
  kick()
}

/** Attach listeners and paint the first frame. Returns a cleanup function. */
export function startTelemetry(): () => void {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  reduce = motion.matches
  const onMotion = () => (reduce = motion.matches)

  lastY = window.scrollY
  lastT = performance.now()
  measure()
  updatePosition(lastY)
  kick()

  const ro = new ResizeObserver(onResize)
  ro.observe(document.body)
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize, { passive: true })
  document.addEventListener('visibilitychange', onVisibility)
  motion.addEventListener('change', onMotion)

  return () => {
    ro.disconnect()
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onResize)
    document.removeEventListener('visibilitychange', onVisibility)
    motion.removeEventListener('change', onMotion)
    cancelAnimationFrame(raf)
    raf = 0
    lastFrame = 0
  }
}
