import type { SkillGroup as Group } from '@/data/skills'

/** One telemetry row: channel number + group name on the left, tags on the right. */
export function SkillGroup({ group, index }: { group: Group; index: number }) {
  const headingId = `skills-${group.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
  return (
    <div data-reveal role="group" aria-labelledby={headingId} className="grid gap-4 border-b border-pitlane py-6 md:grid-cols-12 md:gap-6">
      <div className="flex items-baseline gap-4 md:col-span-4 lg:col-span-3">
        <span aria-hidden="true" className="font-mono text-xs text-lime">
          CH{String(index + 1).padStart(2, '0')}
        </span>
        <h3 id={headingId} className="font-display text-lg font-bold tracking-[0.01em] uppercase md:text-xl">
          {group.name}
        </h3>
      </div>
      <ul className="flex flex-wrap content-start items-start gap-2 md:col-span-8 lg:col-span-9">
        {group.skills.map((skill) => (
          <li key={skill} className="border border-pitlane bg-surface px-3 py-1.5 text-sm text-titanium">
            {skill}
          </li>
        ))}
      </ul>
    </div>
  )
}
