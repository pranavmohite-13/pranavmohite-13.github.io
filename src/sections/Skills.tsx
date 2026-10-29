import { skillGroups } from '@/data/skills'
import { Section } from '@/components/Section'
import { SkillGroup } from '@/components/SkillGroup'

export function Skills() {
  return (
    <Section id="skills" sector={4} label="Skills" title="Telemetry">
      <div className="border-t border-pitlane">
        {skillGroups.map((group, i) => (
          <SkillGroup key={group.name} group={group} index={i} />
        ))}
      </div>
    </Section>
  )
}
