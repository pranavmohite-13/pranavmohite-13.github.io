import { Navbar } from '@/components/Navbar'
import { Hero } from '@/sections/Hero'
import { Projects } from '@/sections/Projects'
import { Experience } from '@/sections/Experience'
import { Skills } from '@/sections/Skills'
import { About } from '@/sections/About'

export default function App() {
  return (
    <div id="top">
      <a
        href="#main"
        className="fixed top-2 left-2 z-[60] -translate-y-24 bg-lime px-4 py-3 font-mono text-xs tracking-[0.12em] text-carbon uppercase focus:translate-y-0"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Projects />
        <Experience />
        <Skills />
        {/* Running and Contact arrive in Stage 4; anchors exist now so navigation works. */}
        <section id="running" className="scroll-mt-20" />
        <About />
        <section id="contact" className="scroll-mt-20" />
      </main>
    </div>
  )
}
