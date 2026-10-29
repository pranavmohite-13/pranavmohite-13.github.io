import { useEffect, useRef } from 'react'
import { Award, X } from 'lucide-react'
import type { Project } from '@/data/projects'
import { ProjectLinks } from '@/components/ProjectLinks'
import { StatusPill } from '@/components/ProjectCard'

type Props = {
  project: Project | null
  number: number
  onClose: () => void
}

const steps = [
  { key: 'problem', label: 'Problem' },
  { key: 'built', label: 'What I built' },
  { key: 'verified', label: 'How I verified it' },
  { key: 'result', label: 'Result' },
] as const

/**
 * Case study in a native modal <dialog>: the browser handles focus containment,
 * Esc to close and the inert background. Steps with no content are skipped.
 */
export function CaseStudy({ project, number, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog || !project) return
    if (!dialog.open) dialog.showModal()
    const root = document.documentElement
    const prev = root.style.overflow
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = prev
      if (dialog.open) dialog.close()
    }
  }, [project])

  const filled = project
    ? steps.filter(({ key }) => {
        const value = project.caseStudy[key]
        return Array.isArray(value) ? value.length > 0 : Boolean(value?.trim())
      })
    : []

  const titleId = project ? `case-${project.slug}-title` : undefined

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      // Clicking the backdrop (the dialog element itself, outside the panel) closes it.
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 text-titanium backdrop:bg-carbon/85 backdrop:backdrop-blur-sm sm:m-auto sm:h-auto sm:max-h-[calc(100dvh-4rem)] sm:max-w-3xl"
    >
      {project && (
        <div className="flex h-full max-h-[inherit] flex-col border-pitlane bg-surface sm:border">
          <header className="flex items-start justify-between gap-4 border-b border-pitlane p-5 sm:p-8">
            <div className="min-w-0">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <p className="telemetry-label">
                  Case study <span className="text-lime">{String(number).padStart(2, '0')}</span>
                </p>
                <StatusPill status={project.status} />
              </div>
              <h2
                id={titleId}
                className="font-display text-[clamp(1.75rem,5vw,2.75rem)] leading-[0.95] font-bold tracking-[-0.02em] text-balance uppercase"
              >
                {project.name}
              </h2>
              <p className="mt-3 text-muted">{project.summary}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close case study"
              className="inline-flex size-11 shrink-0 items-center justify-center border border-pitlane transition-colors hover:border-lime"
            >
              <X aria-hidden="true" className="size-5" />
            </button>
          </header>

          <div className="overflow-y-auto overscroll-contain p-5 sm:p-8">
            <dl className="mb-8 grid gap-x-6 gap-y-3 font-mono text-xs tracking-[0.08em] uppercase sm:grid-cols-[auto_1fr]">
              <dt className="text-muted">Stack</dt>
              <dd>{project.stack.join(' · ')}</dd>
              {project.team && (
                <>
                  <dt className="text-muted">Team</dt>
                  <dd>{project.team}</dd>
                </>
              )}
              {project.role && (
                <>
                  <dt className="text-muted">My role</dt>
                  <dd className="font-sans text-sm tracking-normal normal-case">{project.role}</dd>
                </>
              )}
            </dl>

            {project.badge && (
              <p className="mb-8 flex gap-3 border-l border-lime pl-4 text-sm leading-relaxed">
                <Award aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-lime" />
                {project.badge}
              </p>
            )}

            <ol className="space-y-8">
              {filled.map(({ key, label }, i) => {
                const value = project.caseStudy[key]
                return (
                  <li key={key} className="grid gap-3 border-t border-pitlane pt-5 sm:grid-cols-[10rem_1fr] sm:gap-6">
                    <h3 className="telemetry-label">
                      <span className="text-lime">{String(i + 1).padStart(2, '0')}</span> {label}
                    </h3>
                    {Array.isArray(value) ? (
                      <ul className="space-y-2.5">
                        {value.map((item) => (
                          <li key={item} className="flex gap-3 leading-relaxed">
                            <span aria-hidden="true" className="mt-3 h-px w-3 shrink-0 bg-lime" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="leading-relaxed">{value}</p>
                    )}
                  </li>
                )
              })}
            </ol>

            <div className="mt-10 empty:hidden">
              <ProjectLinks links={project.links} name={project.name} />
            </div>
          </div>
        </div>
      )}
    </dialog>
  )
}
