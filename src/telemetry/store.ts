import { useSyncExternalStore } from 'react'
import type { RaceSector } from '@/data/race'

/**
 * Fast-changing telemetry. Never React state: the engine writes it and DOM sinks read it
 * inside a single requestAnimationFrame loop.
 */
export type FastTelemetry = {
  /** 0–340 km/h. */
  speed: number
  /** 0–100 %. */
  thr: number
  /** 0–100 %. */
  brk: number
  /** Page scroll progress, 0–1. */
  progress: number
}

/**
 * Slow-changing race state. Subscribers are notified only when a value actually changes,
 * so React re-renders at most on section changes. Nothing here records time.
 */
export type RaceState = {
  activeId: string
  visited: ReadonlySet<string>
  maxSector: RaceSector
  /** Page scrolled past the top few pixels (header background). */
  scrolled: boolean
}

export const fast: FastTelemetry = { speed: 0, thr: 0, brk: 0, progress: 0 }

let race: RaceState = { activeId: 'top', visited: new Set(['top']), maxSector: 1, scrolled: false }
const listeners = new Set<() => void>()

export function getRaceState(): RaceState {
  return race
}

export function updateRaceState(next: { activeId: string; sector: RaceSector; scrolled: boolean }) {
  const addVisit = !race.visited.has(next.activeId)
  const maxSector = Math.max(race.maxSector, next.sector) as RaceSector
  if (!addVisit && next.activeId === race.activeId && maxSector === race.maxSector && next.scrolled === race.scrolled) return
  race = {
    activeId: next.activeId,
    visited: addVisit ? new Set([...race.visited, next.activeId]) : race.visited,
    maxSector,
    scrolled: next.scrolled,
  }
  listeners.forEach((fn) => fn())
}

function subscribe(fn: () => void) {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

export function useRaceState(): RaceState {
  return useSyncExternalStore(subscribe, getRaceState, getRaceState)
}
