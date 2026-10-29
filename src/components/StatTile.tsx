type Props = {
  label: string
  value: string
  unit?: string
  note?: string
}

export function StatTile({ label, value, unit, note }: Props) {
  return (
    <div className="flex flex-col gap-2 bg-surface p-4 sm:p-5">
      <dt className="telemetry-label">{label}</dt>
      <dd className="order-first font-mono text-2xl leading-none font-medium text-titanium sm:text-3xl">
        {value}
        {unit && <span className="ml-1 text-sm text-muted">{unit}</span>}
      </dd>
      {note && <dd className="text-xs text-muted">{note}</dd>}
    </div>
  )
}
