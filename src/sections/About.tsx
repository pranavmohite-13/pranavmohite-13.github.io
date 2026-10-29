import type { ReactNode } from 'react'
import { about } from '@/data/profile'
import { Section } from '@/components/Section'

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-t border-pitlane pt-5">
      <h3 className="telemetry-label mb-4">{title}</h3>
      {children}
    </div>
  )
}

function TitledList({ items }: { items: readonly { title: string; detail: string }[] }) {
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.title}>
          <p className="font-medium text-titanium">{item.title}</p>
          <p className="mt-0.5 text-sm text-muted">{item.detail}</p>
        </li>
      ))}
    </ul>
  )
}

export function About() {
  const { education } = about
  return (
    <Section id="about" sector={7} label="About" title="Driver profile">
      <div data-reveal className="grid gap-12 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-7">
          <div className="space-y-4 text-lg leading-relaxed text-titanium md:text-xl">
            {about.bio.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <p className="mt-8 border-l border-lime pl-4 text-muted">{about.direction}</p>
        </div>

        <div className="lg:col-span-4 lg:col-start-9">
          <Panel title="Education">
            <p className="font-medium text-titanium">{education.degree}</p>
            <p className="mt-0.5 text-sm text-muted">{education.school}</p>
            <p className="mt-3 font-mono text-xs tracking-[0.12em] uppercase">
              {education.dates} <span className="text-muted">·</span> <span className="text-lime">{education.grade}</span>
            </p>
          </Panel>
        </div>
      </div>

      <div data-reveal className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        <Panel title="Achievements">
          <TitledList items={about.achievements} />
        </Panel>
        <Panel title="Certifications">
          <TitledList items={about.certifications} />
        </Panel>
        <Panel title="Languages">
          <ul className="flex flex-wrap gap-2">
            {about.languages.map((lang) => (
              <li key={lang} className="border border-pitlane px-3 py-1.5 text-sm">
                {lang}
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </Section>
  )
}
