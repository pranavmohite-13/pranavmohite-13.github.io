import { useCallback, useRef, useState } from 'react'
import { visibleArchive, visibleProjects, type Project } from '@/data/projects'
import { SectionHeading } from '@/components/SectionHeading'
import { ProjectCard } from '@/components/ProjectCard'
import { CaseStudy } from '@/components/CaseStudy'
import { ArchiveGrid } from '@/components/ArchiveGrid'

export function Projects() {
  const [open, setOpen] = useState<Project | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  const handleOpen = useCallback((project: Project, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger
    setOpen(project)
  }, [])

  const handleClose = useCallback(() => {
    setOpen(null)
    // Return focus to the card button that opened the case study.
    requestAnimationFrame(() => triggerRef.current?.focus())
  }, [])

  return (
    <section id="projects" aria-labelledby="projects-title" className="scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <SectionHeading id="projects-title" sector={2} label="Projects" title="The Garage" />

        <div className="flex flex-col gap-6 md:gap-8">
          {visibleProjects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} onOpen={handleOpen} />
          ))}
        </div>

        {visibleArchive.length > 0 && (
          <div className="mt-20 md:mt-28">
            <div className="mb-8 flex items-baseline justify-between gap-4">
              <h3 className="font-display text-2xl font-bold tracking-[-0.01em] uppercase md:text-3xl">More builds</h3>
              <p className="telemetry-label">Archive</p>
            </div>
            <ArchiveGrid entries={visibleArchive} />
          </div>
        )}
      </div>

      <CaseStudy
        project={open}
        number={open ? visibleProjects.indexOf(open) + 1 : 0}
        onClose={handleClose}
      />
    </section>
  )
}
