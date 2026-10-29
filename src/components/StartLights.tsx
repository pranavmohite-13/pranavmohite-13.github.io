import { useCallback, useEffect, useRef, useState } from 'react'
import { focusMain, introOnLoad, onReplay } from '@/intro/lights'

const LIGHT_MS = 420
const HOLD_MS = 400
const FADE_MS = 700 // matches the 600ms CSS fade plus a short tail; whole intro ≈ 3.2s

type State = { run: number; lit: number; out: boolean; focusSkip: boolean }

/**
 * Client-only start-lights overlay. The page renders underneath from the first paint; this sits
 * on top for ~3.2s and never blocks content. Not modal: everything stays reachable.
 */
export function StartLights() {
  const [state, setState] = useState<State>(() => ({ run: introOnLoad() ? 1 : 0, lit: 0, out: false, focusSkip: false }))
  const rootRef = useRef<HTMLDivElement>(null)
  const skipRef = useRef<HTMLButtonElement>(null)

  const finish = useCallback(() => {
    // If focus was in the overlay (keyboard skip or a restart), hand it back to the page top.
    const hadFocus = rootRef.current?.contains(document.activeElement) ?? false
    setState((s) => ({ ...s, run: 0 }))
    if (hadFocus) focusMain()
  }, [])

  // Restart button: replay from the first light and give keyboard users the Skip button.
  useEffect(() => onReplay(() => setState((s) => ({ run: s.run + 1, lit: 0, out: false, focusSkip: true }))), [])

  useEffect(() => {
    if (!state.run) return
    const timers = [1, 2, 3, 4, 5].map((i) => window.setTimeout(() => setState((s) => ({ ...s, lit: i })), LIGHT_MS * i))
    timers.push(window.setTimeout(() => setState((s) => ({ ...s, lit: 0, out: true })), LIGHT_MS * 5 + HOLD_MS))
    timers.push(window.setTimeout(finish, LIGHT_MS * 5 + HOLD_MS + FADE_MS))
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && finish()
    window.addEventListener('keydown', onKey)
    return () => {
      timers.forEach(clearTimeout)
      window.removeEventListener('keydown', onKey)
    }
  }, [state.run, finish])

  useEffect(() => {
    if (state.run && state.focusSkip) skipRef.current?.focus()
  }, [state.run, state.focusSkip])

  if (!state.run) return null

  return (
    <div
      ref={rootRef}
      className={`fixed inset-0 z-[70] flex flex-col items-center justify-center gap-8 bg-carbon/97 px-4 ${state.out ? 'lights-fade' : ''}`}
    >
      <p aria-hidden="true" className="telemetry-label text-center">
        Pranav Mohite /// Performance under pressure
      </p>
      <div aria-hidden="true" className="flex gap-2.5 border border-pitlane bg-[#111312] p-4 sm:gap-[18px] sm:px-[26px] sm:py-5">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className={`lamp ${i < state.lit ? 'is-on' : ''}`} />
            <div className={`lamp ${i < state.lit ? 'is-on' : ''}`} />
          </div>
        ))}
      </div>
      <p aria-hidden="true" className="font-display text-3xl font-bold tracking-[0.02em] uppercase sm:text-[44px]">
        {state.out ? 'Lights out' : 'Get ready'}
      </p>
      <button
        ref={skipRef}
        type="button"
        onClick={finish}
        className="inline-flex min-h-11 items-center border border-pitlane px-5 font-mono text-xs tracking-[0.14em] uppercase transition-colors hover:border-lime"
      >
        Skip intro
      </button>
    </div>
  )
}
