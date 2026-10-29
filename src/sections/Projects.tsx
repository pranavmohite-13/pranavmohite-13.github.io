import { useCallback, useRef, useState } from 'react'
import { visibleArchive, visibleProjects, type Project } from '@/data/projects'
import { Section } from '@/components/Section'
import { Leaderboard } from '@/components/Leaderboard'
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
    // Return focus to the button that opened the case study.
    requestAnimationFrame(() => triggerRef.current?.focus())
  }, [])

  return (
    <Section id="projects" sector={2} label="Projects" title="The Garage">
      <Leaderboard projects={visibleProjects} onOpenCaseStudy={handleOpen} defaultOpen="oceanmind" />

      {visibleArchive.length > 0 && (
        <div className="mt-20 md:mt-28">
          <div className="mb-8 flex items-baseline justify-between gap-4">
            <h3 className="font-display text-2xl font-bold tracking-[-0.01em] uppercase md:text-3xl">More builds</h3>
            <p className="telemetry-label">Archive</p>
          </div>
          <ArchiveGrid entries={visibleArchive} />
        </div>
      )}

      <CaseStudy
        project={open}
        number={open ? visibleProjects.indexOf(open) + 1 : 0}
        onClose={handleClose}
      />
    </Section>
  )
}
