import { experience } from '@/data/experience'
import { SectionHeading } from '@/components/SectionHeading'
import { Timeline } from '@/components/Timeline'

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <SectionHeading id="experience-title" sector={3} label="Experience" title="Stint History" />
        <Timeline entries={experience} />
      </div>
    </section>
  )
}
