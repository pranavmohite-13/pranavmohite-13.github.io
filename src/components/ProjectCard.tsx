import { ArrowRight, Award } from 'lucide-react'
import type { Project } from '@/data/projects'
import { ProjectLinks } from '@/components/ProjectLinks'

type Props = {
  project: Project
  index: number
  onOpen: (project: Project, trigger: HTMLButtonElement) => void
}

export function StatusPill({ status }: { status: Project['status'] }) {
  if (status !== 'in-development') return null
  return (
    <span className="inline-flex items-center gap-2 border border-pitlane px-2.5 py-1 font-mono text-[0.6875rem] tracking-[0.12em] text-titanium uppercase">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-lime" />
      In development
    </span>
  )
}

export function ProjectCard({ project, index, onOpen }: Props) {
  const number = String(index + 1).padStart(2, '0')
  const reversed = index % 2 === 1
  const headingId = `project-${project.slug}`

  return (
    <article
      aria-labelledby={headingId}
      className="group grid grid-cols-1 border border-pitlane bg-surface transition-colors duration-300 hover:border-lime/70 lg:grid-cols-12"
    >
      {/* Identity panel */}
      <div
        className={`flex flex-col gap-8 border-b border-pitlane p-5 sm:p-8 lg:col-span-5 lg:border-b-0 lg:p-10 ${
          reversed ? 'lg:order-2 lg:border-l' : 'lg:border-r'
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <span className="font-mono text-xs tracking-[0.14em] text-muted uppercase">
            Project <span className="text-lime">{number}</span>
          </span>
          <StatusPill status={project.status} />
        </div>
        <div>
          <h3
            id={headingId}
            className="font-display text-[clamp(1.75rem,3.6vw,3rem)] leading-[0.95] font-bold tracking-[-0.02em] text-balance uppercase"
          >
            {project.name}
          </h3>
          <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">{project.summary}</p>
          <ul aria-label="Stack" className="mt-6 flex flex-wrap gap-2">
            {project.stack.map((tag) => (
              <li key={tag} className="border border-pitlane px-2.5 py-1 font-mono text-[0.6875rem] tracking-[0.08em] text-muted uppercase">
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Detail panel */}
      <div className={`flex flex-col gap-7 p-5 sm:p-8 lg:col-span-7 lg:p-10 ${reversed ? 'lg:order-1' : ''}`}>
        {project.badge && (
          <p className="flex gap-3 border-l border-lime pl-4 text-sm leading-relaxed text-titanium">
            <Award aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-lime" />
            {project.badge}
          </p>
        )}

        {(project.role || project.team) && (
          <dl className="grid gap-4 sm:grid-cols-[auto_1fr] sm:gap-x-6">
            {project.role && (
              <>
                <dt className="telemetry-label pt-0.5">My role</dt>
                <dd className="text-sm leading-relaxed text-titanium">{project.role}</dd>
              </>
            )}
            {project.team && (
              <>
                <dt className="telemetry-label pt-0.5">Team</dt>
                <dd className="text-sm leading-relaxed text-titanium">{project.team}</dd>
              </>
            )}
          </dl>
        )}

        {project.highlights.length > 0 && (
          <ul className="divide-y divide-pitlane border-y border-pitlane">
            {project.highlights.map((h) => (
              <li key={h.text} className="flex flex-col gap-1.5 py-4 sm:flex-row sm:gap-5">
                {h.metric ? (
                  <span className="shrink-0 font-mono text-lg leading-tight font-medium text-lime sm:min-w-24 sm:text-xl">
                    {h.metric}
                  </span>
                ) : (
                  <span aria-hidden="true" className="mt-2.5 hidden h-px w-4 shrink-0 bg-muted sm:block" />
                )}
                <span className="text-sm leading-relaxed text-titanium sm:text-[0.9375rem]">{h.text}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={(e) => onOpen(project, e.currentTarget)}
            aria-haspopup="dialog"
            className="inline-flex min-h-11 items-center gap-2 bg-titanium px-5 font-mono text-xs font-semibold tracking-[0.12em] text-carbon uppercase transition-colors hover:bg-lime"
          >
            Case study<span className="sr-only">: {project.name}</span>
            <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
          </button>
          <ProjectLinks links={project.links} name={project.name} />
        </div>
      </div>
    </article>
  )
}
