import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { navItems, profile } from '@/data/profile'
import { useScrollState } from '@/hooks/useScrollState'

const sectionIds = navItems.map((item) => item.id)

function Wordmark() {
  return (
    <a
      href="#top"
      aria-label={`${profile.name}, back to top`}
      className="flex min-h-11 items-center font-display text-[0.95rem] font-bold tracking-[0.08em] uppercase"
    >
      <span className="hidden sm:inline">{profile.name}</span>
      <span className="sm:hidden">{profile.shortMark}</span>
      <span className="ml-1.5 text-lime sm:ml-2">///</span>
    </a>
  )
}

export function Navbar() {
  const { scrolled, activeId } = useScrollState(sectionIds)
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const toggleRef = useRef<HTMLButtonElement>(null)
  const trapRef = useRef<HTMLDivElement>(null)

  const close = useCallback((restoreFocus = true) => {
    setOpen(false)
    if (restoreFocus) toggleRef.current?.focus()
  }, [])

  // Focus trap, Esc to close, scroll lock while the mobile menu is open.
  useEffect(() => {
    if (!open) return
    const root = trapRef.current
    const focusables = () =>
      Array.from(root?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []).filter(
        (el) => el.offsetParent !== null,
      )
    document.getElementById(menuId)?.querySelector<HTMLElement>('a[href]')?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
        return
      }
      if (e.key !== 'Tab') return
      const items = focusables()
      const first = items[0]
      const last = items[items.length - 1]
      if (!first || !last) return
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    // Close if the viewport grows past the mobile breakpoint.
    const mq = window.matchMedia('(min-width: 1024px)')
    const onMq = () => mq.matches && close(false)

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    mq.addEventListener('change', onMq)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onMq)
    }
  }, [open, close, menuId])

  const linkClass = (id: string) =>
    `relative flex min-h-11 items-center px-3 font-mono text-xs tracking-[0.12em] uppercase transition-colors hover:text-titanium ${
      activeId === id ? 'text-titanium' : 'text-muted'
    }`

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        // No backdrop-filter while open: it would become the containing block for the fixed menu panel.
        open
          ? 'border-pitlane bg-carbon'
          : scrolled
            ? 'border-pitlane bg-carbon/85 backdrop-blur-md'
            : 'border-transparent bg-transparent'
      }`}
    >
      <div ref={trapRef}>
        <nav aria-label="Primary" className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
          <Wordmark />

          <ul className="hidden items-center lg:flex">
            {navItems.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className={linkClass(item.id)} aria-current={activeId === item.id ? 'true' : undefined}>
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-3 bottom-2 h-px origin-left bg-lime transition-transform duration-300 ${
                      activeId === item.id ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener"
              className="hidden min-h-11 items-center gap-1.5 border border-pitlane px-4 font-mono text-xs tracking-[0.12em] uppercase transition-colors hover:border-lime sm:inline-flex"
            >
              Résumé
              <ArrowUpRight aria-hidden="true" className="size-3.5" />
            </a>
            <button
              ref={toggleRef}
              type="button"
              className="inline-flex size-11 items-center justify-center border border-pitlane transition-colors hover:border-lime lg:hidden"
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => (open ? close() : setOpen(true))}
            >
              {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
            </button>
          </div>
        </nav>

        <div
          id={menuId}
          hidden={!open}
          className="fixed inset-x-0 top-16 bottom-0 overflow-y-auto border-t border-pitlane bg-carbon lg:hidden"
        >
          <ul className="mx-auto flex max-w-[1440px] flex-col px-4 py-6 sm:px-6">
            {navItems.map((item, i) => (
              <li key={item.id} className="border-b border-pitlane">
                <a
                  href={`#${item.id}`}
                  onClick={() => close(false)}
                  aria-current={activeId === item.id ? 'true' : undefined}
                  className={`flex min-h-14 items-baseline gap-4 py-3 font-display text-3xl font-bold uppercase ${
                    activeId === item.id ? 'text-lime' : 'text-titanium'
                  }`}
                >
                  <span className="font-mono text-xs font-normal text-muted">{String(i + 1).padStart(2, '0')}</span>
                  {item.label}
                </a>
              </li>
            ))}
            <li className="pt-6">
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener"
                onClick={() => close(false)}
                className="inline-flex min-h-11 items-center gap-2 border border-pitlane px-5 font-mono text-xs tracking-[0.12em] uppercase"
              >
                Résumé
                <ArrowUpRight aria-hidden="true" className="size-3.5" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}
