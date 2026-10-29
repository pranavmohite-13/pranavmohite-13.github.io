import { useEffect, useRef, useState } from 'react'
import type { Run, RunningSummary } from '@/lib/running'
import { formatDate, formatKm, formatPace } from '@/lib/format'

type Props = { runs: Run[]; summary: RunningSummary }

const HEIGHT = 224
const PAD = { top: 16, right: 16, bottom: 36, left: 48 }
const STEP = 30 // y-axis tick spacing, seconds per km

/** Renders in real pixel coordinates so axis text stays legible at any width. */
function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => entry && setWidth(Math.round(entry.contentRect.width)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, width] as const
}

export function PaceChart({ runs, summary }: Props) {
  const [ref, width] = useWidth<HTMLDivElement>()

  const paces = runs.map((r) => r.paceSecPerKm)
  const yMin = Math.floor((Math.min(...paces) - 10) / STEP) * STEP
  const yMax = Math.ceil((Math.max(...paces) + 10) / STEP) * STEP
  const ticks = Array.from({ length: (yMax - yMin) / STEP + 1 }, (_, i) => yMin + i * STEP)

  const innerW = Math.max(width - PAD.left - PAD.right, 1)
  const innerH = HEIGHT - PAD.top - PAD.bottom
  const x = (i: number) => PAD.left + (runs.length === 1 ? innerW / 2 : (i / (runs.length - 1)) * innerW)
  // Faster (lower) pace plots higher.
  const y = (pace: number) => PAD.top + ((pace - yMin) / (yMax - yMin)) * innerH
  const points = runs.map((r, i) => `${x(i).toFixed(1)},${y(r.paceSecPerKm).toFixed(1)}`).join(' ')

  // Thin out date labels on narrow screens.
  const labelEvery = innerW / runs.length < 56 ? Math.ceil(56 / (innerW / runs.length)) : 1
  const showLabel = (i: number) => i === 0 || i === runs.length - 1 || (i % labelEvery === 0 && runs.length - 1 - i >= labelEvery)

  const { fastestRun, slowestRun } = summary
  const description =
    `Pace per run across ${summary.runs} runs from ${formatDate(summary.firstDate, true)} to ${formatDate(summary.lastDate, true)}. ` +
    `Fastest ${formatPace(fastestRun.paceSecPerKm)} per km on ${formatDate(fastestRun.date)}, ` +
    `slowest ${formatPace(slowestRun.paceSecPerKm)} per km on ${formatDate(slowestRun.date)}, ` +
    `overall average ${formatPace(summary.avgPaceSecPerKm)} per km.`

  return (
    <figure className="border border-pitlane p-4 sm:p-5">
      <figcaption className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <span className="telemetry-label">Pace per run</span>
        <span className="font-mono text-[0.6875rem] tracking-[0.08em] text-muted uppercase">
          min/km · faster <span aria-hidden="true">↑</span>
          <span className="sr-only">is higher</span>
        </span>
      </figcaption>
      <p className="sr-only">{description}</p>

      {/* The SVG is absolutely positioned so its pixel width never props the layout open. */}
      <div ref={ref} style={{ height: HEIGHT }} className="relative" aria-hidden="true">
        {width > 0 && (
          <svg width={width} height={HEIGHT} className="absolute inset-0 overflow-visible font-mono">
            {ticks.map((t) => (
              <g key={t}>
                <line x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} stroke="var(--color-pitlane)" />
                <text x={PAD.left - 10} y={y(t)} dy="0.32em" textAnchor="end" fontSize="11" fill="var(--color-muted)">
                  {formatPace(t)}
                </text>
              </g>
            ))}

            {/* Overall average */}
            <line
              x1={PAD.left}
              x2={width - PAD.right}
              y1={y(summary.avgPaceSecPerKm)}
              y2={y(summary.avgPaceSecPerKm)}
              stroke="var(--color-muted)"
              strokeDasharray="4 4"
            />
            <text
              x={width - PAD.right}
              y={y(summary.avgPaceSecPerKm) - 6}
              textAnchor="end"
              fontSize="10"
              fill="var(--color-muted)"
            >
              AVG {formatPace(summary.avgPaceSecPerKm)}
            </text>

            <polyline points={points} fill="none" stroke="var(--color-lime)" strokeWidth="1.5" strokeLinejoin="round" />
            {runs.map((r, i) => (
              <g key={r.date + i}>
                <circle cx={x(i)} cy={y(r.paceSecPerKm)} r="3.5" fill="var(--color-carbon)" stroke="var(--color-lime)" strokeWidth="1.5" />
                {showLabel(i) && (
                  <text x={x(i)} y={HEIGHT - PAD.bottom + 20} textAnchor="middle" fontSize="11" fill="var(--color-muted)">
                    {formatDate(r.date)}
                  </text>
                )}
              </g>
            ))}
          </svg>
        )}
      </div>

      {/* Tables ignore the 1px sr-only width, so the wrapper carries it. */}
      <div className="sr-only">
      <table>
        <caption>Runs</caption>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Distance (km)</th>
            <th scope="col">Pace (min/km)</th>
          </tr>
        </thead>
        <tbody>
          {runs.map((r, i) => (
            <tr key={r.date + i}>
              <td>{formatDate(r.date, true)}</td>
              <td>{formatKm(r.distanceKm, 2)}</td>
              <td>{formatPace(r.paceSecPerKm)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </figure>
  )
}
