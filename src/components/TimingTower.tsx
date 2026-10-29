import { useEffect, useRef } from 'react'
import { raceSections } from '@/data/race'
import { useRaceState } from '@/telemetry/store'
import { registerSink } from '@/telemetry/engine'

// Circuit outline from the prototype's track map.
const TRACK =
  'M20 95 L120 95 C150 95 172 86 178 66 C184 44 168 26 146 30 L104 38 C88 41 82 54 70 60 C54 68 40 56 36 40 C32 24 16 26 16 46 L16 80 C16 88 18 95 20 95 Z'

/** Desktop section nav (≥1024px): live position, visited flags and a track-position map. */
export function TimingTower() {
  const { activeId, visited } = useRaceState()
  const trackRef = useRef<SVGPathElement>(null)
  const dotRef = useRef<SVGCircleElement>(null)

  useEffect(() => {
    const path = trackRef.current
    const dot = dotRef.current
    if (!path || !dot) return
    const length = path.getTotalLength()
    let last = -1
    return registerSink((t) => {
      if (t.progress === last) return
      last = t.progress
      const pt = path.getPointAtLength(t.progress * length)
      dot.setAttribute('cx', pt.x.toFixed(1))
      dot.setAttribute('cy', pt.y.toFixed(1))
    })
  }, [])

  return (
    <nav
      aria-label="Sections"
      className="fixed top-[65px] bottom-20 left-0 z-30 hidden w-[232px] flex-col gap-0.5 overflow-y-auto border-r border-[#1d221f] bg-carbon/90 py-4 lg:flex"
    >
      <p className="telemetry-label px-3.5 pb-2.5">Timing tower</p>
      <ul className="flex flex-col gap-0.5">
        {raceSections.map((s) => {
          const live = s.id === activeId
          return (
            <li key={s.id}>
              <a href={`#${s.id}`} aria-current={live ? 'location' : undefined} className={`tw-item ${live ? 'is-live' : ''}`}>
                <span className="tw-pos">{s.pos}</span>
                <span>{s.label}</span>
                <span className="tw-flag">
                  {live ? 'LIVE' : visited.has(s.id) ? <span aria-label="visited">✓</span> : null}
                </span>
              </a>
            </li>
          )
        })}
      </ul>

      <div className="mt-auto p-3.5">
        <p className="telemetry-label mb-2">Track position</p>
        <svg viewBox="0 0 200 130" width="200" height="130" aria-hidden="true" className="block max-w-full">
          <path ref={trackRef} d={TRACK} fill="none" stroke="var(--color-pitlane)" strokeWidth="9" strokeLinejoin="round" />
          <path d={TRACK} fill="none" stroke="#4a524c" strokeWidth="1" strokeDasharray="3 4" />
          <rect x="18" y="88" width="3" height="14" fill="var(--color-titanium)" />
          <circle ref={dotRef} cx="20" cy="95" r="6" fill="var(--accent)" />
        </svg>
      </div>
    </nav>
  )
}
