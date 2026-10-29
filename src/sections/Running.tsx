import { Flag } from 'lucide-react'
import { runningGoal } from '@/data/profile'
import { runs, summary } from '@/lib/running'
import { formatDate, formatKm, formatPace } from '@/lib/format'
import { Section } from '@/components/Section'
import { StatTile } from '@/components/StatTile'
import { PaceChart } from '@/components/PaceChart'

export function Running() {
  if (!summary) return <section id="running" className="scroll-mt-20" />

  return (
    <Section id="running" sector={5} label="Running" title="Road to HYROX">
      <div data-reveal className="grid gap-6 lg:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-6 lg:col-span-5">
          <p className="flex items-center gap-3 border-l border-lime pl-4 font-display text-xl font-bold uppercase md:text-2xl">
            <Flag aria-hidden="true" className="size-5 shrink-0 text-lime" />
            <span>
              {runningGoal.label}
              {runningGoal.event && <span className="block text-base font-medium text-muted normal-case">{runningGoal.event}</span>}
              {runningGoal.date && (
                <time dateTime={runningGoal.date} className="block font-mono text-xs font-normal tracking-[0.12em] text-muted">
                  {formatDate(runningGoal.date, true)}
                </time>
              )}
            </span>
          </p>

          <dl className="grid grid-cols-2 gap-3">
            <StatTile label="Total distance" value={formatKm(summary.totalKm)} unit="km" />
            <StatTile label="Runs" value={String(summary.runs)} />
            <StatTile label="Average pace" value={formatPace(summary.avgPaceSecPerKm)} unit="/km" />
            <StatTile label="Longest run" value={formatKm(summary.longestRun.distanceKm, 2)} unit="km" />
          </dl>

          <p className="font-mono text-[0.6875rem] leading-relaxed tracking-[0.06em] text-muted uppercase">
            {formatDate(summary.firstDate, true)} – {formatDate(summary.lastDate, true)} · From Strava: distance and
            moving time only, no routes
          </p>
        </div>

        <div className="min-w-0 lg:col-span-7">
          <PaceChart runs={runs} summary={summary} />
        </div>
      </div>
    </Section>
  )
}
