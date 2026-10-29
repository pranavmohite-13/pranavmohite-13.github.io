import { useEffect, useRef, type CSSProperties, type PointerEvent, type RefObject } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react'
import { profile } from '@/data/profile'
import { TelemetryLine } from '@/components/TelemetryLine'
import { bump, registerSink, requestFrame } from '@/telemetry/engine'
import { prefersReducedMotion } from '@/intro/lights'

// Staggered entrance; each step starts 70ms after the last.
const delay = (step: number): CSSProperties => ({ animationDelay: `${step * 70}ms` })

function BackgroundGrid() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div className="mx-auto grid h-full max-w-[1440px] grid-cols-4 px-4 sm:px-6 md:grid-cols-8 lg:px-10">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className={`border-l border-pitlane/60 ${i >= 4 ? 'hidden md:block' : ''} ${
              i === 3 ? 'border-r md:border-r-0' : i === 7 ? 'border-r' : ''
            }`}
          />
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-carbon" />
    </div>
  )
}

const TRACE_POINTS = 80
const TRACE_IDLE_MS = 350

/**
 * Pointer "throttle trace": a glowing polyline of the last ~80 pointer positions that fades out
 * once the pointer stops. Higher on the hero = more throttle and speed. Mouse and pen only.
 * Drawn by a telemetry sink, so it shares the one animation loop and never re-renders React.
 */
function useThrottleTrace() {
  const heroRef = useRef<HTMLElement>(null)
  const lineRef = useRef<SVGPolylineElement>(null)
  const glowRef = useRef<SVGPolylineElement>(null)
  const points = useRef<[number, number][]>([])
  const lastMove = useRef(0)

  useEffect(() => {
    let lastFade = 0
    let drawn = ''
    return registerSink(
      () => {
        const pts = points.current
        const now = performance.now()
        if (pts.length && now - lastMove.current > TRACE_IDLE_MS) {
          if (prefersReducedMotion()) {
            pts.length = 0 // no fade animation: clear at once
          } else {
            // Drop ~4 points per 60ms, as in the prototype.
            const drop = Math.max(1, Math.round(((now - (lastFade || now - 16)) / 60) * 4))
            pts.splice(0, drop)
          }
          lastFade = now
        } else {
          lastFade = 0
        }
        const attr = pts.map((p) => p.join(',')).join(' ')
        if (attr !== drawn) {
          drawn = attr
          lineRef.current?.setAttribute('points', attr)
          glowRef.current?.setAttribute('points', attr)
        }
      },
      () => points.current.length > 0,
    )
  }, [])

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType === 'touch') return
    const r = e.currentTarget.getBoundingClientRect()
    if (!r.width || !r.height) return
    const x = ((e.clientX - r.left) / r.width) * 1000
    const y = ((e.clientY - r.top) / r.height) * 400
    const pts = points.current
    pts.push([Math.round(x), Math.round(y)])
    if (pts.length > TRACE_POINTS) pts.shift()
    lastMove.current = performance.now()
    const height = Math.min(1, Math.max(0, 1 - y / 400))
    bump({ thr: height * 100, speed: height * 300 })
    requestFrame()
  }

  return { heroRef, lineRef, glowRef, onPointerMove }
}

/** Pause the streak animation while the hero is off-screen. */
function usePauseOffscreen(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry) el.toggleAttribute('data-offscreen', !entry.isIntersecting)
    })
    io.observe(el)
    return () => io.disconnect()
  }, [ref])
}

