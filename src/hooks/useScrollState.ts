import { useEffect, useState } from 'react'

/**
 * Tracks whether the page has scrolled past `threshold` and which section (by id)
 * currently sits under the sticky header. Returns `null` while the hero is in view.
 */
export function useScrollState(sectionIds: readonly string[], threshold = 8) {
  const [scrolled, setScrolled] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      setScrolled(window.scrollY > threshold)

      // Probe a line roughly a third of the way down the viewport.
      const probe = window.innerHeight * 0.35
      let current: string | null = null
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= probe) current = id
      }
      // At the very bottom, the last section wins even if it's short.
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      if (atBottom && window.scrollY > 0) current = sectionIds[sectionIds.length - 1] ?? current
      setActiveId(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [sectionIds, threshold])

  return { scrolled, activeId }
}
