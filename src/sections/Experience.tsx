import { experience } from '@/data/experience'
import { Section } from '@/components/Section'
import { Timeline } from '@/components/Timeline'

export function Experience() {
  return (
    <Section id="experience" sector={3} label="Experience" title="Stint history">
      <Timeline entries={experience} />
    </Section>
  )
}
