import { ArrowUp, Mail } from 'lucide-react'
import { contact, navItems, profile } from '@/data/profile'
import { GitHubMark } from '@/components/GitHubMark'
import { LinkedInMark } from '@/components/LinkedInMark'

const iconLink =
  'inline-flex size-11 items-center justify-center border border-pitlane text-muted transition-colors hover:border-lime hover:text-titanium'

export function Footer() {
  return (
    <footer className="border-t border-pitlane">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-4 py-12 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <a href="#top" className="flex min-h-11 items-center font-display text-lg font-bold tracking-[0.08em] uppercase">
            {profile.name}
            <span className="ml-2 text-lime">///</span>
          </a>

          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-8 sm:flex sm:flex-wrap sm:gap-x-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="flex min-h-11 items-center font-mono text-xs tracking-[0.12em] text-muted uppercase transition-colors hover:text-titanium sm:px-3"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col-reverse gap-6 border-t border-pitlane pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs tracking-[0.08em] text-muted">© 2026 {profile.name}</p>

          <div className="flex items-center gap-2">
            <a href={contact.github} target="_blank" rel="noopener" aria-label="GitHub" className={iconLink}>
              <GitHubMark className="size-4" />
            </a>
            <a href={contact.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn" className={iconLink}>
              <LinkedInMark className="size-4" />
            </a>
            <a href={`mailto:${contact.email}`} aria-label="Email" className={iconLink}>
              <Mail aria-hidden="true" className="size-4" />
            </a>
            <a
              href="#top"
              className="ml-2 inline-flex min-h-11 items-center gap-2 font-mono text-xs tracking-[0.12em] text-muted uppercase transition-colors hover:text-titanium"
            >
              Back to top
              <ArrowUp aria-hidden="true" className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
