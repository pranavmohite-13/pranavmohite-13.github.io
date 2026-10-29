import type { Experience } from '@/data/experience'

/** Vertical timeline; entries arrive newest first and are numbered as stints counting down. */
export function Timeline({ entries }: { entries: Experience[] }) {
  return (
    <ol className="relative">
      {entries.map((entry, i) => {
        const stint = String(entries.length - i).padStart(2, '0')
        return (
          <li data-reveal key={`${entry.company}-${entry.start}`} className="relative grid gap-4 pb-12 pl-8 last:pb-0 md:grid-cols-12 md:gap-6 md:pl-0">
            {/* Rail and node */}
            {i < entries.length - 1 && (
              <span aria-hidden="true" className="absolute top-2 bottom-0 left-[5px] w-px bg-pitlane md:left-[calc(25%+5px)]" />
            )}
            <span
              aria-hidden="true"
              className={`absolute top-1.5 left-0 size-[11px] border md:left-[25%] ${
                i === 0 ? 'border-lime bg-lime' : 'border-muted bg-carbon'
              }`}
            />

            <div className="md:col-span-3 md:pr-10 md:text-right">
              <p className="font-mono text-xs tracking-[0.12em] text-titanium uppercase">
                <time dateTime={entry.start}>{entry.from}</time>
                {' – '}
                <time dateTime={entry.end}>{entry.to}</time>
              </p>
              <p className="telemetry-label mt-1">
                Stint <span className="text-lime">{stint}</span>
              </p>
            </div>

            <div className="md:col-span-9 md:col-start-4 md:pl-8">
              <h3 className="font-display text-2xl leading-tight font-bold tracking-[-0.01em] uppercase md:text-3xl">
                {entry.role}
              </h3>
              <p className="mt-1 text-muted">{entry.company}</p>
              <ul className="mt-5 space-y-2.5">
                {entry.points.map((point) => (
                  <li key={point} className="flex gap-3 leading-relaxed">
                    <span aria-hidden="true" className="mt-3 h-px w-3 shrink-0 bg-lime" />
                    {point}
                  </li>
                ))}
              </ul>
              {entry.tools && entry.tools.length > 0 && (
                <ul aria-label="Tools" className="mt-5 flex flex-wrap gap-2">
                  {entry.tools.map((tool) => (
                    <li key={tool} className="border border-pitlane px-2.5 py-1 font-mono text-[0.6875rem] tracking-[0.08em] text-muted uppercase">
                      {tool}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
