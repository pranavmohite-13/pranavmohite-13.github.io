// Team radio script. Replies are plain text (rendered as text, never HTML). Edit here.

export type RadioAction = { reply: string; goTo?: string; push?: boolean; clear?: boolean }

export const radioGreeting = 'Radio check, this is your race engineer. Type help, or tap a command below.'

export const radioChips = ['help', 'whoami', 'projects', 'box box', 'push']

/** Map one typed command to the engineer's reply and any side effect. */
export function radioReply(raw: string): RadioAction | null {
  const c = raw.trim().toLowerCase()
  if (!c) return null
  if (c === 'clear') return { reply: '', clear: true }
  if (c === 'help') return { reply: 'Commands:\nwhoami · projects · skills · hyrox · resume · contact · push · box box · clear' }
  if (c === 'whoami')
    return { reply: 'Pranav Mohite. Final-year cybersecurity student at SSPU Pune. Car 13. Heading toward cloud security and DevSecOps.' }
  if (c === 'projects')
    return {
      reply: 'Four cars in the garage: QuantumMail, OceanMind AI, Email Header Forensics, Flux. Taking you there now.',
      goTo: 'projects',
    }
  if (c === 'skills')
    return {
      reply: 'Python, TypeScript, Burp Suite, Nmap, Wireshark, Docker, GitHub Actions, scikit-learn and more. Jumping to telemetry.',
      goTo: 'skills',
    }
  if (c === 'hyrox' || c === 'running')
    return { reply: 'Target: first HYROX in 2027. Training is logged on Strava. Showing the data.', goTo: 'running' }
  if (c === 'resume' || c === 'cv') return { reply: 'Résumé is in the top bar, top right. One click, PDF.' }
  if (c === 'contact' || c === 'email' || c === 'hire')
    return { reply: 'pranavmohite1312@gmail.com\nPit wall is open. Taking you there.', goTo: 'contact' }
  if (c === 'push' || c === 'push push') return { reply: 'Copy. Push mode. Full throttle, DRS open.', push: true }
  if (c === 'box' || c === 'box box' || c === 'boxbox')
    return { reply: 'Box, box. Pit lane is open: test your reaction time.', goTo: 'reaction' }
  if (c.startsWith('sudo')) return { reply: 'Access denied. Least privilege applies on this car too.' }
  if (c === 'hello' || c === 'hi') return { reply: 'Loud and clear. Type help for commands.' }
  return { reply: 'Say again? Radio is breaking up. Type help.' }
}
