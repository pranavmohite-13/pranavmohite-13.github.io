# pranavmohite-13.github.io

Personal portfolio of **Pranav Mohite**, a final-year cybersecurity student heading toward cloud security and DevSecOps.

**Live:** https://pranavmohite-13.github.io/

A fast, accessible single-page site with a motorsport-telemetry look: projects with case studies, experience, skills, a small running log, and contact links. No backend, no trackers, no analytics.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 (design tokens in `src/index.css`)
- Lucide icons and hand-written SVG for the telemetry line and pace chart
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
| `projects.ts` | Featured projects, case studies and the "More builds" archive |
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
