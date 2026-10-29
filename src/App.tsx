import { Navbar } from '@/components/Navbar'
import { Hero } from '@/sections/Hero'
import { Projects } from '@/sections/Projects'
import { Experience } from '@/sections/Experience'
import { Skills } from '@/sections/Skills'
import { Running } from '@/sections/Running'
import { About } from '@/sections/About'
import { Contact } from '@/sections/Contact'
import { Footer } from '@/sections/Footer'
import { useReveal } from '@/hooks/useReveal'

export default function App() {
  useReveal()

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
        <Running />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
