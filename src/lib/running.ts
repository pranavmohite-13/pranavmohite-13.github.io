import data from '@/data/running.json'

export type Run = {
  date: string
  distanceKm: number
  movingTimeSec: number
  paceSecPerKm: number
  elevationGainM: number
}

export type RunningSummary = {
  runs: number
  totalKm: number
  totalMovingTimeSec: number
  /** Overall pace: total time over total distance, not a mean of per-run paces. */
  avgPaceSecPerKm: number
  longestRun: Run
  fastestRun: Run
  slowestRun: Run
  firstDate: string
  lastDate: string
}

/** Runs sorted oldest first. */
export const runs: Run[] = [...(data.runs as Run[])].sort((a, b) => a.date.localeCompare(b.date))

export function summarise(list: Run[]): RunningSummary | null {
  const first = list[0]
  const last = list[list.length - 1]
  if (!first || !last) return null

  const totalKm = list.reduce((sum, r) => sum + r.distanceKm, 0)
  const totalMovingTimeSec = list.reduce((sum, r) => sum + r.movingTimeSec, 0)
  const pick = (better: (a: Run, b: Run) => boolean) => list.reduce((best, r) => (better(r, best) ? r : best), first)

  return {
    runs: list.length,
    totalKm,
    totalMovingTimeSec,
    avgPaceSecPerKm: totalMovingTimeSec / totalKm,
    longestRun: pick((a, b) => a.distanceKm > b.distanceKm),
    fastestRun: pick((a, b) => a.paceSecPerKm < b.paceSecPerKm),
    slowestRun: pick((a, b) => a.paceSecPerKm > b.paceSecPerKm),
    firstDate: first.date,
    lastDate: last.date,
  }
}

export const summary = summarise(runs)
