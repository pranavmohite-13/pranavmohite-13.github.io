import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Radio } from 'lucide-react'
import { radioChips, radioGreeting, radioReply } from '@/data/radio'
import { bump, MAX_SPEED } from '@/telemetry/engine'
import { prefersReducedMotion } from '@/intro/lights'

type Message = { id: number; who: 'you' | 'eng'; text: string }

let nextId = 1
const greeting = (): Message => ({ id: nextId++, who: 'eng', text: radioGreeting })

function goTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
}

/**
 * Team radio: a button docked in the telemetry HUD that opens a small non-modal command console
 * directly above the HUD, anchored bottom-right.
 * Input is treated as plain text and rendered as text only. Nothing is stored or sent.
 */
export function TeamRadio() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [log, setLog] = useState<Message[]>(() => [greeting()])
  const dialogId = useId()
  const titleId = `${dialogId}-title`
  const toggleRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [log, open])

  const close = () => {
    setOpen(false)
    toggleRef.current?.focus()
  }

  const send = (raw: string) => {
    const action = radioReply(raw)
    setInput('')
    if (!action) return
    if (action.clear) {
      setLog([])
      return
    }
    setLog((current) => [...current, { id: nextId++, who: 'you', text: raw.trim() }, { id: nextId++, who: 'eng', text: action.reply }])
    if (action.push) bump({ speed: MAX_SPEED, thr: 100 })
    // Called from the submit/click handler, so the browser treats it as a user-initiated popup.
    if (action.open) window.open(action.open, '_blank', 'noopener')
    const target = action.goTo
    if (target) window.setTimeout(() => goTo(target), 350)
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    send(input)
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      close()
    }
  }

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        aria-label="Team radio"
        aria-expanded={open}
        aria-controls={dialogId}
        onClick={() => (open ? close() : setOpen(true))}
        className={`inline-flex size-11 shrink-0 items-center justify-center gap-2 border border-lime font-mono text-xs font-bold tracking-[0.14em] uppercase transition-colors lg:w-auto lg:px-3.5 ${
          open ? 'bg-lime text-carbon' : 'text-titanium hover:bg-surface'
        }`}
      >
        <Radio aria-hidden="true" className="size-4" />
        <span className="hidden lg:inline">Radio</span>
      </button>

      <div
        id={dialogId}
        role="dialog"
        aria-labelledby={titleId}
        hidden={!open}
        onKeyDown={onKeyDown}
        className="fixed right-4 bottom-[64px] flex h-[min(420px,calc(100svh-136px))] w-[380px] max-w-[calc(100vw-32px)] flex-col border border-lime bg-[#0e100f] shadow-[0_24px_60px_rgba(0,0,0,0.65)] select-text lg:right-5 lg:bottom-[88px] lg:h-[min(420px,calc(100svh-168px))]"
      >
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-[#1d221f] px-3.5 py-3">
          <h2 id={titleId} className="telemetry-label shrink-0 tracking-[0.08em] whitespace-nowrap text-lime">
            Team radio · Car 13
          </h2>
          <span className="telemetry-label tracking-[0.08em] whitespace-nowrap">Encrypted, obviously</span>
        </div>

        <div ref={logRef} role="log" aria-label="Radio messages" className="flex flex-1 flex-col gap-3 overflow-y-auto p-3.5">
          {log.map((m) => (
            <div key={m.id} className={m.who === 'you' ? 'max-w-[85%] self-end text-right' : 'max-w-[92%]'}>
              <span className={`telemetry-label ${m.who === 'you' ? 'text-lime' : ''}`}>{m.who === 'you' ? 'You' : 'Race engineer'}</span>
              <p className="mt-0.5 text-sm leading-normal whitespace-pre-line">{m.text}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5 px-3.5 pb-2.5">
          {radioChips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => send(chip)}
              className="min-h-10 border border-pitlane px-3 font-mono text-[11px] tracking-[0.08em] uppercase transition-colors hover:border-lime"
            >
              {chip}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="flex border-t border-[#1d221f]">
          <label htmlFor={`${dialogId}-input`} className="sr-only">
            Radio command
          </label>
          <input
            ref={inputRef}
            id={`${dialogId}-input`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={120}
            autoComplete="off"
            spellCheck={false}
            placeholder="type a command, e.g. whoami"
            className="min-h-12 min-w-0 flex-1 bg-transparent px-3.5 font-mono text-[13px] text-titanium placeholder:text-muted focus-visible:outline-none focus-visible:[box-shadow:inset_0_0_0_2px_var(--accent)]"
          />
          <button
            type="submit"
            className="min-h-12 border-l border-[#1d221f] px-4 font-mono text-xs tracking-[0.14em] uppercase transition-colors hover:bg-surface"
          >
            Send
          </button>
        </form>
      </div>
    </>
  )
}
