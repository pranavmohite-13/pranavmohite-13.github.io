import { skillGroups } from '@/data/skills'
import { SectionHeading } from '@/components/SectionHeading'
import { SkillGroup } from '@/components/SkillGroup'

export function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <SectionHeading id="skills-title" sector={4} label="Skills" title="Telemetry" />
        <div className="border-t border-pitlane">
          {skillGroups.map((group, i) => (
            <SkillGroup key={group.name} group={group} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
