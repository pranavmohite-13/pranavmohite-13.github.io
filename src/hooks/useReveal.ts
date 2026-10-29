import { useEffect } from 'react'

/**
 * Reveals every `[data-reveal]` element once as it scrolls into view.
 * Elements are only hidden after this runs (via the `reveal-ready` class on <html>),
 * so content stays visible if JS or IntersectionObserver is unavailable.
 * Reduced motion is handled in CSS: revealed state is forced on.
 */
export function useReveal() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const root = document.documentElement
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))

    // Anything already on screen at load shows immediately, without animating.
    const vh = window.innerHeight
    for (const el of els) {
      if (el.getBoundingClientRect().top < vh) el.classList.add('is-revealed')
    }
    root.classList.add('reveal-ready')

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-revealed')
          io.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    )
    for (const el of els) if (!el.classList.contains('is-revealed')) io.observe(el)

    return () => {
      io.disconnect()
      root.classList.remove('reveal-ready')
    }
  }, [])
}
