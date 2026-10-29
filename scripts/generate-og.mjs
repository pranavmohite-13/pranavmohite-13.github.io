#!/usr/bin/env node
// Render public/og.png (1200×630) and public/apple-touch-icon.png (180×180)
// with the site's own fonts, using a local headless Chrome or Edge.
//
//   npm run generate-og
//
// Set CHROME_PATH if the browser isn't in a standard location.

import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const font = (pkg, file) => pathToFileURL(join(root, 'node_modules/@fontsource-variable', pkg, 'files', file)).href

const candidates = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean)
const browser = candidates.find((p) => existsSync(p))
if (!browser) {
  console.error('No Chrome/Edge found. Set CHROME_PATH.')
  process.exit(1)
}

const base = `
  @font-face { font-family: 'SG'; src: url('${font('space-grotesk', 'space-grotesk-latin-wght-normal.woff2')}'); font-weight: 300 700; font-display: block; }
  @font-face { font-family: 'JBM'; src: url('${font('jetbrains-mono', 'jetbrains-mono-latin-wght-normal.woff2')}'); font-weight: 100 800; font-display: block; }
  * { margin: 0; box-sizing: border-box; }
  html, body { background: #0B0D0C; color: #E9ECE8; overflow: hidden; }
  .lime { color: #C5F36A; }
`

// Same stylised trace as the hero's TelemetryLine (decorative, not data).
const trace =
  'M0 118 L70 116 C110 114 130 60 170 46 L300 40 C330 39 345 96 372 112 C392 122 410 110 430 84 C455 52 480 36 520 34 L610 32 C640 31 652 128 690 132 C720 134 735 100 760 76 C790 48 820 42 860 40 L930 39 C960 39 972 88 996 98 C1018 106 1032 70 1060 56 C1090 42 1130 40 1200 38'

const og = `<!doctype html><html><head><meta charset="utf-8"><style>${base}
  body { width: 1200px; height: 630px; position: relative; font-family: 'SG'; }
  .grid { position: absolute; inset: 0 64px; display: grid; grid-template-columns: repeat(8, 1fr); }
  .grid div { border-left: 1px solid rgba(39,44,41,.7); } .grid div:last-child { border-right: 1px solid rgba(39,44,41,.7); }
  .wrap { position: absolute; inset: 56px 64px; display: flex; flex-direction: column; }
  .label { font-family: 'JBM'; font-size: 20px; letter-spacing: .14em; color: #9BA29B; text-transform: uppercase; display: flex; align-items: center; gap: 16px; }
  .label i { display: block; width: 40px; height: 2px; background: #C5F36A; }
  .mark { margin-top: 36px; font-size: 168px; font-weight: 700; line-height: .85; letter-spacing: -.02em; }
  .name { margin-top: 36px; font-size: 52px; font-weight: 500; letter-spacing: .02em; text-transform: uppercase; }
  .tag { margin-top: 10px; font-size: 52px; font-weight: 700; letter-spacing: -.01em; text-transform: uppercase; }
  .foot { margin-top: auto; display: flex; justify-content: space-between; font-family: 'JBM'; font-size: 20px; letter-spacing: .12em; text-transform: uppercase; color: #9BA29B; }
  svg { position: absolute; left: 64px; right: 64px; bottom: 96px; width: 1072px; height: 110px; }
</style></head><body>
  <div class="grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
  <svg viewBox="0 0 1200 160" preserveAspectRatio="none"><path d="${trace}" fill="none" stroke="#C5F36A" stroke-opacity=".35" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>
  <div class="wrap">
    <p class="label"><i></i>Driver 13 · Pune, IN</p>
    <p class="mark">PM<span class="lime">///</span></p>
    <p class="name">Pranav Mohite</p>
    <p class="tag">Performance under pressure<span class="lime">.</span></p>
    <div class="foot"><span>Cybersecurity / DevSecOps / Endurance</span><span>pranavmohite-13.github.io</span></div>
  </div>
</body></html>`

const icon = `<!doctype html><html><head><meta charset="utf-8"><style>${base}
  body { width: 180px; height: 180px; display: grid; place-items: center; font-family: 'SG'; }
  p { font-size: 58px; font-weight: 700; letter-spacing: -.03em; line-height: 1; }
</style></head><body><p>PM<span class="lime">///</span></p></body></html>`

const tmp = mkdtempSync(join(tmpdir(), 'og-'))
try {
  for (const [name, html, w, h] of [
    ['og.png', og, 1200, 630],
    ['apple-touch-icon.png', icon, 180, 180],
  ]) {
    const page = join(tmp, name + '.html')
    writeFileSync(page, html)
    execFileSync(browser, [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      `--user-data-dir=${join(tmp, 'profile')}`,
      `--window-size=${w},${h}`,
      '--virtual-time-budget=3000',
      `--screenshot=${join(root, 'public', name)}`,
      pathToFileURL(page).href,
    ], { stdio: 'ignore' })
    console.log(`Wrote public/${name}`)
  }
} finally {
  rmSync(tmp, { recursive: true, force: true })
}
