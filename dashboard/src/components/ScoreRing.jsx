export function ScoreRing({
  score,
  size = 96,
  stroke = 6,
  tone = 'forest',
  label = 'match',
  className = '',
  showLabel = true,
}) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const dash = (Math.max(0, Math.min(100, score)) / 100) * circumference
  const color = {
    forest: '#173b2f',
    clay: '#bb5231',
    honey: '#c99435',
    cream: '#f4efe3',
    danger: '#9f402c',
  }[tone]

  return (
    <div className={`relative inline-flex flex-none items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={tone === 'cream' ? 'rgba(244,239,227,.18)' : '#e6ddcb'}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
          style={{ transition: 'stroke-dasharray 700ms cubic-bezier(.22,.8,.22,1)' }}
        />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={`font-display leading-none tracking-[-0.04em] ${
            size >= 92 ? 'text-[28px]' : 'text-[22px]'
          } ${tone === 'cream' ? 'text-ivory' : 'text-ink'}`}
        >
          {score}
          <span className={`ml-0.5 text-[12px] ${tone === 'cream' ? 'text-ivory/60' : 'text-muted'}`}>%</span>
        </span>
        {showLabel && (
          <span
            className={`mt-1 font-mono text-[7.5px] uppercase tracking-[0.16em] ${
              tone === 'cream' ? 'text-ivory/60' : 'text-muted'
            }`}
          >
            {label}
          </span>
        )}
      </span>
      <span className="sr-only">{score} percent {label}</span>
    </div>
  )
}
