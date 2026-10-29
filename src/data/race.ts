// Race structure for the timing tower and telemetry HUD. Labels are content; edit here.

export type RaceSector = 1 | 2 | 3

export type RaceSection = {
  /** Element id the row scrolls to; "top" is the hero. */
  id: string
  pos: string
  label: string
  sector: RaceSector
}

export const raceSections: RaceSection[] = [
  { id: 'top', pos: 'P1', label: 'Home', sector: 1 },
  { id: 'projects', pos: 'P2', label: 'Projects', sector: 1 },
  { id: 'experience', pos: 'P3', label: 'Experience', sector: 2 },
  { id: 'skills', pos: 'P4', label: 'Skills', sector: 2 },
  { id: 'running', pos: 'P5', label: 'Running', sector: 3 },
  // P6 Reaction ("reaction") joins when that section ships.
  { id: 'about', pos: 'P7', label: 'About', sector: 3 },
  { id: 'contact', pos: 'P8', label: 'Contact', sector: 3 },
]

export const raceSectors: { n: RaceSector; label: string }[] = [
  { n: 1, label: 'Garage' },
  { n: 2, label: 'Stints' },
  { n: 3, label: 'Pit wall' },
]
