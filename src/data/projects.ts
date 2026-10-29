// Project content. Edit here, not in components.
// Rules: never invent metrics, repos, demos or results. Leave a field out
// (or empty) when there's nothing real to show; the UI hides it.

export type ProjectStatus = 'shipped' | 'in-development' | 'hidden'

export type Highlight = {
  /** Optional number to emphasise, e.g. "258". */
  metric?: string
  text: string
}

export type ProjectLinks = {
  github?: string
  demo?: string
}

export type CaseStudy = {
  problem?: string
  built?: string[]
  verified?: string[]
  result?: string[]
}

export type Project = {
  slug: string
  name: string
  /** One-line summary shown on the card. */
  summary: string
  stack: string[]
  status: ProjectStatus
  /** "My role" line. Leave out until confirmed. */
  role?: string
  team?: string
  /** Award or recognition line. */
  badge?: string
  highlights: Highlight[]
  links: ProjectLinks
  caseStudy: CaseStudy
}

export const projects: Project[] = [
  {
    slug: 'quantummail',
    name: 'QuantumMail (PQMail)',
    summary: 'An email client built to stay private even against future quantum computers.',
    stack: ['Python', 'Flask', 'SQLite'],
    status: 'shipped',
    // Shared team work, so no individual role line.
    team: 'Team project',
    // TODO(pranav): repo/demo URLs if public.
    highlights: [
      { metric: '24', text: 'security flaws found and fixed, including CSRF, key hijacking and path traversal' },
      { metric: '14', text: 'attack scenarios in a dedicated security testing lab' },
      { metric: '258', text: 'pytest unit tests' },
    ],
    links: {},
    caseStudy: {
      // REVIEW(pranav): problem statement drafted from the brief; edit freely.
      problem:
        'Email encrypted with classical key exchange alone can be captured today and decrypted later by a quantum-capable attacker. A secure client also has to survive ordinary web-application attacks.',
      built: [
        'Hybrid X25519 + ML-KEM-768 key exchange, ML-DSA-65 signatures and AES-256-GCM message encryption.',
        'TOTP two-factor authentication.',
        'A key transparency log so key changes are visible.',
        'Extended a BB84 QKD simulator with error correction.',
      ],
      verified: [
        '258 pytest unit tests.',
        'A 14-attack security testing lab exercising the app end to end.',
      ],
      result: ['Found and fixed 24 security flaws, including CSRF, key hijacking and path traversal.'],
    },
  },
  {
    slug: 'oceanmind',
    name: 'OceanMind AI',
    summary: 'Live marine risk monitoring built on real NOAA weather and AIS vessel data.',
    stack: ['React', 'TypeScript', 'Motoko', 'Vitest'],
    status: 'shipped',
    role: 'Fixed Broken Access Control (OWASP A01) in the Motoko backend with ownership validation checks.',
    team: 'Team of 5 · Ocean Sentinels',
    badge: 'INDRADHANU International Grand Challenge (PCCOE): Top 5 of 1,000+ teams · Special Category Award, ₹20,000',
    highlights: [
      { metric: '249', text: 'Vitest tests (~94% coverage of scoring logic) running in GitHub Actions CI' },
      { metric: '3', text: 'bugs exposed by the tests, including a scale mismatch that classified low-risk data as Critical' },
      { metric: '120 → 81', text: "flagged vessels on one day's dataset after adding loitering, data-gap and speed rules" },
    ],
    links: {},
    caseStudy: {
      // REVIEW(pranav): problem statement drafted from the brief; edit freely.
      problem:
        'A marine risk platform is only useful if its scores are right and its backend only lets users act on data they own. Over-flagging buries the vessels that matter.',
      built: [
        'Ownership validation checks in the Motoko backend, closing a Broken Access Control flaw (OWASP A01).',
        'Integration of real NOAA and AIS data.',
        'Loitering, data-gap and vessel-speed rules for risk scoring.',
      ],
      verified: [
        'A 249-test Vitest suite covering ~94% of the scoring logic, run on every push with GitHub Actions CI.',
        'The suite exposed 3 bugs, including a scale mismatch that classified low-risk data as Critical.',
      ],
      result: [
        "Flagged vessels cut from 120 to 81 on one day's dataset.",
        'Top 5 of 1,000+ teams at the INDRADHANU International Grand Challenge (PCCOE), with the Special Category Award (₹20,000).',
      ],
    },
  },
  {
    slug: 'email-header-forensics',
    name: 'Ensemble ML Email Header Forensics Framework',
    summary: 'Explainable ML that tells investigators why an email header looks suspicious.',
    stack: ['Python', 'Random Forest', 'XGBoost', 'Isolation Forest', 'SHAP'],
    status: 'in-development',
    highlights: [
      { text: 'Features from SPF, DKIM, DMARC, IP hops, timestamps and routing metadata' },
      { text: 'SHAP explainability gives investigators the reasons behind each flag' },
    ],
    links: {},
    caseStudy: {
      // REVIEW(pranav): problem statement drafted from the brief; edit freely.
      problem: 'A suspicion score on its own does not help an investigator. They need to know which parts of a header triggered it.',
      built: [
        'An ensemble of Random Forest, XGBoost and Isolation Forest models.',
        'Features drawn from SPF, DKIM and DMARC results, IP hops, timestamps and routing metadata.',
        'SHAP explanations attached to each flag.',
      ],
      // TODO(pranav): add verification and results once evaluated.
    },
  },
  {
    slug: 'flux',
    name: 'Flux',
    summary: 'Scans a web target for exposed services and missing security headers, then writes the fix-it report.',
    stack: ['Python', 'Nmap'],
    status: 'shipped',
    // Shared team work, so no individual role line.
    team: 'Team project',
    // TODO(pranav): repo URL if public.
    highlights: [
      { text: 'Automated Nmap port scanning to find exposed services' },
      { text: 'OWASP-aligned HTTP security headers analyzer' },
      { text: 'Auto-generated assessment reports with remediation steps' },
    ],
    links: {},
    caseStudy: {
      // REVIEW(pranav): problem statement drafted from the brief; edit freely.
      problem: 'Checking a web target for exposed services and missing security headers by hand is slow and easy to do inconsistently.',
      built: [
        'Automated Nmap port scanning to find exposed services.',
        'An HTTP security headers analyzer aligned with OWASP guidance.',
        'Auto-generated assessment reports with remediation steps.',
      ],
    },
  },
  {
    // Reserved slot for the upcoming solo cybersecurity project.
    // Set status to 'shipped' or 'in-development' once filled in.
    slug: 'next-solo-project',
    name: 'TODO',
    summary: '',
    stack: [],
    status: 'hidden',
    highlights: [],
    links: {},
    caseStudy: {},
  },
]

export type ArchiveEntry = {
  name: string
  /** One line. Entries without a summary are not rendered. */
  summary?: string
  tags: string[]
  link?: string
}

export const archive: ArchiveEntry[] = [
  {
    name: 'FLOState',
    summary: 'Environment-aware (water/carbon) orchestration for AI workloads.',
    tags: ['Smart India Hackathon 2026'],
    // TODO(pranav): stack and link.
  },
  {
    name: 'SmartStock',
    summary: 'Automated tool inventory and procurement system.',
    tags: ['Technomind internship'],
    // No code link unless confirmed.
  },
  {
    name: 'Kalangan Arts website',
    summary: 'Responsive website built for Kalangan Arts during my web development internship.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Internship'],
    // TODO(pranav): link only if confirmed public.
  },
  {
    name: 'WhatsApp/SMS scam detection',
    summary: 'Flags scam messages with NLP, URL analysis and OCR.',
    tags: ['NLP', 'URL analysis', 'OCR', 'College research'],
  },
]

export const visibleProjects = projects.filter((p) => p.status !== 'hidden')
export const visibleArchive = archive.filter((a) => a.summary?.trim())
