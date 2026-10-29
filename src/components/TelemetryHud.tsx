import { useEffect, useRef } from 'react'
import { raceSectors, raceSections } from '@/data/race'
import { useRaceState } from '@/telemetry/store'
import { MAX_SPEED, registerSink } from '@/telemetry/engine'
import { TeamRadio } from '@/components/TeamRadio'

const LEDS = 12
const ledColour = (i: number) => (i < 6 ? 'led-g' : i < 9 ? 'led-r' : 'led-b')
const gearFor = (speed: number) => (speed < 5 ? 'N' : String(Math.min(8, 1 + Math.floor(speed / 42))))

/**
 * Fixed bottom telemetry bar. The readouts are decorative and hidden from assistive tech;
 * the docked Team radio button is the only interactive (and announced) part.
 * Fast values are written through refs by a telemetry sink; React only re-renders it
 * when the live sector changes.
 */
export function TelemetryHud() {
  const { activeId, maxSector } = useRaceState()
  const liveSector = raceSections.find((s) => s.id === activeId)?.sector ?? 1

  const speedRef = useRef<HTMLSpanElement>(null)
  const gearRef = useRef<HTMLSpanElement>(null)
  const ledsRef = useRef<HTMLDivElement>(null)
  const thrRef = useRef<HTMLDivElement>(null)
  const thrValRef = useRef<HTMLSpanElement>(null)
  const brkRef = useRef<HTMLDivElement>(null)
  const brkValRef = useRef<HTMLSpanElement>(null)
  const drsRef = useRef<HTMLSpanElement>(null)
  const lapRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const leds = Array.from(ledsRef.current?.children ?? []) as HTMLElement[]
    const prev = { speed: -1, thr: -1, brk: -1, lap: -1 }
    return registerSink((t) => {
      const speed = Math.round(t.speed)
      if (speed !== prev.speed) {
        prev.speed = speed
        if (speedRef.current) speedRef.current.textContent = String(speed)
        if (gearRef.current) gearRef.current.textContent = gearFor(speed)
        const lit = Math.round((speed / MAX_SPEED) * LEDS)
        leds.forEach((led, i) => led.classList.toggle(ledColour(i), i < lit))
        drsRef.current?.classList.toggle('is-on', speed > 200)
      }
      const thr = Math.round(t.thr)
      if (thr !== prev.thr) {
        prev.thr = thr
        if (thrRef.current) thrRef.current.style.transform = `scaleX(${thr / 100})`
        if (thrValRef.current) thrValRef.current.textContent = `${thr}%`
      }
      const brk = Math.round(t.brk)
      if (brk !== prev.brk) {
        prev.brk = brk
        if (brkRef.current) brkRef.current.style.transform = `scaleX(${brk / 100})`
        if (brkValRef.current) brkValRef.current.textContent = `${brk}%`
      }
      const lap = Math.round(t.progress * 100)
      if (lap !== prev.lap) {
        prev.lap = lap
        if (lapRef.current) lapRef.current.textContent = `${lap}%`
      }
    })
  }, [])

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex h-14 items-center gap-3 border-t border-[#1d221f] bg-[#0e100f] px-4 select-none sm:gap-6 lg:h-20 lg:gap-4 lg:px-5 xl:gap-5">
      <div aria-hidden="true" className="w-[88px] sm:w-[104px] lg:w-[118px]">
        <div className="telemetry-label hidden lg:block">Speed</div>
        <div className="font-mono text-2xl leading-tight font-bold lg:text-3xl">
          <span ref={speedRef}>0</span>
          <span className="ml-1 text-[11px] font-normal text-muted">KM/H</span>
        </div>
      </div>

      <div aria-hidden="true" className="w-10 text-center sm:w-12">
        <div className="telemetry-label hidden lg:block">Gear</div>
        <span ref={gearRef} className="font-mono text-2xl leading-tight font-bold text-lime lg:text-3xl">
          N
        </span>
      </div>

      {/* Shift lights from 1280px: between 1024 and 1279 the sector boxes need the room. */}
      <div aria-hidden="true" className="hidden flex-col gap-2.5 xl:flex">
        <div className="telemetry-label">Shift lights</div>
        <div ref={ledsRef} className="flex gap-1">
          {Array.from({ length: LEDS }, (_, i) => (
            <span key={i} className="led" />
          ))}
        </div>
      </div>

      <div aria-hidden="true" className="hidden w-[150px] flex-col gap-1 lg:flex">
        <div className="telemetry-label flex justify-between">
          <span>Throttle</span>
          <span ref={thrValRef}>0%</span>
        </div>
        <div className="hud-bar">
          <div ref={thrRef} className="h-full origin-left scale-x-0 bg-lime" />
        </div>
        <div className="telemetry-label flex justify-between">
          <span>Brake</span>
          <span ref={brkValRef}>0%</span>
        </div>
        <div className="hud-bar">
          <div ref={brkRef} className="h-full origin-left scale-x-0 bg-[#FF5A36]" />
        </div>
      </div>

      <span ref={drsRef} aria-hidden="true" className="drs">
        DRS
      </span>

      <TeamRadio />

      <div aria-hidden="true" className="hidden min-w-0 flex-1 gap-1.5 lg:flex">
        {raceSectors.map((s) => (
          <div
            key={s.n}
            className={`sbox ${s.n === liveSector ? 'is-live' : s.n <= maxSector ? 'is-done' : ''}`}
          >
            <div>S{s.n}</div>
            <div className="mt-0.5 truncate text-[13px] text-titanium uppercase">{s.label}</div>
          </div>
        ))}
      </div>

      <div aria-hidden="true" className="ml-auto text-right">
        <div className="telemetry-label hidden sm:block">Lap progress</div>
        <span ref={lapRef} className="font-mono text-xl leading-tight font-bold lg:text-2xl">
          0%
        </span>
      </div>
    </div>
  )
}
