import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Section } from '@/components/Section'

type Phase = 'idle' | 'arming' | 'waiting' | 'go' | 'result' | 'jump'

const LIGHT_MS = 500
const HOLD_MIN_MS = 700
const HOLD_RANGE_MS = 2300 // random hold 0.7–3.0s after the fifth light

const BUTTON_LABEL: Record<Phase, string> = {
  idle: 'Start',
  arming: 'Wait for lights out…',
  waiting: 'Wait for lights out…',
  go: 'Go! Click now',
  result: 'Try again',
  jump: 'Jump start · try again',
}

const seconds = (ms: number) => `${(ms / 1000).toFixed(3)} s`

/** Reaction test: five lights, a random hold, lights out, measure the press. Nothing is stored or sent. */
export function Reaction() {
  const [phase, setPhaseState] = useState<Phase>('idle')
  const [lit, setLit] = useState(0)
  const [time, setTime] = useState<number | null>(null)
  const [best, setBest] = useState<number | null>(null)
  const [tries, setTries] = useState(0)
  const timers = useRef<number[]>([])
  const goAt = useRef(0)
  const handledAt = useRef(0)
  // Press handlers read the phase synchronously, so it is mirrored in a ref whenever it changes.
  const phaseRef = useRef<Phase>('idle')
  const setPhase = (next: Phase) => {
    phaseRef.current = next
    setPhaseState(next)
  }

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }
  useEffect(() => clearTimers, [])

  const press = () => {
    const now = performance.now()
    const current = phaseRef.current
    if (current === 'arming' || current === 'waiting') {
      clearTimers()
      setLit(0)
      setPhase('jump')
      setTries((n) => n + 1)
      return
    }
    if (current === 'go') {
      const t = now - goAt.current
      setTime(t)
      setBest((b) => (b === null ? t : Math.min(b, t)))
      setTries((n) => n + 1)
      setPhase('result')
      return
    }
    // idle, result or jump: start a new run.
    clearTimers()
    setLit(0)
    setPhase('arming')
    for (let i = 1; i <= 5; i++) timers.current.push(window.setTimeout(() => setLit(i), LIGHT_MS * i))
    timers.current.push(window.setTimeout(() => setPhase('waiting'), LIGHT_MS * 5))
    const hold = LIGHT_MS * 5 + HOLD_MIN_MS + Math.random() * HOLD_RANGE_MS
    timers.current.push(
      window.setTimeout(() => {
        goAt.current = performance.now()
        setLit(0)
        setPhase('go')
      }, hold),
    )
  }

  // Measure on press-down, not on click (which fires on release and adds ~100ms).
  // A plain click (e.g. from assistive tech) still works; it's ignored only right after a handled press.
  const handlePress = () => {
    handledAt.current = performance.now()
    press()
  }
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.repeat || (e.key !== 'Enter' && e.key !== ' ')) return
    e.preventDefault()
    handlePress()
  }
  const onClick = () => {
    if (performance.now() - handledAt.current < 1000) return
    press()
  }

  let shown = '—'
  let message = 'Press Start when you are ready. Keyboard works too: Tab to the button, then Space.'
  if (phase === 'arming' || phase === 'waiting') message = 'Hold it…'
  if (phase === 'go') message = 'Now!'
  if (phase === 'jump') {
    shown = 'Jump start'
    message = 'You went before the lights went out. Penalty. Go again.'
  }
  if (phase === 'result' && time !== null) {
    shown = seconds(time)
    message = time < 200 ? 'Faster than a typical F1 start.' : time < 300 ? 'Close to F1 pace.' : 'Solid. One more?'
  }

  return (
    <Section id="reaction" sector={6} label="Pit lane" title="Reaction test">
      <p data-reveal className="mb-7 max-w-[580px] text-[17px] leading-relaxed text-muted">
        Five lights come on, then go out at a random moment. Hit the button the instant they go out. F1 drivers
        typically react in about 0.2 seconds. Go too early and it's a jump start.
      </p>

      <div data-reveal className="flex flex-wrap items-stretch gap-4">
        <div className="brk flex flex-[1_1_420px] flex-col items-center gap-7 border border-[#1d221f] bg-[#121513] px-6 py-8">
          <div aria-hidden="true" className="flex gap-2.5 border border-pitlane bg-[#0e100f] px-4 py-4 sm:gap-3.5 sm:px-[22px] sm:py-[18px]">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className={`lamp ${i < lit ? 'is-on' : ''}`} />
            ))}
          </div>
          <button
            type="button"
            onPointerDown={(e) => e.button === 0 && handlePress()}
            onKeyDown={onKeyDown}
            onClick={onClick}
            className={`inline-flex min-h-[76px] w-full max-w-[420px] touch-manipulation items-center justify-center border px-5 font-mono text-sm tracking-[0.14em] uppercase transition-colors select-none ${
              phase === 'go' ? 'border-lime bg-lime text-carbon' : 'border-pitlane hover:border-lime'
            }`}
          >
            {BUTTON_LABEL[phase]}
          </button>
        </div>

        <div className="flex flex-[1_1_240px] flex-col gap-3">
          <div aria-live="polite" className="bg-surface p-[22px]">
            <p className="telemetry-label">Your time</p>
            <p className="mt-1.5 font-mono text-[40px] leading-tight font-bold text-lime">{shown}</p>
            <p className="mt-1.5 text-sm leading-normal text-muted">{message}</p>
          </div>
          <div className="bg-surface p-[22px]">
            <p className="telemetry-label">Session best</p>
            <p className="mt-1.5 font-mono text-[26px] font-bold">{best === null ? '—' : seconds(best)}</p>
            <p className="telemetry-label mt-2.5">Attempts · {tries}</p>
          </div>
        </div>
      </div>
    </Section>
  )
}
