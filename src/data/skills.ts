// Skill groups. Tags only: no percentages or self-ratings.

export type SkillGroup = { name: string; skills: string[] }

export const skillGroups: SkillGroup[] = [
  {
    name: 'Security',
    skills: [
      'Vulnerability Assessment',
      'Application Security',
      'OWASP Top 10',
      'Broken Access Control',
      'Threat Modeling',
      'Security Testing',
      'Post-Quantum Cryptography',
    ],
  },
  { name: 'Security tools', skills: ['Burp Suite', 'Nmap', 'Wireshark', 'Metasploit'] },
  { name: 'Languages', skills: ['Python', 'C/C++', 'TypeScript', 'SQL', 'Motoko', 'HTML/CSS/JS'] },
  {
    name: 'Frameworks & testing',
    skills: ['Flask', 'React', 'pytest', 'Vitest', 'Unit/integration testing', 'Test automation'],
  },
  { name: 'DevOps', skills: ['Git', 'GitHub Actions', 'CI/CD', 'Docker'] },
  {
    name: 'AI/ML',
    skills: ['scikit-learn', 'XGBoost', 'Random Forest', 'SHAP', 'Supervised learning', 'Unsupervised learning'],
  },
  {
    name: 'Systems & networking',
    skills: ['Linux', 'Windows', 'TCP/IP', 'DNS', 'Network security', 'Access control'],
  },
]
