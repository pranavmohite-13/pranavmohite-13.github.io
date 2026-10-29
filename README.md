# pranavmohite-13.github.io

Personal portfolio of **Pranav Mohite**, a final-year cybersecurity student heading toward cloud security and DevSecOps.

**Live:** https://pranavmohite-13.github.io/

A fast, accessible single-page site styled like a race-engineering screen ("APEX: Performance Under Pressure"). No backend, no trackers, no analytics, and nothing measures how long anyone spends on the page.

## Features

- **Start lights:** a short intro on the first visit per browser session, with Skip intro (or Esc). Never shown with reduced motion.
- **Timing tower (desktop):** section nav with the live position, visited sections and a track map that follows scroll progress.
- **Telemetry HUD:** speed, gear, shift lights, throttle/brake, DRS, sectors and lap progress driven by how you scroll. Updated straight from a small store in one animation loop that stops when idle and pauses in background tabs, so scrolling never re-renders the app.
- **Hero throttle trace:** move a mouse or pen over the hero; cursor height feeds throttle and speed.
- **Projects leaderboard:** expandable rows with crew, key result, stats, links and a case-study dialog (problem → what I built → how I verified it → result).
- **Reaction test:** five lights, a random hold, and your reaction time with session best. Nothing is stored or sent.
- **Team radio:** a small command console in the HUD (`help`, `whoami`, `projects`, `resume`, `box box`, …).
- **Also:** stint cards for experience, grouped skills, a running strip and pace chart from Strava data, and a "Chequered flag · restart" button.
- **Accessibility:** one h1, landmarks, a skip link, visible focus rings, keyboard-operable controls and WCAG AA contrast. Decorations and the HUD readouts are hidden from screen readers. `prefers-reduced-motion` turns off the intro, streaks, smooth scrolling, scroll reveals and telemetry decay.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 (design tokens in `src/index.css`)
- Lucide icons and hand-written SVG for the telemetry line, track map and pace chart
- Self-hosted Space Grotesk, Inter and JetBrains Mono (Fontsource)
- Deployed to GitHub Pages with GitHub Actions

## Run locally

Requires Node.js 20.19+ (CI uses Node 24).

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # serve the build locally
npm run typecheck
npm run lint
```

## Editing content

All content lives in `src/data/`; components only render it.

| File | What it holds |
|---|---|
| `profile.ts` | Hero text, nav, about section, contact links, running goal |
| `projects.ts` | Leaderboard projects (crew, key result, stats), case studies and the "More builds" archive |
| `race.ts` | Timing-tower rows and HUD sector labels |
| `radio.ts` | Team radio commands and replies |
| `experience.ts` | Internships, newest first |
| `skills.ts` | Skill groups |
| `running.json` | Run log generated from Strava (see below) |

Empty fields are hidden rather than shown as placeholders. A project with `status: 'hidden'` doesn't render.

## Updating running data

Export your data from Strava (Settings → My Account → Download or Delete Your Account → Request your archive), then point the script at `activities.csv` from the archive:

```bash
npm run update-running -- path/to/activities.csv
```

This rewrites `src/data/running.json` with runs only, keeping just the date, distance, moving time, pace and elevation gain. GPS data, routes, activity names and everything else in the export are dropped.

## Social preview image

`public/og.png` and `public/apple-touch-icon.png` are rendered from HTML with a local Chrome or Edge:

```bash
npm run generate-og   # set CHROME_PATH if the browser isn't found
```

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`, which type-checks, lints, builds and deploys `dist/` to GitHub Pages.

## Copyright

© 2026 Pranav Mohite. All rights reserved.
