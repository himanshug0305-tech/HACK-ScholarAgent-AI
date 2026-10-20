export function BrandMark({ size = 38, onDark = false, className = '' }) {
  return (
    <span
      className={`relative inline-flex flex-none items-center justify-center overflow-hidden rounded-[13px] ${className}`}
      style={{
        width: size,
        height: size,
        background: onDark ? '#f4efe3' : '#173b2f',
      }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 40 40" width={size} height={size} fill="none">
        <path
          d="M10 28V19.5C10 14.25 14.25 10 19.5 10h1C25.75 10 30 14.25 30 19.5V28"
          stroke={onDark ? '#173b2f' : '#f4efe3'}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="20" cy="20" r="3.3" fill="#e3ab4c" />
        <path
          d="M8.5 30.5h23"
          stroke={onDark ? '#173b2f' : '#f4efe3'}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="31.5" cy="10.5" r="1.5" fill="#bb5231" />
      </svg>
    </span>
  )
}

export function Brand({ onDark = false, compact = false, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <BrandMark size={compact ? 34 : 40} onDark={onDark} />
      <span className="flex flex-col">
        <span
          className={`font-display text-[21px] leading-none tracking-[-0.025em] ${
            onDark ? 'text-ivory' : 'text-ink'
          }`}
        >
          ScholarAgent
          <span className="ml-1 inline-block h-1 w-1 rounded-full bg-clay align-middle" />
        </span>
        {!compact && (
          <span
            className={`mt-1.5 font-mono text-[8.5px] uppercase leading-none tracking-[0.19em] ${
              onDark ? 'text-ivory/55' : 'text-muted'
            }`}
          >
            Your scholarship desk
          </span>
        )}
      </span>
    </span>
  )
}
