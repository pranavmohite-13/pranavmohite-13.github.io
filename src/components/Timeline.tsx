import type { Experience } from '@/data/experience'

/** Stint cards, newest first, numbered as stints counting down. The current stint gets the accent edge. */
export function Timeline({ entries }: { entries: Experience[] }) {
  return (
    <ol className="grid gap-3 xl:grid-cols-3">
      {entries.map((entry, i) => {
        const stint = String(entries.length - i).padStart(2, '0')
        const latest = i === 0
        return (
          <li
            data-reveal
            key={`${entry.company}-${entry.start}`}
            className={`brk flex flex-col border-t-[3px] bg-surface p-6 ${latest ? 'border-lime' : 'border-pitlane'}`}
          >
            <p className={`telemetry-label ${latest ? 'text-lime' : ''}`}>
              Stint {stint} ·{' '}
              <time dateTime={entry.start}>{entry.from}</time>
              {' – '}
              <time dateTime={entry.end}>{entry.to}</time>
            </p>
            <h3 className="mt-3.5 font-display text-xl leading-tight font-bold uppercase">{entry.role}</h3>
            <p className="mt-1 text-sm text-muted">{entry.company}</p>
            <ul className="mt-4 space-y-2">
              {entry.points.map((point) => (
                <li key={point} className="flex gap-3 text-sm leading-relaxed">
                  <span aria-hidden="true" className="mt-2.5 h-px w-3 shrink-0 bg-lime" />
                  {point}
                </li>
              ))}
            </ul>
            {entry.tools && entry.tools.length > 0 && (
              <ul aria-label="Tools" className="mt-auto flex flex-wrap gap-2 pt-5">
                {entry.tools.map((tool) => (
                  <li key={tool} className="border border-pitlane px-2.5 py-1 font-mono text-[0.6875rem] tracking-[0.08em] text-muted uppercase">
                    {tool}
                  </li>
                ))}
              </ul>
            )}
          </li>
        )
      })}
    </ol>
  )
}
