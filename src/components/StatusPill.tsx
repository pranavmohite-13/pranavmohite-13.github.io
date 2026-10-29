import type { Project } from '@/data/projects'

/** Badge for work that isn't finished yet. Renders nothing for shipped projects. */
export function StatusPill({ status }: { status: Project['status'] }) {
  if (status !== 'in-development') return null
  return (
    <span className="inline-flex items-center gap-2 border border-pitlane px-2.5 py-1 font-mono text-[0.6875rem] tracking-[0.12em] text-titanium uppercase">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-lime" />
      In development
    </span>
  )
}
