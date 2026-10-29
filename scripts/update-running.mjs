#!/usr/bin/env node
// Regenerate src/data/running.json from a Strava bulk-export activities.csv.
//
//   npm run update-running -- path/to/activities.csv [output.json]
//
// Only these fields are kept per run: date, distanceKm, movingTimeSec,
// paceSecPerKm, elevationGainM. Names, descriptions, GPS, routes, devices,
// heart rate and everything else in the export are dropped.

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const [input, output = resolve(root, 'src/data/running.json')] = process.argv.slice(2)

if (!input) {
  console.error('Usage: npm run update-running -- path/to/activities.csv [output.json]')
  process.exit(1)
}

/** RFC 4180 CSV: quoted fields, escaped quotes, commas and newlines inside quotes. */
function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"'
        i++
      } else if (c === '"') quoted = false
      else field += c
    } else if (c === '"') quoted = true
    else if (c === ',') {
      row.push(field)
      field = ''
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else field += c
  }
  if (field !== '' || row.length) {
    row.push(field)
    rows.push(row)
  }
  return rows.filter((r) => r.some((f) => f.trim() !== ''))
}

const MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 }

/** Strava writes "Jan 20, 2026, 7:12:34 AM"; also accept ISO "2026-01-20...". Returns "YYYY-MM-DD". */
function toIsoDate(value) {
  const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`
  const m = value.match(/^([A-Za-z]{3})[a-z]*\.? (\d{1,2}), (\d{4})/)
  if (m && MONTHS[m[1].toLowerCase()]) {
    return `${m[3]}-${String(MONTHS[m[1].toLowerCase()]).padStart(2, '0')}-${m[2].padStart(2, '0')}`
  }
  return null
}

const num = (v) => {
  const n = Number(String(v ?? '').replace(/,/g, '').trim())
  return Number.isFinite(n) ? n : NaN
}
const round = (n, d) => Math.round(n * 10 ** d) / 10 ** d

const [header, ...records] = parseCsv(readFileSync(input, 'utf8').replace(/^\uFEFF/, ''))
if (!header) {
  console.error('The CSV is empty.')
  process.exit(1)
}

// Strava repeats some column names: the first "Distance" is in km, a later one in metres.
const indexes = (name) => header.reduce((acc, h, i) => (h.trim().toLowerCase() === name ? [...acc, i] : acc), [])
const col = {
  date: indexes('activity date')[0],
  type: indexes('activity type')[0],
  distance: indexes('distance'),
  moving: indexes('moving time')[0],
  elapsed: indexes('elapsed time')[0],
  elevation: indexes('elevation gain')[0],
}
if (col.date === undefined || col.type === undefined || col.distance.length === 0) {
  console.error('Missing required columns ("Activity Date", "Activity Type", "Distance"). Is this a Strava activities.csv?')
  process.exit(1)
}

let skipped = 0
const runs = []
for (const r of records) {
  if ((r[col.type] ?? '').trim().toLowerCase() !== 'run') continue

  const date = toIsoDate((r[col.date] ?? '').trim())
  // Prefer the metres column (more precise) when present; fall back to km.
  const metres = col.distance.length > 1 ? num(r[col.distance[1]]) : NaN
  const distanceKm = Number.isFinite(metres) && metres > 0 ? metres / 1000 : num(r[col.distance[0]])
  const movingTimeSec = num(r[col.moving ?? col.elapsed])
  const elevation = col.elevation === undefined ? 0 : num(r[col.elevation])

  if (!date || !(distanceKm > 0) || !(movingTimeSec > 0)) {
    skipped++
    continue
  }
  runs.push({
    date,
    distanceKm: round(distanceKm, 2),
    movingTimeSec: Math.round(movingTimeSec),
    paceSecPerKm: Math.round(movingTimeSec / distanceKm),
    elevationGainM: Number.isFinite(elevation) ? round(elevation, 1) : 0,
  })
}
runs.sort((a, b) => a.date.localeCompare(b.date))

if (runs.length === 0) {
  console.error('No runs found. Nothing written.')
  process.exit(1)
}

const totalDistanceKm = runs.reduce((s, r) => s + r.distanceKm, 0)
const totalMovingTimeSec = runs.reduce((s, r) => s + r.movingTimeSec, 0)
const result = {
  source:
    'Strava export (activities.csv), distances and moving times as recorded by Strava. No GPS or route data included.',
  summary: {
    runs: runs.length,
    totalDistanceKm: round(totalDistanceKm, 1),
    totalMovingTimeSec,
    avgPaceSecPerKm: Math.round(totalMovingTimeSec / totalDistanceKm),
    longestRunKm: Math.max(...runs.map((r) => r.distanceKm)),
    fastestPaceSecPerKm: Math.min(...runs.map((r) => r.paceSecPerKm)),
    totalElevationGainM: Math.round(runs.reduce((s, r) => s + r.elevationGainM, 0)),
    firstRun: runs[0].date,
    lastRun: runs[runs.length - 1].date,
  },
  runs,
}

writeFileSync(output, JSON.stringify(result, null, 2) + '\n')
console.log(`Wrote ${runs.length} runs to ${output}${skipped ? ` (skipped ${skipped} incomplete rows)` : ''}.`)
