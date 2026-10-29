// Work history, newest first. Edit here, not in components.

export type Experience = {
  role: string
  company: string
  /** Display dates, e.g. "Jun 2026". */
  from: string
  to: string
  /** Machine-readable start/end (YYYY-MM) for <time>. */
  start: string
  end: string
  points: string[]
  tools?: string[]
}

export const experience: Experience[] = [
  {
    role: 'Project-Based Data Analyst Intern',
    company: 'Oppidan India Group',
    from: 'Jun 2026',
    to: 'Jul 2026',
    start: '2026-06',
    end: '2026-07',
    points: [
      'Cleaned and validated business, sales and survey datasets.',
      'Handled missing values, duplicates and format standardisation.',
    ],
    tools: ['Python', 'SQL', 'Excel'],
  },
  {
    role: 'Web Designing and Development Intern',
    company: 'Kalangan Arts',
    from: 'Jun 2025',
    to: 'Aug 2025',
    start: '2025-06',
    end: '2025-08',
    points: [
      'Built responsive pages, UI components, layouts and navigation.',
      'Handled frontend debugging and UI testing.',
    ],
    tools: ['HTML5', 'CSS3', 'JavaScript'],
  },
  {
    role: 'Cybersecurity and Web Development Intern',
    company: 'Technomind Machine Automation',
    from: 'Jun 2024',
    to: 'Aug 2024',
    start: '2024-06',
    end: '2024-08',
    points: [
      'Ran web application security assessments with Nmap and Burp Suite.',
      'Tracked remediation through to resolution.',
      'Built SmartStock, an automated tool inventory and procurement system.',
    ],
    tools: ['Nmap', 'Burp Suite'],
  },
]
