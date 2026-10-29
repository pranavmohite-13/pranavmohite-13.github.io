import { useId, useState } from 'react'
import { ArrowRight, Award } from 'lucide-react'
import type { Project } from '@/data/projects'
import { ProjectLinks } from '@/components/ProjectLinks'

type Props = {
  projects: Project[]
  onOpenCaseStudy: (project: Project, trigger: HTMLButtonElement) => void
  /** Slug of the row that starts expanded. */
  defaultOpen?: string
}

// POS · Project · Crew · Key result · Status
const COLUMNS = 'md:grid-cols-[56px_minmax(0,1.7fr)_minmax(0,1fr)_minmax(0,1.2fr)_130px]'

const statusLabel = (status: Project['status']) => (status === 'in-development' ? 'In development' : 'Shipped')

function Status({ project, className = '' }: { project: Project; className?: string }) {
  const dev = project.status === 'in-development'
  return (
    <span className={`font-mono text-[11px] tracking-[0.12em] uppercase ${dev ? 'text-[#FFB547]' : 'text-lime'} ${className}`}>
      <span className="sr-only">Status: </span>
      {statusLabel(project.status)}
    </span>
  )
}

type RowProps = {
  project: Project
  pos: string
  open: boolean
  onToggle: () => void
  onOpenCaseStudy: Props['onOpenCaseStudy']
}

function Row({ project, pos, open, onToggle, onOpenCaseStudy }: RowProps) {
  const id = useId()
  const buttonId = `${id}-row`
  const panelId = `${id}-panel`

  return (
    <li>
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className={`grid min-h-[72px] w-full grid-cols-[40px_minmax(0,1fr)] items-center gap-4 border-l-[3px] px-5 py-3 text-left transition-[transform,background-color,border-color] duration-200 hover:translate-x-1 hover:border-lime ${COLUMNS} ${
            open ? 'border-lime bg-[#1c211e]' : 'border-pitlane bg-surface'
          }`}
        >
          <span className="font-mono text-xl font-bold text-lime">{pos}</span>
          <span className="min-w-0">
            <span className="block font-display text-xl leading-tight font-bold uppercase">{project.name}</span>
            <span className="mt-1 block text-[13px] leading-normal text-muted">{project.summary}</span>
            <Status project={project} className="mt-2 block md:hidden" />
          </span>
          <span className="hidden font-mono text-xs text-muted md:block">
            <span className="sr-only">Crew: </span>
            {project.crew}
          </span>
          <span className="hidden font-mono text-[13px] md:block">
            <span className="sr-only">Key result: </span>
            {project.keyResult}
          </span>
          <Status project={project} className="hidden md:block" />
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!open}
        className="border-l-[3px] border-lime bg-[#121513] px-5 pt-[22px] pb-6 md:pl-[79px]"
      >
        {project.stats.length > 0 && (
          <dl className="grid gap-5 sm:grid-cols-3">
            {project.stats.map((stat) => (
              <div key={stat.value} className="flex flex-col">
                <dt className="order-last mt-1 text-[13px] leading-normal text-muted">{stat.text}</dt>
                <dd className="font-mono text-[26px] leading-tight font-bold text-lime">{stat.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {project.badge && (
          <p className="mt-5 flex gap-3 text-sm leading-relaxed">
            <Award aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-lime" />
            {project.badge}
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-1.5">
          <ul aria-label="Stack" className="flex flex-wrap gap-1.5">
            {project.stack.map((tag) => (
              <li key={tag} className="border border-pitlane px-2.5 py-1 font-mono text-[11px] tracking-[0.08em] uppercase">
                {tag}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3 sm:ml-auto">
            <ProjectLinks links={project.links} name={project.name} />
            <button
              type="button"
              onClick={(e) => onOpenCaseStudy(project, e.currentTarget)}
              aria-haspopup="dialog"
              className="inline-flex min-h-11 items-center gap-2 bg-titanium px-5 font-mono text-xs font-semibold tracking-[0.12em] text-carbon uppercase transition-colors hover:bg-lime"
            >
              Case study<span className="sr-only">: {project.name}</span>
              <ArrowRight aria-hidden="true" className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </li>
  )
}

/** Projects as a race leaderboard: one row per project, click to expand. One row open at a time. */
export function Leaderboard({ projects, onOpenCaseStudy, defaultOpen }: Props) {
  const [openSlug, setOpenSlug] = useState(defaultOpen ?? '')

  return (
    <div data-reveal>
      <div aria-hidden="true" className={`hidden gap-4 px-[23px] pb-2.5 md:grid ${COLUMNS}`}>
        {['Pos', 'Project', 'Crew', 'Key result', 'Status'].map((label) => (
          <span key={label} className="telemetry-label">
            {label}
          </span>
        ))}
      </div>
      <ol className="flex flex-col gap-1.5">
        {projects.map((project, i) => (
          <Row
            key={project.slug}
            project={project}
            pos={String(i + 1).padStart(2, '0')}
            open={openSlug === project.slug}
            onToggle={() => setOpenSlug((current) => (current === project.slug ? '' : project.slug))}
            onOpenCaseStudy={onOpenCaseStudy}
          />
        ))}
      </ol>
    </div>
  )
}
