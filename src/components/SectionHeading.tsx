type Props = {
  /** Sector number, e.g. 2 → "SECTOR 02". */
  sector: number
  /** Race-metaphor label, e.g. "Projects". */
  label: string
  title: string
  id?: string
}

export function SectionHeading({ sector, label, title, id }: Props) {
  return (
    <div data-reveal className="mb-10 flex flex-col gap-3 md:mb-14">
      <p className="telemetry-label">
        Sector {String(sector).padStart(2, '0')} <span className="text-lime">/</span> {label}
      </p>
      <h2
        id={id}
        className="slant font-display text-[clamp(2rem,6vw,4.5rem)] leading-[0.95] font-bold tracking-[-0.02em] uppercase"
      >
        {title}
      </h2>
    </div>
  )
}
