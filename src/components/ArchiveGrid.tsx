import { ArrowUpRight } from 'lucide-react'
import type { ArchiveEntry } from '@/data/projects'

export function ArchiveGrid({ entries }: { entries: ArchiveEntry[] }) {
  if (entries.length === 0) return null
  return (
    <ul data-reveal className="grid grid-cols-1 border-t border-l border-pitlane sm:grid-cols-2 lg:grid-cols-3">
      {entries.map((entry) => (
        <li key={entry.name} className="group relative flex flex-col gap-4 border-r border-b border-pitlane p-6 transition-colors hover:bg-surface">
          <div className="flex items-start justify-between gap-4">
            <h4 className="font-display text-xl leading-tight font-bold uppercase">
              {entry.link ? (
                <a href={entry.link} target="_blank" rel="noopener" className="after:absolute after:inset-0">
                  {entry.name}
                </a>
              ) : (
                entry.name
              )}
            </h4>
            {entry.link && (
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-lime"
              />
            )}
          </div>
          <p className="text-sm leading-relaxed text-muted">{entry.summary}</p>
          {entry.tags.length > 0 && (
            <ul aria-label="Tags" className="mt-auto flex flex-wrap gap-x-3 gap-y-1 font-mono text-[0.6875rem] tracking-[0.08em] text-muted uppercase">
              {entry.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  )
}
