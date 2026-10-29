import { ArrowUpRight } from 'lucide-react'
import { GitHubMark } from '@/components/GitHubMark'
import type { ProjectLinks as Links } from '@/data/projects'

const buttonClass =
  'inline-flex min-h-11 items-center gap-2 border border-pitlane px-4 font-mono text-xs tracking-[0.12em] uppercase transition-colors hover:border-lime'

/** Renders only the links that exist. Renders nothing when there are none. */
export function ProjectLinks({ links, name }: { links: Links; name: string }) {
  if (!links.github && !links.demo) return null
  return (
    <div className="flex flex-wrap gap-3">
      {links.github && (
        <a href={links.github} target="_blank" rel="noopener" className={buttonClass} aria-label={`${name} on GitHub`}>
          <GitHubMark className="size-4" />
          GitHub
        </a>
      )}
      {links.demo && (
        <a href={links.demo} target="_blank" rel="noopener" className={buttonClass} aria-label={`${name} live demo`}>
          Demo
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </a>
      )}
    </div>
  )
}
