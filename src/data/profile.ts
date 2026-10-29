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

export const about = {
  bio: [
    "I'm a final-year cybersecurity student who likes finding where a system gives way: a missing access check, a key that can be swapped, a risk score on the wrong scale.",
    'Then I fix it and write the tests that prove it stays fixed.',
    "Away from the keyboard, I'm training for my first HYROX in 2027.",
  ],
  direction:
    "Building toward cloud security, DevSecOps and agentic AI security. Long-term, I want to build my own company.",
  education: {
    degree: 'B.Tech, CS & IT (Cybersecurity)',
    school: 'Symbiosis Skills and Professional University, Pune',
    dates: 'Aug 2023 – Jun 2027',
    grade: 'CGPA 8.1',
  },
  achievements: [
    {
      title: 'INDRADHANU International Grand Challenge',
      detail: 'Top 5 of 1,000+ teams · Special Category Award, ₹20,000 (OceanMind AI)',
    },
    { title: 'Smart India Hackathon 2025', detail: 'Top 10 university teams' },
  ],
  certifications: [
    { title: 'Oracle Agentic AI Foundations Associate', detail: '1Z0-1157-26' },
    { title: 'Saylor Academy: Information Security', detail: 'CS406' },
    { title: 'Saylor Academy: Computer Networks', detail: 'CS402' },
    { title: 'Saylor Academy: Modern Database Systems', detail: 'CS403' },
  ],
  languages: ['English', 'Hindi', 'Marathi', 'German (basic)'],
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
