// Decorative, stylised speed trace. Not data: no values or axes are implied.
// Drawn once via stroke-dashoffset; static when reduced motion is preferred.

const TRACE =
  'M0 118 L70 116 C110 114 130 60 170 46 L300 40 C330 39 345 96 372 112 C392 122 410 110 430 84' +
  ' C455 52 480 36 520 34 L610 32 C640 31 652 128 690 132 C720 134 735 100 760 76 C790 48 820 42 860 40' +
  ' L930 39 C960 39 972 88 996 98 C1018 106 1032 70 1060 56 C1090 42 1130 40 1200 38'

const SECTOR_X = [400, 800]

export function TelemetryLine({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1200 160"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {[40, 80, 120].map((y) => (
        <line key={y} x1="0" x2="1200" y1={y} y2={y} stroke="var(--color-pitlane)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      ))}
      {SECTOR_X.map((x) => (
        <line
          key={x}
          x1={x}
          x2={x}
          y1="8"
          y2="152"
          stroke="var(--color-pitlane)"
          strokeWidth="1"
          strokeDasharray="3 5"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      <path
        d={TRACE}
        pathLength={1}
        stroke="var(--color-lime)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1"
        vectorEffect="non-scaling-stroke"
        className="animate-draw"
      />
    </svg>
  )
}
