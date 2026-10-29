import { Navbar } from '@/components/Navbar'
import { Hero } from '@/sections/Hero'
import { Projects } from '@/sections/Projects'
import { navItems } from '@/data/profile'

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
        {/* Remaining sections are filled in later stages; anchors exist now so navigation works. */}
        {navItems.filter((item) => item.id !== 'projects').map((item) => (
          <section key={item.id} id={item.id} className="scroll-mt-20" />
        ))}
      </main>
    </div>
  )
}
