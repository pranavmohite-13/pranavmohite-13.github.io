import type { ReactNode } from 'react'
import { SectionHeading } from '@/components/SectionHeading'

type Props = {
  id: string
  /** Sector number shown in the label and as the ghost numeral. */
  sector: number
  /** Plain-word label, e.g. "Projects". */
  label: string
  /** Race-metaphor title, e.g. "The Garage". */
  title: string
  children: ReactNode
}

/**
 * Shell for every non-hero section: kerb stripe, ghost sector number, container and heading.
 * The ghost sits outside the revealed content so reveal transforms can't become its containing block.
 */
export function Section({ id, sector, label, title, children }: Props) {
  const titleId = `${id}-title`
  return (
    <section id={id} aria-labelledby={titleId} className="kerb relative isolate overflow-x-clip py-20 md:py-28">
      <span aria-hidden="true" className="ghost">
        {String(sector).padStart(2, '0')}
      </span>
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <SectionHeading id={titleId} sector={sector} label={label} title={title} />
        {children}
      </div>
    </section>
  )
}
