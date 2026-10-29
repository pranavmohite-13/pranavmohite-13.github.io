import { useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { TimingTower } from '@/components/TimingTower'
import { TelemetryHud } from '@/components/TelemetryHud'
import { StartLights } from '@/components/StartLights'
import { Hero } from '@/sections/Hero'
import { Projects } from '@/sections/Projects'
import { Experience } from '@/sections/Experience'
import { Skills } from '@/sections/Skills'
import { Running } from '@/sections/Running'
import { About } from '@/sections/About'
import { Contact } from '@/sections/Contact'
import { Footer } from '@/sections/Footer'
import { useReveal } from '@/hooks/useReveal'
import { startTelemetry } from '@/telemetry/engine'

export default function App() {
  useReveal()
  useEffect(() => startTelemetry(), [])

  return (
    <div id="top">
      {/* First in the DOM so "Skip intro" is the first tab stop while the lights run. */}
      <StartLights />
      <a
        href="#main"
        className="fixed top-2 left-2 z-[60] -translate-y-24 bg-lime px-4 py-3 font-mono text-xs tracking-[0.12em] text-carbon uppercase focus:translate-y-0"
      >
        Skip to content
      </a>
      <Navbar />
      <TimingTower />
      {/* Room for the fixed tower (left, ≥1024px) and telemetry HUD (bottom). */}
      <div className="pb-14 lg:pb-20 lg:pl-[232px]">
        <main id="main" tabIndex={-1} className="outline-none">
          <Hero />
          <Projects />
          <Experience />
          <Skills />
          <Running />
          <About />
          <Contact />
        </main>
        <Footer />
      </div>
      <TelemetryHud />
    </div>
  )
}