export function Hero() {
  const { heroRef, lineRef, glowRef, onPointerMove } = useThrottleTrace()
  usePauseOffscreen(heroRef)
  const [line1, line2 = ''] = profile.headline
  // Below 640px the second line breaks into one slanted block per word, so every
  // line shares the same left edge; a single skewed block would shift its wrapped top line.
  const words = line2.replace(/\.$/, '').split(' ')

  return (
    <section
      ref={heroRef}
      onPointerMove={onPointerMove}
      aria-labelledby="hero-title"
      className="relative isolate -mt-16 flex min-h-[calc(100svh-3.5rem)] flex-col overflow-hidden pt-16 lg:min-h-[calc(100svh-5rem)]"
    >
      <BackgroundGrid />
      <span aria-hidden="true" className="ghost-13">
        13
      </span>
      <div aria-hidden="true" className="streaks">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <svg
        aria-hidden="true"
        viewBox="0 0 1000 400"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 -z-[1] h-full w-full"
      >
        <polyline ref={glowRef} className="trace-glow" points="" />
        <polyline ref={lineRef} className="trace" points="" />
      </svg>

      <div className="mx-auto grid w-full max-w-[1440px] flex-1 grid-cols-12 content-center gap-x-6 gap-y-10 px-4 py-12 sm:px-6 md:py-16 lg:px-10">
        <div className="col-span-12">
          <p style={delay(0)} className="telemetry-label mb-6 flex items-center gap-3 animate-rise">
            <span aria-hidden="true" className="h-px w-8 bg-lime" />
            {profile.driverLabel}
          </p>

          <h1 id="hero-title" className="font-display uppercase">
            <span
              style={delay(1)}
              className="block animate-rise text-[clamp(1.75rem,5vw,3.5rem)] leading-none font-medium tracking-[0.02em]"
            >
              {profile.name}
            </span>{' '}
            <span
              style={delay(2)}
              className="mt-3 block animate-rise text-[clamp(2.5rem,12.5vw,6rem)] sm:text-[min(6rem,calc((100vw-48px)/8.9))] lg:text-[clamp(4.5rem,calc((100vw-312px)*0.114),10rem)] leading-[0.88] font-bold tracking-[-0.025em] md:mt-5"
            >
              <span className="slant block">{line1}</span>{' '}
              <span className="block sm:slant">
                {words.map((word, i) => (
                  <span key={word + i}>
                    {i > 0 && ' '}
                    <span className="block max-sm:slant sm:inline">
                      {word}
                      {i === words.length - 1 && <span className="text-lime">.</span>}
                    </span>
                  </span>
                ))}
              </span>
            </span>
          </h1>
        </div>

        <div className="col-span-12 md:col-span-7 lg:col-span-6">
          <p style={delay(3)} className="max-w-xl text-base leading-relaxed text-muted md:text-lg animate-rise">
            {profile.summary}
          </p>

          <div style={delay(4)} className="mt-8 flex flex-wrap gap-3 animate-rise">
            <a
              href="#projects"
              className="group inline-flex min-h-12 items-center gap-2 bg-lime px-6 font-mono text-xs font-semibold tracking-[0.12em] text-carbon uppercase transition-colors hover:bg-titanium"
            >
              Explore projects
              <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener"
              className="group inline-flex min-h-12 items-center gap-2 border border-pitlane px-6 font-mono text-xs tracking-[0.12em] uppercase transition-colors hover:border-lime"
            >
              View résumé
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </div>
          <p className="telemetry-label mt-8 hidden [@media(hover:hover)_and_(pointer:fine)]:block">
            Cursor height = throttle · scroll to drive <span aria-hidden="true">↓</span>
          </p>
        </div>

        <div className="col-span-12 md:col-span-5 md:col-start-8 lg:col-span-6 lg:col-start-7 lg:justify-self-end md:self-end">
          <dl style={delay(5)} className="border-l border-lime/60 pl-5 font-mono text-xs tracking-[0.12em] uppercase animate-rise">
            <div className="pb-4">
              <dt className="text-muted">Focus</dt>
              <dd className="mt-1 text-titanium">{profile.tags.join(' / ')}</dd>
            </div>
            <div>
              <dt className="text-muted">Readout</dt>
              <dd className="mt-1">
                <ul className="flex flex-wrap gap-x-2 gap-y-1 tracking-normal text-titanium">
                  {profile.readout.map((item, i) => (
                    <li key={item.label} className="whitespace-nowrap">
                      <span className="text-lime">{item.value}</span> {item.label}
                      {i < profile.readout.length - 1 && (
                        <span aria-hidden="true" className="ml-2 text-muted">
                          ·
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <TelemetryLine className="h-20 w-full md:h-28" />
        <div className="flex items-center justify-between border-t border-pitlane py-4">
          <p className="telemetry-label">Sector 01 / Race Control</p>
          <a
            href="#projects"
            aria-label="Scroll to projects"
            className="group inline-flex min-h-11 items-center gap-2 font-mono text-xs tracking-[0.14em] text-muted uppercase transition-colors hover:text-titanium"
          >
            Scroll
            <ArrowDown aria-hidden="true" className="size-4 transition-transform group-hover:translate-y-0.5" />
          </a>
        </div>
      </div>
    </section>
  )
}
