// Site-wide profile content. Edit here, not in components.

export const profile = {
  name: 'Pranav Mohite',
  shortMark: 'PM',
  driverLabel: 'Driver 13 · Pune, IN',
  headline: ['Performance', 'under pressure.'],
  summary:
    'Final-year cybersecurity student. I find what breaks, fix it, and prove the fix with tests. Heading toward cloud security and DevSecOps.',
  tags: ['Cybersecurity', 'DevSecOps', 'Endurance'],
  // Real, verifiable numbers only.
  readout: [
    { value: '3', label: 'Internships' },
    { value: '500+', label: 'Tests written' },
    { value: 'Top 5', label: 'of 1,000+ teams' },
  ],
  resumeUrl: '/Pranav_Mohite_Resume.pdf',
} as const

export type NavItem = { id: string; label: string }

export const navItems: NavItem[] = [
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'running', label: 'Running' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
]
