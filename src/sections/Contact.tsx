import type { ReactNode } from 'react'
import { ArrowUpRight, FileText, Mail } from 'lucide-react'
import { contact, profile } from '@/data/profile'
import { SectionHeading } from '@/components/SectionHeading'
import { GitHubMark } from '@/components/GitHubMark'
import { LinkedInMark } from '@/components/LinkedInMark'

type Channel = { label: string; value: string; href: string; icon: ReactNode; external: boolean }

const channels: Channel[] = [
  { label: 'GitHub', value: contact.github.replace('https://', ''), href: contact.github, icon: <GitHubMark className="size-5" />, external: true },
  {
    label: 'LinkedIn',
    value: contact.linkedin.replace('https://www.', '').replace(/\/$/, ''),
    href: contact.linkedin,
    icon: <LinkedInMark className="size-5" />,
    external: true,
  },
  { label: 'Résumé', value: 'PDF', href: profile.resumeUrl, icon: <FileText aria-hidden="true" className="size-5" />, external: true },
]

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <SectionHeading id="contact-title" sector={7} label="Contact" title="Pit Wall" />

        <p className="max-w-2xl text-xl leading-relaxed text-titanium md:text-2xl">{contact.invitation}</p>

        <a
          href={`mailto:${contact.email}`}
          aria-label={`Email ${contact.email}`}
          className="group mt-10 flex flex-col gap-3 border border-pitlane bg-surface p-5 transition-colors hover:border-lime sm:p-8 md:flex-row md:items-center md:justify-between"
        >
          <span className="flex items-center gap-3">
            <Mail aria-hidden="true" className="size-5 text-lime" />
            <span className="telemetry-label">Email</span>
          </span>
          <span className="flex items-center gap-3 font-display text-[clamp(1.25rem,4.6vw,2.5rem)] font-bold">
            {/* Allow the address to wrap only after the @. */}
            <span>
              {contact.email.split('@')[0]}@<wbr />
              {contact.email.split('@')[1]}
            </span>
            <ArrowUpRight
              aria-hidden="true"
              className="size-6 shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-lime"
            />
          </span>
        </a>

        <ul className="mt-px grid gap-px border border-t-0 border-pitlane bg-pitlane sm:grid-cols-3">
          {channels.map((c) => (
            <li key={c.label}>
              <a
                href={c.href}
                {...(c.external ? { target: '_blank', rel: 'noopener' } : {})}
                className="group flex h-full min-h-20 items-center justify-between gap-4 bg-carbon p-5 transition-colors hover:bg-surface"
              >
                <span className="flex items-center gap-3">
                  <span className="text-muted transition-colors group-hover:text-lime">{c.icon}</span>
                  <span>
                    <span className="block font-medium">{c.label}</span>
                    <span className="block font-mono text-xs text-muted">{c.value}</span>
                  </span>
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
